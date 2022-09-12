import config from './config';
import { ChainService, SubstrateChainUtils } from '@casimir.one/chain-service';
import { genSha256Hash } from '@casimir.one/toolbox';
import { u8aToHex } from '@polkadot/util';
import { Keyring } from '@polkadot/api';
import { MongoTools } from 'node-mongotools';
import {
  CreateDaoCmd,
  TransferFTCmd,
  CreatePortalCmd
} from '@casimir.one/commands';


const PROTOCOL_CHAIN = {
  'GRAPHENE': 1,
  1: 'GRAPHENE',
  'SUBSTRATE': 2,
  2: 'SUBSTRATE'
}


setupTenantPortal()
  .then(() => {
    console.log('\nRunning Casimir tx-builder...\n');
  })
  .then(() => {
    console.log('Successfully finished !');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });


async function setupTenantPortal() {
  console.log(`Setting up Tenant Portal ...`);
  await createReadModelStorage();
  await createFaucetDao();
  await createTenantDao();
  await createUsersDaos();
  console.log(`Tenant Portal is set successfully`);
}


async function getChainService() {
  const chainService = await ChainService.getInstanceAsync({
    PROTOCOL: config.PROTOCOL_CHAIN,
    DEIP_FULL_NODE_URL: config.APPCHAIN_NODE_URL,
    CORE_ASSET: config.APPCHAIN_CORE_ASSET
  });
  return chainService;
}


async function createFaucetDao() {
  const chainService = await getChainService();
  const chainTxBuilder = chainService.getChainTxBuilder();
  const api = chainService.getChainNodeClient();
  const rpc = chainService.getChainRpc();
  const { daoId: faucetDaoId, privKey: faucetPrivKey, treasuryAmount } = config.FAUCET_DAO;

  const existingFaucetDao = await rpc.getAccountAsync(faucetDaoId);
  if (existingFaucetDao)
    return existingFaucetDao;

  const owner = { auths: [], weight: 1 };
  if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL_CHAIN) {
    const seedPubKey = u8aToHex(getFaucetSeedAccount().publicKey).substring(2);
    owner.auths.push({ key: seedPubKey })
  } else {
    owner.auths.push({ name: faucetDaoId })
  }

  console.log(`Creating Faucet DAO ...`);
  const createFaucetDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: faucetDaoId,
        authority: { owner },
        creator: "faucet",
        memoKey: "faucet",
        description: genSha256Hash({ "description": "Faucet DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });
      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });

  const createFaucetDaoTxSigned = await createFaucetDaoTx.signAsync(faucetPrivKey, api);
  await sendTxAndWaitAsync(createFaucetDaoTxSigned);
  const faucetDao = await rpc.getAccountAsync(faucetDaoId);
  console.log(`Faucet DAO created`, faucetDao);

  if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL_CHAIN) {
    const faucetDaoAddress = daoIdToSubstrateAddress(faucetDaoId, api);
    const tx = api.tx.balances.transfer(faucetDaoAddress, treasuryAmount);
    await tx.signAsync(getFaucetSeedAccount());
    await api.rpc.author.submitExtrinsic(tx.toHex());
    await waitAsync(config.APPCHAIN_MILLISECS_PER_BLOCK);
  }

  return faucetDao;
}


async function createTenantDao() {
  const chainService = await getChainService();
  const chainTxBuilder = chainService.getChainTxBuilder();
  const api = chainService.getChainNodeClient();
  const rpc = chainService.getChainRpc();
  const { daoId: tenantDaoId, privKey: tenantPrivKey } = config.TENANT;
  const { pubKey: verificationPubKey } = config.TENANT_PORTAL;

  const tenantSeed = await chainService.generateChainSeedAccount({ username: tenantDaoId, privateKey: tenantPrivKey });

  const existingTenantDao = await rpc.getAccountAsync(tenantDaoId);
  if (!existingTenantDao) {
    console.log(`Creating Tenant DAO ...`);
    await fundAddressFromFaucet(tenantSeed.getPubKey(), config.USER_SEED_FUNDING_AMOUNT);
    const createTenantDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
      .then((txBuilder) => {
        const createDaoCmd = new CreateDaoCmd({
          entityId: tenantDaoId,
          authority: {
            owner: {
              auths: [{ key: tenantSeed.getPubKey(), weight: 1 }],
              weight: 1
            }
          },
          creator: getDaoCreator(tenantSeed),
          description: genSha256Hash({ "description": "Tenant DAO" }),
          // offchain
          isTeamAccount: true,
          attributes: []
        });

        txBuilder.addCmd(createDaoCmd);
        return txBuilder.end();
      });

    const createTenantDaoByTenantSeedTx = await createTenantDaoTx.signAsync(getDaoCreatorPrivKey(tenantSeed), api);
    await sendTxAndWaitAsync(createTenantDaoByTenantSeedTx);
    await fundAddressFromFaucet(tenantDaoId, config.USER_DAO_FUNDING_AMOUNT);

    const createdTenantDao = await rpc.getAccountAsync(tenantDaoId);
    console.log(`Tenant DAO created`, createdTenantDao);

    console.log(`Creating Tenant Portal ...`);
    const createTenantPortalTx = await chainTxBuilder.begin({ ignorePortalSig: true })
      .then((txBuilder) => {
        const createPortalCmd = new CreatePortalCmd({
          owner: tenantDaoId,
          verificationPubKey: verificationPubKey,
          metadata: genSha256Hash({ "description": "DAO delegate" })
        })
        txBuilder.addCmd(createPortalCmd);
        return txBuilder.end();
      });

      const createTenantPortalByTenantTx = await createTenantPortalTx.signAsync(getDaoCreatorPrivKey(tenantSeed), api);
      await sendTxAndWaitAsync(createTenantPortalByTenantTx);
      const portal = await rpc.getPortalAsync(tenantDaoId);
      console.log(`Tenant Portal created`, portal);

      console.log(`Funding Tenant Portal ...`);
      await fundAddressFromFaucet(verificationPubKey, config.USER_SEED_FUNDING_AMOUNT);
      console.log(`End funding Tenant Portal`);
  }

  const tenantDao = await rpc.getAccountAsync(tenantDaoId);
  console.log(`Tenant DAO finalized`, tenantDao);
  return tenantDao;
}


