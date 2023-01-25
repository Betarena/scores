# ===========
# PRODUCTION
# ===========

start:
	echo 'Starting PROD container'
	docker-compose -f docker-compose.yml up -d

log-listen:
	echo 'Starting PROD container'
	docker-compose -f docker-compose.yml up

update-scores-web:
	echo 'Updating PROD Scores Web container...'
	git pull origin main
	-docker rm $$(docker stop $$(docker ps -a -q --filter="name=scores_scores_web_1" --format="{{.ID}}"))
	-docker rmi $$(docker images -q scores_web)
	-docker rmi $$(docker images --filter "dangling=true" -q --no-trunc)
	docker-compose -f docker-compose.yml up -d

# ===========
# DEVELOPMENT
# ===========

dev-start:
	echo 'Starting DEV Environment'
	npm run dev
	echo 'Removing Old DEV Logs'
	-rm -r ./datalog/*
	echo 'DEV Ready!'

dev-docker-start:
	echo 'Starting DEV - Docker Environment'
	echo 'Removing Old DEV Logs'
	-rm -r ./datalog/*
	docker-compose -f docker-compose.dev.yml up
	echo 'DEV Ready!'

dev-clean:
	echo 'Removing Old DEV Logs'
	rm -r ./datalog/

# from Develop and assuming your master is up to date with origin/master
# git-post-main-pr:
# 	git checkout main
# 	git pull origin main
# 	git checkout dev
# 	git reset --hard main
