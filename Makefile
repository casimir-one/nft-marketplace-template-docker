start-demo:
		sh ./demo/start.sh

stop-demo:
		sh ./demo/stop.sh


start-local:
		sh ./local/start.sh 0

stop-local:
		sh ./local/stop.sh 0


start-backend-frontend-dev:
		sh ./local/start.sh 1

stop-backend-frontend-dev:
		sh ./local/stop.sh 1


start-frontend-dev:
		sh ./local/start.sh 2

stop-frontend-dev:
		sh ./local/stop.sh 2