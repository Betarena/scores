COLOUR_G=\033[0;32m
COLOUR_R=\033[0;31m
COLOUR_B=\033[0;34m
END_COLOUR=\033[0m

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓▓ 🐳 DOCKER | 🚀 PRODUCTION                                      ▓▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

docker-start:
	echo 'Starting PROD container'
	docker-compose -f docker-compose.yml up -d
#

docker-log-listen:
	echo 'Starting PROD container'
	docker-compose -f docker-compose.yml up
#

docker-update-scores-web:
	echo 'Updating PROD Scores Web container...'
	git pull origin main
	# -docker rm $$(docker stop $$(docker ps -a -q --filter="name=scores_scores_web_1" --format="{{.ID}}"))
	# -docker rmi $$(docker images -q scores_web)
	# -docker rmi $$(docker images --filter "dangling=true" -q --no-trunc)
	# docker-compose -f docker-compose.yml up -d
	docker-compose -f docker-compose.yml up -d --build
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓▓ 🛠️ DEVELOPEMNT                                                 ▓▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

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
	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")" \
		VITE_SCORES_LIB_PKG_VERSION="v.$(shell npm info @betarena/scores-lib version | tr -d \")" \
		npm run sveltekit::dev
#

dev-local-scores-lib-link:
	npm run pkg::@betarena/scores-lib::link
#

dev-local-dev-1-click-spin: ; ${MAKE} -j2 dev-local-clear-build-quick dev-local-deploy dev-local-scores-lib-link
#

dev-local-preview-1-click-spin:
	@echo \
		"$(COLOUR_B)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ ⚙️ Spinning Up Prod. Preview              ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	-rm -r ./build
	npm run build
	npm run preview
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓▓ 🟪 HEROKU                                                      ▓▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

heroku-production-deploy:
	@echo \
		"$(COLOUR_R)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Prod | Deploying               ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")" \
		VITE_SENTRY_UPLOAD_SOURCEMAPS="false" \
		npm run start
#

heroku-production-deploy-branch-current:
	@echo \
		"$(COLOUR_R)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🚀 Pushing current branch to Heroku-Prod  ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@git push heroku-prod $$(git branch --show-current):main -f
#

heroku-production-secrets-update:
	@echo \
		"$(COLOUR_R)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Prod | Updating Secrets        ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@heroku config:set --remote heroku-prod $$(grep -v '^#' .env.production | xargs)
	@echo ""
#

heroku-development-deploy-branch-current:
	@echo \
		"$(COLOUR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🚀 Pushing current branch to Heroku-Dev ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@git push heroku-dev $$(git branch --show-current):main -f
#

heroku-development-maintenance-OFF:
	@echo \
		"$(COLOUR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🛠️ Heroku-Dev | Setting maintenance OFF  ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	# ### SEE:
	# ### https://devcenter.heroku.com/articles/maintenance-mode
	@heroku maintenance:off --remote heroku-dev
#

heroku-development-maintenance-ON:
	@echo \
		"$(COLOUR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🛠️ Heroku-Dev | Setting maintenance ON   ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	# ### SEE:
	# ### https://devcenter.heroku.com/articles/maintenance-mode
	@heroku maintenance:on --remote heroku-dev
#

heroku-development-secrets-update:
	@echo \
		"$(COLOUR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Dev | Updating Secrets         ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@heroku config:set --remote heroku-dev $$(grep -v '^#' .env.development | xargs)
	@echo ""
#

heroku-development-bash:
	@echo \
		"$(COLOUR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Dev | Accessing BASH           ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@heroku run bash --remote heroku-dev
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓▓ 🟣 SENTRY                                                      ▓▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

sentry-sourcemaps-upload:
	@echo \
		"$(COLOUR_R)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔼 Sentry | Uploading Sourcemap          ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")" \
		VITE_SENTRY_UPLOAD_SOURCEMAPS="true" \
		vite build
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓▓ 🐙 GITHUB                                                      ▓▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

# ▓▓ NOTE: ▓▓ IMPORTANT
# ▓▓ next-line :: please run '_this_' Makefile target AFTER a successull "closed"
# ▓▓ next-line :: PR -> (main) to get (local) dev in pair with (main).
git-main-pr-close-clean:
	@echo \
		"$(COLOUR_B)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ ⚙️ POST origin/main PR clean              ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@git checkout main
	@git pull origin main
	@git checkout dev
	@git reset --hard main
	@echo ""
#

git-del-branches-w-origin:
	echo 'Deleting branches not present in origin + /dev'
	# Original command (below) is without \(...\) syntax
	# git fetch -p ; git branch -r | awk '{print $$1}' | egrep -v -f /dev/fd/0 <\(git branch -vv | grep origin\) | awk '{print $$1}' | xargs git branch -D
	# git branch --merged | grep -v "*" | grep -v "main" | xargs git branch -d
#

git-repo-secrets-ci-cd-update:
	@echo \
		"$(COLOR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🚀 Scores | Set Github Secrets             ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	@gh secret set -f .env.ci-cd
	@echo ""
	@gh secret set ENV_FILE --body "$(shell cat .env.ci-cd | base64)"
	@echo ""
#