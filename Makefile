COLOUR_G=\033[0;32m
COLOUR_R=\033[0;31m
COLOUR_B=\033[0;34m
END_COLOUR=\033[0m

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 🏗️ SETUP    																									    ▓
# ▓ 👇 contains custom `node` commands                               ▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

node-setup:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `nvm` command.
	# ▓ > for switching between `node` and `npm` versions.
	# ▓ @see :> https://github.com/nvm-sh/nvm
	@echo ""

	@ # ▓ NOTE:
	@ # ▓ > install target `node` version if absent
	@ # ▓ >	from the list of availble `node` versions with `nvm`.
	@nvm install 16.17.0

	@ # ▓ NOTE:
	@ # ▓ > change machine `node` version to use that of this project.
	@nvm use 16.17.0

	@ # ▓ NOTE:
	@ # ▓ > check machine `architecture` being employed.
	-@arch
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 💠 MISCELLANOUS                                                  ▓
# ▓ 👇 contains custom `miscellaneous` commands                      ▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

mac-os:
	@# ▓ NOTE:
	@# ▓ > required for MacOS removal of `._*` files.
	@# ▓ > @see :> https://apple.stackexchange.com/questions/14980/why-are-dot-underscore-files-created-and-how-can-i-avoid-them
	-@dot_clean .
#

misc-end-target:
	@echo ""
	@echo\
		"$(COLOUR_B)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🟩 Done!                                 ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 🐳 DOCKER                                                        ▓
# ▓ 👇 contains custom `docker` commands and interaction with Docker ▓
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

docker-local-start:
	echo 'Starting DEV - Docker Environment'
	echo 'Removing Old DEV Logs'
	-rm -r ./datalog/*
	docker-compose -f docker-compose.dev.yml up
	echo 'DEV Ready!'
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 🛠️ DEVELOPEMNT                                                   ▓
# ▓ 👇 contains custom `development` flow commands 									 ▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

dev-local-deploy:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `development` command.
	# ▓ > for spin-up of local environment.
	@echo ""

	$(MAKE) mac-os
	-rm -r ./.svelte-kit/

	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")"\
		VITE_SCORES_LIB_PKG_VERSION="v.$(shell npm info @betarena/scores-lib version | tr -d \")"\
		DOTENV_KEY=$(shell npx dotenv-vault@1.25.0 keys devlopment)\
		npm run sveltekit::dev
#

dev-local-scores-lib-link:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `development` command.
	# ▓ > for spin-up of local connection to @betarena/scores-lib
	@echo ""

	@npm run pkg::@betarena/scores-lib::link

	@npm ls --link --global
#

dev-local-dev-1-click-spin:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `development` command.
	# ▓ > for spin-up of local environment.
	@echo ""

	${MAKE} -j3\
		dev-local-deploy\
		dev-local-scores-lib-link
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
# ▓ 🟪 HEROKU                                                        ▓
# ▓ 👇 contains custom `heroku` commands and interaction with Heroku ▓
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
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for deploying currently active branch.
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🚀 heroku-prod | deploy current branch   ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@heroku releases\
		--remote heroku-prod

	@git push heroku-prod $$(git branch --show-current):main -f

	@ $(MAKE) misc-end-target
#

heroku-production-deploy-STOP:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for stopping currently active build.
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ ❌ heroku-prod | stop active build       ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@heroku builds:cancel\
		--remote heroku-prod

	@ $(MAKE) misc-end-target
#

heroku-production-secrets-update:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for setting/pushing secrets for heroku.
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 heroku-prod | setting secrets         ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@ # ▓ TODO:
	@ # ▓ > add support for 'unesetting ALL target .env.* file secrets'
	@ # @heroku\
		config:unset\
		--remote heroku-prod\
		🟩 SENTRY_AUTH_TOKEN SENTRY_ENVIRONMENT etc.
		❌ grep -v '^#' .env.production | xargs | grep -e '/(?:^|\s)([^=]*)/g'

	@ # ▓ NOTE:
	@ # ▓ > ❌ deprecated
	@ # ▓ > please use the command below (following).
	@ # @heroku\
		config:set\
		--remote heroku-prod\
		$$(grep -v '^#' .env.production | xargs)

	@heroku\
		config:set\
		--remote heroku-prod\
		DOTENV_KEY=$$(npx dotenv-vault@1.25.0 keys production)

	@ $(MAKE) misc-end-target
#

heroku-development-deploy-branch-current:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for deploying currently active branch.
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🚀 heroku-dev | deploy current branch    ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@heroku releases\
		--remote heroku-dev

	@git push heroku-dev $$(git branch --show-current):main -f

	@ $(MAKE) misc-end-target
#

heroku-development-maintenance-OFF:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for setting project `maintenance mode` to OFF (a.k.a enabled)
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🛠️ heroku-dev | maintenance DISABLED     ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@ # @see :> https://devcenter.heroku.com/articles/maintenance-mode
	@heroku\
		maintenance:off\
		--remote heroku-dev

	@ $(MAKE) misc-end-target
#

heroku-development-maintenance-ON:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for setting project `maintenance mode` to ON (a.k.a disabled)
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🛠️ heroku-dev | maintenance ACTIVE       ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@ # @see :> https://devcenter.heroku.com/articles/maintenance-mode
	@heroku\
		maintenance:on\
		--remote heroku-dev

	@ $(MAKE) misc-end-target
#

heroku-development-secrets-update:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for setting/pushing secrets for heroku.
	@echo ""

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 heroku-dev | setting secrets          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@ # ▓ TODO:
	@ # ▓ > add support for 'unesetting ALL target .env.* file secrets'
	@ # @heroku\
		config:unset\
		--remote heroku-dev\
		🟩 SENTRY_AUTH_TOKEN SENTRY_ENVIRONMENT etc.
		❌ grep -v '^#' .env.development | xargs | grep -e '/(?:^|\s)([^=]*)/g'

	@ # ▓ NOTE:
	@ # ▓ > ❌ deprecated
	@ # ▓ > please use the command below (following).
	@ # @heroku\
		config:set\
		--remote heroku-dev\
		$$(grep -v '^#' .env.development | xargs)

	@heroku\
		config:set\
		--remote heroku-dev\
		DOTENV_KEY=$$(npx dotenv-vault@1.25.0 keys development)

	@ $(MAKE) misc-end-target
#

heroku-development-bash:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > used to access target `heroku remote bash` console.
	@echo ""

	@heroku\
		run bash\
		--remote heroku-dev

	@ $(MAKE) misc-end-target
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 🔑 DOTENV SECRETS                                                ▓
# ▓ 👇 contains custom `heroku` commands and interaction with Heroku ▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

dotenv-secrets-setup:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `dotenv` command.
	# ▓ > for setting up the secrets.
	# ▓ > use the `dotenv-vault help` for more information.
	@echo ""

	@echo \
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 dotenv | setting up secrets           ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@npx dotenv-vault@1.25.0 new vlt_f5f4745903d586ce993a0f1afde6b47cd6f8781e2af24fd73430331af5633ede
#

dotnev-secrets-pull-development:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `dotenv` command.
	# ▓ > for importing/pulling secrets into a target `.env` file.
	# ▓ > use the `dotenv-vault help` for more information.
	@echo ""

	@echo \
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 dotenv | importing secrets (development)  ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@npx dotenv-vault@1.25.0 pull development .env.development
#

dotnev-secrets-pull-production:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `dotenv` command.
	# ▓ > for importing/pulling secrets into a target `.env` file.
	# ▓ > use the `dotenv-vault help` for more information.
	@echo ""

	@echo \
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 dotenv | importing secrets (production)   ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@npx dotenv-vault@1.25.0 pull production .env.production
#

dotnev-secrets-build:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `dotenv` command.
	# ▓ > for importing/pulling secrets and updating the `.env.vault`.
	# ▓ > use the `dotenv-vault help` for more information.
	@echo ""

	@echo \
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 dotenv | generate encrypted secrets   ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@npx dotenv-vault@1.25.0 build
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 🟣 SENTRY                                                        ▓
# ▓ 👇 contains custom `sentry` commands and interaction with Sentry ▓
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
		npm run build
#

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
# ▓ 🐙 GIT      																									   ▓
# ▓ 👇 contains custom `git` commands                                ▓
# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

git-setup:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom setup for GIT target executable.
	@echo ""

	# ▓ @see :> https://stackoverflow.com/questions/1257592/how-do-i-remove-files-saying-old-mode-100755-new-mode-100644-from-unstaged-cha
	@git config core.filemode false

	@git config \
		--list \
		--show-origin
#

git-commit:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom GIT commit target executable.
	# ▓ > used for:
	# ▓ > 1. MacOS system file clean, and
	# ▓ > 2. enforce husky use
	@echo ""

	$(MAKE) mac-os

	@# ▓ NOTE:
	@# ▓ > initiate custom GIT commit flow.
	@git commit
#

git-main-pr-close-clean:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ NOTE: ▓ IMPORTANT
	# ▓ > please run '_this_' Makefile Target AFTER a successull "closed"
	# ▓ > PR -> (main) to get (local) dev in pair with (main).
	@echo ""

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