async function createUsersDaos() {
  const chainService = await getChainService();
  const chainTxBuilder = chainService.getChainTxBuilder();
  const api = chainService.getChainNodeClient();
  const rpc = chainService.getChainRpc();

  const users = config.PORTAL_USERS;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { daoId: userDaoId, password, privKey } = user;

    const userSeed = await chainService.generateChainSeedAccount({ username: userDaoId, password, privateKey: privKey });

    const existingTenantMemberDao = await rpc.getAccountAsync(userDaoId);
    if (!existingTenantMemberDao) {
      console.log(`Creating User DAO ...`);
      await fundAddressFromFaucet(userSeed.getPubKey(), config.USER_SEED_FUNDING_AMOUNT);
      const createUserDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
        .then((txBuilder) => {
          const createDaoCmd = new CreateDaoCmd({
            entityId: userDaoId,
            authority: {
              owner: {
                auths: [{ key: userSeed.getPubKey(), weight: 1 }],
                weight: 1
              }
            },
            creator: getDaoCreator(userSeed),
            description: genSha256Hash({ "description": "User DAO" }),
            // offchain
            isTeamAccount: false,
            attributes: []
          });

          txBuilder.addCmd(createDaoCmd);
          return txBuilder.end();
        });

      const createUserDaoByUserSeedTx = await createUserDaoTx.signAsync(getDaoCreatorPrivKey(userSeed), api);
      await sendTxAndWaitAsync(createUserDaoByUserSeedTx);
      await fundAddressFromFaucet(userDaoId, config.USER_DAO_FUNDING_AMOUNT);

      const createdUserDao = await rpc.getAccountAsync(userDaoId);
      console.log(`User DAO`, createdUserDao);
    }
  }
}


async function createReadModelStorage() {
  const mongoTools = new MongoTools();
  const mongorestorePromise = mongoTools.mongorestore({
    uri: config.PORTAL_STORAGE_URL,
    dumpFile: `${__dirname}/nft-marketplace-storage.gz`,
  })
    .then((success) => {
      console.info("success", success.message);
      if (success.stderr) {
        console.info("stderr:\n", success.stderr); // mongorestore binary write details on stderr
      }
    })
    .catch((err) => console.error("error", err));

  await mongorestorePromise;
}


function getDaoCreator(seed) {
  const { daoId: faucetDaoId } = config.FAUCET_DAO;
  if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL_CHAIN) {
    return seed.getUsername();
  }
  return faucetDaoId;
}


function getDaoCreatorPrivKey(seed) {
  const { privKey: faucetPrivKey } = config.FAUCET_DAO;
  if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL_CHAIN) {
    return seed.getPrivKey();
  }
  return faucetPrivKey;
}


async function fundAddressFromFaucet(daoIdOrAddress, amount) {
  if (!amount) return;

  const chainService = await getChainService();
  const chainTxBuilder = chainService.getChainTxBuilder();
  const api = chainService.getChainNodeClient();
  const { daoId: faucetDaoId, privKey: faucetPrivKey } = config.FAUCET_DAO;

  const fundDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
    .then((txBuilder) => {

      const transferAssetCmd = new TransferFTCmd({
        from: faucetDaoId,
        to: daoIdOrAddress,
        tokenId: config.APPCHAIN_CORE_ASSET.id,
        amount: amount,
        precision: config.APPCHAIN_CORE_ASSET.precision
      });

      txBuilder.addCmd(transferAssetCmd);
      return txBuilder.end();
    });

  const fundDaoTxSigned = await fundDaoTx.signAsync(faucetPrivKey, api);
  await sendTxAndWaitAsync(fundDaoTxSigned);
}


async function sendTxAndWaitAsync(finalizedTx, timeout = config.APPCHAIN_MILLISECS_PER_BLOCK) {
  const chainService = await getChainService();
  const rpc = chainService.getChainRpc();
  const api = chainService.getChainNodeClient();

  const { pubKey: verificationPubKey, privKey: verificationPrivKey } = config.TENANT_PORTAL;
  const { tx } = finalizedTx.getPayload();

  const verifiedTxPromise = tx.isOnBehalfPortal()
    ? tx.verifyByPortalAsync({ verificationPubKey, verificationPrivKey }, api)
    : Promise.resolve(tx.getSignedRawTx());

  const verifiedTx = await verifiedTxPromise;
  const txHash = await rpc.sendTxAsync(verifiedTx);
  console.log("txHash -->", txHash);

  await waitAsync(timeout);

  return txHash;
}


function daoIdToSubstrateAddress(daoId, api) {
  const address = SubstrateChainUtils.daoIdToAddress(toHexFormat(daoId), api.registry);
  return address;
}


function getFaucetSeedAccount() {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyringPair = keyring.createFromJson(config.FAUCET_SEED);
  keyringPair.unlock();
  return keyringPair;
}


function toHexFormat(id) {
  const hexId = id.indexOf(`0x`) === 0 ? id : `0x${id}`;
  return hexId;
}


async function waitAsync(timeout = config.APPCHAIN_MILLISECS_PER_BLOCK) {
  return new Promise(async (resolve, reject) => {
    try {
      setTimeout(() => resolve(), timeout);
    } catch (err) {
      reject(err);
    }
  });
}