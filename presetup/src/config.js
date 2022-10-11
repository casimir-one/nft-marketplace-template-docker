require('dotenv').config({
  path: __dirname + '/' +
    (process.env.DEIP_CONFIG ? ('.' + process.env.DEIP_CONFIG + '.env') : '.config.env')
});

function parseJsonEnvVar(jsonEnvVarName, defaultValue) {
  const jsonEnvVar = process.env[jsonEnvVarName];
  if (!jsonEnvVar && defaultValue === undefined)
    throw new Error(jsonEnvVarName + " json environment variable is not defined. Specify it in the config or provide a default value");
  return jsonEnvVar ? JSON.parse(jsonEnvVar) : defaultValue;
}

function parseIntEnvVar(intEnvVarName, defaultValue) {
  const intEnvVar = process.env[intEnvVarName];
  if (!intEnvVar && defaultValue === undefined)
    throw new Error(intEnvVarName + " int environment variable is not defined. Specify it in the config or provide a default value");
  return intEnvVar ? parseInt(intEnvVar) : defaultValue;
}

const config = {
  PROTOCOL_CHAIN: parseIntEnvVar('PROTOCOL_CHAIN'),
  APPCHAIN_NODE_URL: process.env.APPCHAIN_NODE_URL || null,
  APPCHAIN_MILLISECS_PER_BLOCK: parseIntEnvVar('APPCHAIN_MILLISECS_PER_BLOCK'),
  APPCHAIN_CORE_ASSET: parseJsonEnvVar('APPCHAIN_CORE_ASSET'),
  TENANT: parseJsonEnvVar('TENANT'),
  TENANT_PORTAL: parseJsonEnvVar('TENANT_PORTAL'),
  PORTAL_USERS: parseJsonEnvVar('PORTAL_USERS'),
  PORTAL_STORAGE_URL: process.env.PORTAL_STORAGE_URL || null,
  FAUCET_SEED: parseJsonEnvVar('FAUCET_SEED'),
  FAUCET_DAO: parseJsonEnvVar('FAUCET_DAO'),
  USER_SEED_FUNDING_AMOUNT: process.env.USER_SEED_FUNDING_AMOUNT || "0",
  USER_DAO_FUNDING_AMOUNT: process.env.USER_DAO_FUNDING_AMOUNT || "0",
};

module.exports = config;