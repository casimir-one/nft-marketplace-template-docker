start:
		sh ./demo/start.sh

clean:
		sh ./demo/clean.sh

restart: clean start

start-local:
		sh ./local/start.sh

clean-local:
		sh ./local/clean.sh

restart-local: clean-local start-local