start-demo:
		sh ./demo/start.sh

clean-demo:
		sh ./demo/clean.sh

restart-demo: clean-demo start-demo


start-local:
		sh ./local/start.sh 0

clean-local:
		sh ./local/clean.sh 0

restart-local: clean-local start-local


start-dev:
		sh ./local/start.sh 1

clean-dev:
		sh ./local/clean.sh 1

restart-dev: clean-dev start-dev