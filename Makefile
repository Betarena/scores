# ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
# 🚀 PRODUCTION                                                      ◼️
# ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

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

# ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
# 🛠️ DEVELOPEMNT                                                     ◼️
# ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

COLOUR_GREEN=\033[0;32m
COLOUR_RED=\033[0;31m
COLOUR_BLUE=\033[0;34m
END_COLOUR=\033[0m

heroku-prod-deploy-current:
	@echo \
		"$(COLOUR_RED)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🚀 Pushing current branch to Heroku-Prod  ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@git push heroku-prod $$(git branch --show-current):main -f
#

heroku-prod-secrets-update:
	@echo \
		"$(COLOUR_RED)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Prod | Updating Secrets        ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@heroku config:set --remote heroku-prod $$(grep -v '^#' .env | xargs)
	@echo ""
#

heroku-dev-deploy-current:
	@echo \
		"$(COLOUR_GREEN)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🚀 Pushing current branch to Heroku-Dev  ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@git push heroku-dev $$(git branch --show-current):main -f
#

heroku-dev-secrets-update:
	@echo \
		"$(COLOUR_GREEN)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Dev | Updating Secrets         ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@heroku config:set --remote heroku-dev $$(grep -v '^#' .env | xargs)
	@echo ""
#

dev-docker-start:
	echo 'Starting DEV - Docker Environment'
	echo 'Removing Old DEV Logs'
	-rm -r ./datalog/*
	docker-compose -f docker-compose.dev.yml up
	echo 'DEV Ready!'
#

dev-local-clear-build-quick:
	-rm -r ./.svelte-kit/
#

dev-local-deploy:
	npm run dev
#

dev-local-scores-lib-link:
	npm run @betarena/scores-lib:link
#

dev-1-click-spin: ; ${MAKE} -j2 dev-local-clear-build-quick dev-local-deploy dev-local-scores-lib-link
#

preview-1-click-spin:
	-rm -r ./build
	npm run build
	npm run preview
#

# ### NOTE: | IMPORTANT
# ### After PR -> (main) - run (this) to get local/dev in pair with (main)
git-post-main-pr:
	@echo "\n[STEP] ⬅ Checking out to MAIN\n"
	@git checkout main
	@echo "\n[STEP] ⬇ Pulling new changes from MAIN\n"
	@git pull origin main
	@echo "\n[STEP] ➡ Checkout to DEV\n"
	@git checkout dev
	@echo "\n[STEP] 🔃 Resetting to MAIN\n"
	@git reset --hard main
#

git-del-branches-w-origin:
	echo 'Deleting branches not present in origin + /dev'
	# Original command (below) is without \(...\) syntax
	# git fetch -p ; git branch -r | awk '{print $$1}' | egrep -v -f /dev/fd/0 <\(git branch -vv | grep origin\) | awk '{print $$1}' | xargs git branch -D
	# git branch --merged | grep -v "*" | grep -v "main" | xargs git branch -d
#