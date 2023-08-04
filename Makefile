# ===========
# PRODUCTION
# ===========

start:
	echo 'Starting PROD container'
	docker-compose -f docker-compose.yml up -d
#

log-listen:
	echo 'Starting PROD container'
	docker-compose -f docker-compose.yml up
#

update-scores-web:
	echo 'Updating PROD Scores Web container...'
	git pull origin main
	# -docker rm $$(docker stop $$(docker ps -a -q --filter="name=scores_scores_web_1" --format="{{.ID}}"))
	# -docker rmi $$(docker images -q scores_web)
	# -docker rmi $$(docker images --filter "dangling=true" -q --no-trunc)
	# docker-compose -f docker-compose.yml up -d
	docker-compose -f docker-compose.yml up -d --build
#

# ===========
# DEVELOPMENT
# ===========

heroku-dev-deploy-current:
	@echo \
		"\n**************************************\
		\n🚀 Pushing current branch to Heroku-Dev\
		\n**************************************\
		\n"
	@git push heroku-dev $$(git branch --show-current):main -f
#

dev-start:
	echo 'Starting DEV Environment'
	npm run dev
	echo 'Removing Old DEV Logs'
	-rm -r ./datalog/*
	echo 'DEV Ready!'
#

dev-docker-start:
	echo 'Starting DEV - Docker Environment'
	echo 'Removing Old DEV Logs'
	-rm -r ./datalog/*
	docker-compose -f docker-compose.dev.yml up
	echo 'DEV Ready!'
#

dev-clean:
	echo 'Removing Old DEV Logs'
	rm -r ./datalog/
#

preview-1-click-spin:
	-rm -r ./build
	npm run build
	npm run preview
#

git-post-main-pr:
	# After PR -> (main) - run (this) to get local/dev in pair with (main)
	echo 'Checking out to MAIN'
	git checkout main
	echo 'Pulling new changes from MAIN'
	git pull origin main
	echo 'Checkout to DEV'
	git checkout dev
	echo 'Resetting to MAIN'
	git reset --hard main
#

git-del-branches-w-origin:
	echo 'Deleting branches not present in origin + /dev'
	# Original command (below) is without \(...\) syntax
	# git fetch -p ; git branch -r | awk '{print $$1}' | egrep -v -f /dev/fd/0 <\(git branch -vv | grep origin\) | awk '{print $$1}' | xargs git branch -D
	# git branch --merged | grep -v "*" | grep -v "main" | xargs git branch -d
#