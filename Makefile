# ╭──────────────────────────────────────────────────────────────────────╮
# │ 🏗️ :|: DEBUG    																									    │
# │ 👇 :|: contains custom `debug/log` commands                          │
# ╰──────────────────────────────────────────────────────────────────────╯

# ▓ @see :|: https://xdevs.com/guide/color_serial/
# ▓ @see :|: https://en.wikipedia.org/wiki/ANSI_escape_code
COLOUR_G=\033[0;32m
COLOUR_R=\033[0;31m
COLOUR_B=\033[0;34m
COLOUR_GREY=\033[0;90m
END_COLOUR=\033[0m

SET_DESCRIPTION:
	@echo ""

	@ # ▓ > read-more :|: https://www.npmjs.com/package/boxen-cli
	@npx --yes\
		boxen-cli@4.0.0 --width=50 --padding=1 --border-color=yellow --border-style=round "DESCRIPTION: $(desc)"

	# @echo $(desc) | npx --yes chalk-cli@5.0.1 bold cyan
	@echo ""
#

LOG_ERROR:
	@ # ▓ > read-more :|: https://www.npmjs.com/package/boxen-cli
	@npx --yes\
		boxen-cli@4.0.0 --width=50 --padding=0.5 --border-color=red --border-style=round "$(desc)"
#

LOG_INFO:
	@ # ▓ > read-more :|: https://www.npmjs.com/package/boxen-cli
	@npx --yes\
		boxen-cli@4.0.0 --width=50 --padding=0.5 --border-color=blue --border-style=round "$(desc)"
#

# ╭──────────────────────────────────────────────────────────────────────────╮
# │ 🏗️ :|: SETUP    																									        │
# │ 👇 :|: contains custom `setup` commands                                  │
# ╰──────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
nvm:
	@echo ""
	@# ▓ DESCRIPTION
	@# ▓ > custom use of `nvm` command implementation.
	@# ▓ > read-more :|: https://github.com/nvm-sh/nvm/issues/1446#issuecomment-859143778
	@# ▓ TODO:
	@# ▓ > allow this to be the 'default' for every 'target' that uses 'nvm'.
	@echo ""

	. ${NVM_DIR}/nvm.sh
	nvm use

	@# ▓ NOTE:
	@# ▓ > check `nvm` is configured.
	@command -v nvm

	@# ▓ NOTE:
	@# ▓ > custom use of `nvm` command porting.
	@nvm $(CMD)
#

.ONESHELL:
node-setup:
	@${MAKE}\
		SET_DESCRIPTION\
		desc="$$\
		custom use of nvm command.$$\
		for switching between node and npm versions.$$\
		see https://github.com/nvm-sh/nvm"
	@

	@ # ▓ NOTE:
	@ # ▓ > install target `node` version if absent
	@ # ▓ >	from the list of availble `node` versions with `nvm`.
	@ $(MAKE) nvm CMD="install 16.17.0"

	@ # ▓ NOTE:
	@ # ▓ > change machine `node` version to use that of this project.
	@ $(MAKE) nvm CMD="use 16.17.0"

	@ # ▓ NOTE:
	@ # ▓ > change machine `npm` version to use that of this project.
	@ npm install -g npm@8.19.1
#

.ONESHELL:
project-check:
	@ echo ""
	@ # ▓ DESCRIPTION
	@ # ▓ > custom use of `nvm` command.
	@ # ▓ > for switching between `node` and `npm` versions.
	@ # ▓ > read-more :|: https://github.com/nvm-sh/nvm
	@ echo ""

	@ # ▓ CHECK
	@ # ▓ see :|: https://stackoverflow.com/questions/32153034/oneshell-not-working-properly-in-makefile
	@ # ▓ see :|: https://stackoverflow.com/questions/43175529/updating-make-version-on-mac
	make --version

	@ # ▓ CHECK
	@ # ▓ > for `architecture` used by `machine`.
	@ $(eval SYSTEM_ARCHITECTURE_DETECTED=$(shell arch))
	@ $(MAKE) LOG_INFO desc="System Architecture: $(SYSTEM_ARCHITECTURE_DETECTED) (built arm64)"

	@ # ▓ CHECK
	@ # ▓ > for `architecture` used by `node`.
	@ $(eval NODE_ARCHITECTURE_DETECTED=$(shell node -p "process.arch"))
	@ $(MAKE) LOG_INFO desc="Node Architecture: $(NODE_ARCHITECTURE_DETECTED) (built arm64)"

	@if [ $(SYSTEM_ARCHITECTURE_DETECTED) != $(NODE_ARCHITECTURE_DETECTED) ]; then\
		$(MAKE) LOG_ERROR desc="❌ Architectures do not match! Please check.";\
	fi

	@ # ▓ CHECK
	@ # ▓ > for `node` version being used.
	@ $(eval NODE_VERSION=$(shell node -v))
	@ $(MAKE) LOG_INFO desc="Node Version: $(NODE_VERSION) (built v16.17.0)"

	@if [ $(NODE_VERSION) != "v16.17.0" ]; then\
		$(MAKE) LOG_ERROR desc="❌ Node version is not correct! Please check.";\
		$(MAKE) node-setup;\
	fi

	@ # ▓ CHECK
	@ # ▓ > for `npm` version being used.
	@ $(eval NPM_VERSION=$(shell npm -v))
	@ $(MAKE) LOG_INFO desc="NPM Version: $(NPM_VERSION) (built v8.19.1)"

	@if [ $(NPM_VERSION) != "8.19.1" ]; then\
		echo "❌ NPM Version is not correct! Please check.";\
		$(MAKE) node-setup;\
	fi

	@ # ▓ CHECK
	@ # ▓ > for `dotenv` is configured.
	@if [[ ! -f ./.env.vault || ! -f ./.env.me ]]; then\
		echo "❌ Dotenv :: Missing Key Files.";\
	fi

	@ # ▓ NOTE:
	@ # ▓ > check `heroku` is configured.
	@ $(MAKE) LOG_INFO desc="Make sure to have access to the Heroku Betarena Project (ask the team member)"

	@ $(MAKE) misc-end-target
#

# ╭──────────────────────────────────────────────────────────────────────────────╮
# │ 🐳 :|: DOCKER                                                                │
# │ 👇 :|: contains custom `docker` commands and interaction with Docker         │
# ╰──────────────────────────────────────────────────────────────────────────────╯

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

# ╭──────────────────────────────────────────────────────────────────────────────╮
# │ 🛠️ :|: DEVELOPEMNT                                                           │
# │ 👇 :|: contains custom `development` flow commands 									         │
# ╰──────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
dev-local-deploy:
	@echo ""
	@# ▓ DESCRIPTION
	@# ▓ > custom use of `development` command.
	@# ▓ > for spin-up of local environment.
	@echo ""

	-@ $(MAKE) mac-os

	. ${NVM_DIR}/nvm.sh
	nvm use

	-rm -r ./.svelte-kit/

	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")"\
		VITE_SCORES_LIB_PKG_VERSION="v.$(shell npm info @betarena/scores-lib version | tr -d \")"\
		DOTENV_KEY=$(shell npx --yes dotenv-vault@1.25.0 keys development)\
		npm run sveltekit::dev
	@
#

.ONESHELL:
dev-local-scores-lib-link:
	@echo ""
	@# ▓ DESCRIPTION
	@# ▓ > custom use of `development` command,
	@# ▓ > for spin-up of local connection to @betarena/scores-lib.
	@echo ""

	-@ $(MAKE) mac-os

	. ${NVM_DIR}/nvm.sh
	nvm use

	@npm run pkg::@betarena/scores-lib::link

	@npm ls --link --global
#

.ONESHELL:
dev-local-1-click-spin-up:
	@echo ""
	@# ▓ DESCRIPTION
	@# ▓ > custom use of `development` command,
	@# ▓ > for spin-up of local environment.
	@echo ""

	-@ $(MAKE) mac-os

	. ${NVM_DIR}/nvm.sh
	nvm use

	$(MAKE) -j3\
		dev-local-deploy\
		dev-local-scores-lib-link
	@
#

.ONESHELL:
build-spin-up:
	@echo ""
	@# ▓ DESCRIPTION
	@# ▓ > custom use of `development` command.
	@# ▓ > for spin-up of local environment.
	@echo ""

	-@ $(MAKE) mac-os

	. ${NVM_DIR}/nvm.sh
	nvm use

	-rm -r ./.svelte-kit/
	-rm -r ./build/

	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")"\
		VITE_SCORES_LIB_PKG_VERSION="v.$(shell npm info @betarena/scores-lib version | tr -d \")"\
		DOTENV_KEY=$(shell npx --yes dotenv-vault@1.25.0 keys development)\
		npm run sveltekit::build
	@
#

preview-local-1-click-spin-up:
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

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🟪 :|: HEROKU                                                                    │
# │ 👇 :|: contains custom `heroku` commands and interaction with Heroku             │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

heroku-deploy:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for deploying a custom deployment sequence.
	@echo ""

	@echo \
		"$(COLOUR_R)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🔑 Heroku-Prod | Deploying               ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"

	@VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")" \
		VITE_SENTRY_UPLOAD_SOURCEMAPS="false" \
		npm run start

	@ $(MAKE) misc-end-target
#

heroku-target-deploy-branch-current:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for deploying currently active branch.
	# ▓ > WARNING:
	# ▓ > accepts the following parameters:
	# ▓ > env :: target environment to be toggled [ 'dev' | 'prod' ]
	@echo ""

	@if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ 🚀 Heroku | deploy current branch        ▓\
		\n▓ env = $(env)                             ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@heroku releases\
		--remote heroku-$(env)

	@git push heroku-$(env) $$(git branch --show-current):main -f

	@ $(MAKE) misc-end-target
#

heroku-target-deploy-STOP:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for stopping currently active build (a.k.a obliterating).
	# ▓ > WARNING:
	# ▓ > accepts the following parameters:
	# ▓ > env 	:: target environment to be toggled [ 'dev' | 'prod' ]
	@echo ""

	@if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ 🛠️ Heroku | stop active build            ▓\
		\n▓ env = $(env)                             ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@heroku builds:cancel\
		--remote heroku-$(env)

	@ $(MAKE) misc-end-target
#

heroku-target-deploy-version-set:
	@# ▓ DESCRIPTION
	@# ▓ > custom use of `heroku` command.
	@# ▓ > for stopping currently active build (a.k.a obliterating).
	@# ▓ > WARNING:
	@# ▓ > accepts the following parameters:
	@# ▓ > env
	@# ▓ > | target environment to be toggled [ 'dev' | 'prod' ]
	@# ▓ > version
	@# ▓ > | target environment to be toggled 'vX'

	@if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	@if [ ! $(version) ]; then\
		echo "Please set a target version via version=";\
		exit 1;\
		echo "";\
	fi

	@heroku rollback $(version)\
		--remote heroku-$(env)
	@

	@ $(MAKE) misc-end-target
#

heroku-target-maintenance-set:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for setting project `maintenance mode` to ON/OFF (a.k.a enabled/disabled)
	# ▓ > WARNING:
	# ▓ > accepts the following parameters:
	# ▓ > env 	:: target environment to be toggled [ 'dev' | 'prod' ]
	# ▓ > mode 	:: target mode for maintenance to be set [ 'on' | 'off' ]
	@echo ""

	@if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ 🛠️ Heroku | maintenance toggle           ▓\
		\n▓ env = $(env)                             ▓\
		\n▓ mode = $(mode)                           ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@ # @see :> https://devcenter.heroku.com/articles/maintenance-mode
	@ heroku maintenance:$(mode) --remote heroku-$(env)

	@ $(MAKE) misc-end-target
#

heroku-target-secrets-set:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > for setting/pushing secrets for heroku.
	# ▓ > WARNING:
	# ▓ > accepts the following parameters:
	# ▓ > env_1 	:: target environment to be toggled [ 'dev' | 'prod' ]
	# ▓ > env_2 	:: target mode for maintenance to be set [ 'development' | 'production' ]
	@echo ""

	@if [ ! $(env_1) ]; then\
		echo "Please set a target environment via env_1=";\
		exit 1;\
		echo "";\
	fi

	@if [ ! $(env_2) ]; then\
		echo "Please set a target environment via env_2=";\
		exit 1;\
		echo "";\
	fi

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ Heroku | 🔑 setting secrets              ▓\
		\n▓ env_1 = $(env_1)                         ▓\
		\n▓ env_2 = $(env_2)                         ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@ # ▓ TODO:
	@ # ▓ > add support for 'unesetting ALL target .env.* file secrets'
	@ # @heroku config:unset\
		--remote heroku-dev\
		🟩 SENTRY_AUTH_TOKEN SENTRY_ENVIRONMENT etc.\
		❌ grep -v '^#' .env.$(env_2) | xargs | grep -e '/(?:^|\s)([^=]*)/g'

	@ # ▓ NOTE:
	@ # ▓ > ❌ deprecated
	@ # ▓ > please use the command below (following).
	@ # @heroku config:set\
		--remote heroku-$(env)\
		$$(grep -v '^#' .env.$(env_2) | xargs)

	@heroku config:set\
		--remote heroku-$(env)\
		DOTENV_KEY=$$(npx --yes dotenv-vault@1.25.0 keys $(env_2))

	@ $(MAKE) misc-end-target
#

heroku-target-bash:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `heroku` command.
	# ▓ > used to access target `heroku remote bash` console.
	# ▓ > WARNING:
	# ▓ > accepts the following parameters:
	# ▓ > env :: target environment to be toggled [ 'dev' | 'prod' ]
	@echo ""

	@if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	@echo\
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ Heroku | 🖥️ connecting to remote         ▓\
		\n▓ env = $(env)                             ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	heroku run bash --remote heroku-$(env);\

	@ $(MAKE) misc-end-target
#

# ╭──────────────────────────────────────────────────────────────────────────────────────╮
# │ 🔑 :|: DOTENV SECRETS                                                                │
# │ 👇 :|: contains custom `dotenv` commands and interaction with Dotenv                 │
# ╰──────────────────────────────────────────────────────────────────────────────────────╯

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

	@npx --yes dotenv-vault@1.25.0 new vlt_f5f4745903d586ce993a0f1afde6b47cd6f8781e2af24fd73430331af5633ede
#

dotnev-secrets-pull-target:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `dotenv` command.
	# ▓ > for importing/pulling secrets into a target `.env` file.
	# ▓ > use the `dotenv-vault help` for more information.
	# ▓ > WARNING:
	# ▓ > accepts the following parameters:
	# ▓ > env :: target environment to be toggled [ 'development' | 'production' ]
	@echo ""

	@echo \
		"$(COLOUR_G)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓ 🔑 dotenv | importing secrets $(env)         ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"

	@npx --yes dotenv-vault@1.25.0 pull $(env) .env.$(env)
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

	@npx --yes dotenv-vault@1.25.0 build
#

# ╭──────────────────────────────────────────────────────────────────────────────────────╮
# │ 🟣 :|: SENTRY                                                                        │
# │ 👇 :|: contains custom `sentry` commands and interaction with Sentry                 │
# ╰──────────────────────────────────────────────────────────────────────────────────────╯

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

# ╭──────────────────────────────────────────────────────────────────────────────────────╮
# │ 🔑 :|: GIT                                                                           │
# │ 👇 :|: contains custom `git` commands                                                │
# ╰──────────────────────────────────────────────────────────────────────────────────────╯

git-setup:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom setup for GIT target executable.
	@echo ""

	# ▓ @see :> https://stackoverflow.com/questions/1257592/how-do-i-remove-files-saying-old-mode-100755-new-mode-100644-from-unstaged-cha
	@git config core.filemode false

	@git config\
		--list\
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

	$(MAKE) misc-end-target
#

git-pr-close-clean:
	@echo ""
	# ▓ DESCRIPTION ▓ NOTE: ▓ IMPORTANT
	# ▓ > please run '_this_' target AFTER each successull `closed`
	# ▓ > pull-request to (main) to get (local) dev in pair with (main).
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
	@git stash
	@git reset --hard main

	$(MAKE) misc-end-target
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

# ╭──────────────────────────────────────────────────────────────────────────────────────────╮
# │ 💠 :|: MISCELLANOUS                                                                      │
# │ 👇 :|: contains custom `miscellaneous` commands                                          │
# ╰──────────────────────────────────────────────────────────────────────────────────────────╯

mac-os:
	@ # ▓ NOTE:
	@ # ▓ > required for MacOS removal of `._*` files.
	@ # ▓ > @see :> https://apple.stackexchange.com/questions/14980/why-are-dot-underscore-files-created-and-how-can-i-avoid-them
	-@dot_clean .
#

misc-end-target:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `target` command.
	# ▓ > used by other targets to `signal` completed execution.

	@echo\
		"\n$(COLOUR_GREY)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ 🟩 Done!                                 ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"
#

changelog-init:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `conventional-changelog` command.
	# ▓ > for generating new CHANGELOG.md
	# ▓ > use the `conventional-changelog --help` for more information.
	@echo ""

	@npx --yes conventional-changelog-cli -p angular -i CHANGELOG.md -s -r 0

	$(MAKE) misc-end-target
#

node-modules-snapshot:
	# pwd
	# cd /Volumes/1TB WD Blue/projects/betarena/_dump_/scores
	# pwd
	npx --yes \
		bestzip destination.zip node_modules/
#

node-modules-factory-reset:
	# ▓ DESCRIPTION
	# ▓ > custom GIT commit target executable.

	rm -rf node_modules
	npm i
#