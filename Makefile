SHELL := /bin/bash
-include env/.env.docker.compose

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🐞 │ DEBUG    			    	  																			    					 │
# │		 │ 🔗 read-more :|: https://xdevs.com/guide/color_serial/
# │		 │ 🔗 https://en.wikipedia.org/wiki/ANSI_escape_code
# ╰──────────────────────────────────────────────────────────────────────────────────╯

COLOUR_G=\033[0;32m
COLOUR_R=\033[0;31m
COLOUR_B=\033[0;34m
COLOUR_GREY=\033[0;90m
END_COLOUR=\033[0m

.ONESHELL:
log-end:
	@
	# ▓ DESCRIPTION
	# ▓ > custom use of `target` command.
	# ▓ > used by other targets to `signal` completed execution.

	echo\
		"$(COLOUR_GREY)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🟩 Done!               		        	                             │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🏗️ // SETUP                                                                      │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
setup-main-check:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > setup of project and validation of correct packages/           │
	# │ > requirements.				  																		     │
	# ╰──────────────────────────────────────────────────────────────────╯

	SYSTEM_ARCHITECTURE_DETECTED=$$(arch)
	echo -e "\xF0\x9F\x93\xA3 System Architecture: $${SYSTEM_ARCHITECTURE_DETECTED}";

	NODE_ARCHITECTURE_DETECTED=$$(node -p "process.arch")
	echo -e "\xF0\x9F\x93\xA3 Node Architecture: $${NODE_ARCHITECTURE_DETECTED}";

	# ╭──────────────────────────────────────────────────────────────────╮
	# │ CHECK    																							           │
	# │ for 'make' version used.																				 │
	# ╰──────────────────────────────────────────────────────────────────╯
	# ▓ see :|: https://stackoverflow.com/questions/32153034/oneshell-not-working-properly-in-makefile
	# ▓ see :|: https://stackoverflow.com/questions/43175529/updating-make-version-on-mac

	MAKE_VERSION=$$(make --version | head -1 | cut -d" " -f3)
	if [ $${MAKE_VERSION} == "4.4.1" ]; then\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)Make version: $(MAKE_VERSION)$(END_COLOUR)";\
	else\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)Make === 4.4.1 is required. Install via (MacOS) https://formulae.brew.sh/formula/make | (windows) https://community.chocolatey.org/packages/make $(END_COLOUR)";\
	fi

	MAKE_ARCHITECTURE=$$(make --version | head -2 | tail -1 | cut -d" " -f3)
	echo -e "\xF0\x9F\x93\xA3 Make Architecture: $${MAKE_ARCHITECTURE}";

	# ╭─────────────────────────────────────────────────────────────────────────╮
	# │ CHECK    																							                  │
	# │ for 'node', 'npm'. 'nvm' version used.                                  │
	# ╰─────────────────────────────────────────────────────────────────────────╯

	-. ${NVM_DIR}/nvm.sh
	-nvm use

	NVM_VERSION=$$(nvm --version)
	if [ "$${NVM_VERSION}" ]; then\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)NVM installed with version: $${NVM_VERSION}$(END_COLOUR)";\
	else\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)NVM (any version) is required. Install via https://github.com/nvm-sh/nvm. $(END_COLOUR)";\
	fi

	NODE_VERSION=$$(node -v)
	if [ $${NODE_VERSION} == "v16.17.0" ]; then\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)NodeJs version: $${NODE_VERSION}$(END_COLOUR)";\
	else\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)NodeJs === v16.17.0 is required. Performing an auto-install via NVM. $(END_COLOUR)";\
		$(MAKE) --no-print-directory setup-node;\
	fi

	NPM_VERSION=$$(npm -v)
	if [ $${NPM_VERSION} == "8.19.1" ]; then\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)NPM version: $${NPM_VERSION}$(END_COLOUR)";\
	else\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)NPM === 8.19.1 is required. Performing an auto-install via NVM. $(END_COLOUR)";\
		$(MAKE) --no-print-directory setup-node;\
	fi

	if [[ $${NODE_VERSION} == "v16.17.0" && $${NPM_VERSION} == "8.19.1" && ! "$${NVM_VERSION}" && -f ./node_modules ]]; then\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)node_modules/** not found. Performing an auto-install. $(END_COLOUR)";\
		npm i;\
	else\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)node_modules/** found.$(END_COLOUR)";\
	fi

	# ╭──────────────────────────────────────────────────────────────────╮
	# │ CHECK    																							           │
	# │ for 'dotenv' version used.			  				      								 │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [[ ! -f ./.env.vault || ! -f ./.env.me ]]; then\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)DotEnv missing key files to run project. Performing an auto-install. $(END_COLOUR)";\
		$(MAKE) --no-print-directory dotenv-secrets-setup;\
	else\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)Dotenv key files present. $(END_COLOUR)";\
	fi
	echo -e " \xF0\x9F\x93\xA3 DotEnvVault access needs to be requested, please ask a Betarena Team Member for access."

	# ╭──────────────────────────────────────────────────────────────────╮
	# │ CHECK    																							           │
	# │ for 'heroku' version used.			  				      								 │
	# ╰──────────────────────────────────────────────────────────────────╯

	HEROKU_VERSION=$$(heroku -v)
	if [ "$${HEROKU_VERSION}" ]; then\
		echo -e "\xE2\x9C\x85$(COLOUR_G)Heroku installed with version: $${HEROKU_VERSION} $(END_COLOUR)";\
	else\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)Heroku not found, please install via: https://devcenter.heroku.com/articles/heroku-cli $(END_COLOUR)";\
	fi
	echo -e " \xF0\x9F\x93\xA3 Access to Heroku needs to be requested, aside from installing the Heroku-CLI."

	# ╭──────────────────────────────────────────────────────────────────╮
	# │ CHECK    																							           │
	# │ for 'git' version used.			  				      								     │
	# ╰──────────────────────────────────────────────────────────────────╯

	GIT_VERSION=$$(git -v)
	if [ "$${GIT_VERSION}" ]; then\
		echo -e "\xE2\x9C\x85 $(COLOUR_G)Git installed with version: $${GIT_VERSION} $(END_COLOUR)";\
		git remote add heroku-dev https://git.heroku.com/betarena-scores-platform.git ;\
		git remote add heroku-prod https://git.heroku.com/betarena-prod.git ;\
	else\
		echo -e "\xE2\x9D\x8C $(COLOUR_R)Git not found, please install. $(END_COLOUR)";\
	fi

	$(MAKE) --no-print-directory log-end
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🔑 // DOTENV SECRETS                                                             │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
dotenv-secrets-setup:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `dotenv` command. For setting up the secrets.  	 │
	# │ > Use the `dotenv-vault help` for more information.			         │
	# ╰──────────────────────────────────────────────────────────────────╯

	npx --yes dotenv-vault@1.25.0 new vlt_f5f4745903d586ce993a0f1afde6b47cd6f8781e2af24fd73430331af5633ede
	npx --yes dotenv-vault@1.25.0 pull
#

.ONESHELL:
dotnev-secrets-pull-target:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `dotenv` command.                                │
	# │ > for importing/pulling secrets into a target `.env` file.       │
	# │ > Use the `dotenv-vault help` for more information.			         │
	# │ WARNING:																												 │
	# │ > accepts the following parameters:
	# │ > env :: target environment to be toggled [ 'development' | 'production' ]
	# ╰──────────────────────────────────────────────────────────────────╯

	npx --yes dotenv-vault@1.25.0 pull $(env) .env.$(env)
	npx --yes dotenv-vault@1.25.0 keys $(env)
#

.ONESHELL:
dotnev-secrets-build:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `dotenv` command.                                │
	# │ > for importing/pulling secrets into a target `.env` file.       │
	# │ > Use the `dotenv-vault help` for more information.			         │
	# ╰──────────────────────────────────────────────────────────────────╯

	npx --yes dotenv-vault@1.25.0 build
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🟪 // HEROKU                                                                     │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
heroku-deploy:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `heroku` command. for spin-up of 	               │
	# │ > for deploying a custom deployment sequence.							       │
	# ╰──────────────────────────────────────────────────────────────────╯

	echo \
		"$(COLOUR_R)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🔑 Heroku | Deployment (Worflow)                                 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	VITE_SCORES_PKG_VERSION="v.$(shell npm pkg get version --workspaces=false | tr -d \")" \
		VITE_SENTRY_UPLOAD_SOURCEMAPS="false" \
		npm run start
	@

	$(MAKE) --no-print-directory log-end
#

.ONESHELL:
heroku-target-deploy-branch-current:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `heroku` command.                                │
	# │ > for deploying currently active branch.										     │
	# │ > Use the `dotenv-vault help` for more information.			         │
	# │ WARNING:																												 │
	# │ > accepts the following parameters:															 │
	# │ > env :: target environment to be toggled [ 'dev' | 'prod' ]		 │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	echo\
		"$(COLOUR_G)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🚀 Heroku | deploy current (active) branch        		        	 │\
		\n│ env = $(env)                             												 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	heroku releases\
		--remote heroku-$(env)
	@

	git push heroku-$(env) $$(git branch --show-current):main -f

	$(MAKE) --no-print-directory log-end
#

.ONESHELL:
heroku-target-deploy-STOP:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `heroku` command.                                │
	# │ > for stopping currently active build (a.k.a obliterating).      │
	# │ > Use the `dotenv-vault help` for more information.			         │
	# │ WARNING:																												 │
	# │ > accepts the following parameters:															 │
	# │ > env 	:: target environment to be toggled [ 'dev' | 'prod' ]   │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	echo\
		"$(COLOUR_G)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🚀 Heroku | stop active build                     		        	 │\
		\n│ env = $(env)                             												 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	heroku builds:cancel\
		--remote heroku-$(env)
	@

	$(MAKE) --no-print-directory log-end
#

.ONESHELL:
heroku-target-deploy-version-set:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `heroku` command.                                │
	# │ > for rolling back heroku versions (a.k.a revert).               │
	# │ WARNING:																												 │
	# │ > accepts the following parameters:															 │
	# │ > env																														 │
	# │ > | target environment to be toggled [ 'dev' | 'prod' ]			     │
	# │ > version																											   │
	# │ > | target environment to be toggled 'vX'												 │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	if [ ! $(version) ]; then\
		echo "Please set a target version via version=";\
		exit 1;\
		echo "";\
	fi

	echo\
		"$(COLOUR_G)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🚀 Heroku | rollback version                      		        	 │\
		\n│ env = $(env)                             												 │\
		\n│ version = $(version)                             								 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	heroku rollback $(version)\
		--remote heroku-$(env)
	@

	$(MAKE) --no-print-directory log-end
#

.ONESHELL:
heroku-target-maintenance-set:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `heroku` command.                                │
	# │ > for setting project `maintenance mode` 											   │
	# │ > to ON/OFF (a.k.a enabled/disabled)														 │
	# │ WARNING:																												 │
	# │ > accepts the following parameters:															 │
	# │ >  env 	:: target environment to be toggled [ 'dev' | 'prod' ]	 │
	# │ >  mode 	:: target mode for maintenance to be set [ 'on' | 'off' ]
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	echo\
		"$(COLOUR_G)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🛠️ Heroku | maintenance toggle                    		        	  │\
		\n│ env = $(env)                             												 │\
		\n│ mode = $(mode)                           												 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	# @see :|: https://devcenter.heroku.com/articles/maintenance-mode
	heroku maintenance:$(mode) --remote heroku-$(env)

	$(MAKE) --no-print-directory log-end
#

#: deprecated/archive
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

	@ $(MAKE) log-end
#

.ONESHELL:
heroku-target-bash:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom use of `heroku` command.                                │
	# │ > used to access target `heroku remote bash` console.            │
	# │ WARNING:																												 │
	# │ > accepts the following parameters:															 │
	# │ > env																														 │
	# │ > | target environment to be toggled [ 'dev' | 'prod' ]			     │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(env) ]; then\
		echo "Please set a target environment via env=";\
		exit 1;\
		echo "";\
	fi

	echo\
		"$(COLOUR_G)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🚀 Heroku | 🖥️ connecting to remote               		        	  │\
		\n│ env = $(env)                             												 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	heroku run bash --remote heroku-$(env);\

	$(MAKE) --no-print-directory log-end
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🐳 // DOCKER                                                                     │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
docker-info:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: │ DESCRIPTION																						   │
	# │ ➤ use docker to check version information.                       │
	# ╰──────────────────────────────────────────────────────────────────╯

	docker --version
	docker compose version
#

.ONESHELL:
docker-image-build:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: │ DESCRIPTION																						   │
	# │ ➤ create docker image for Betarena // Scores                     │
	# ╰──────────────────────────────────────────────────────────────────╯

	TEMP_VERSION=""

	if [[ "$(version)" = "temporary" || ! -x "$(shell command -v npm)" ]]; then \
		TEMP_VERSION="temporary-$$(date +%Y-%m-%d.%H-%M-%S)";\
	else \
		TEMP_VERSION=$(shell npm pkg get version --workspaces=false | tr -d \");\
	fi

	echo -e \
		"$(COLOUR_B)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🐳 │ Building Docker Image                                       │\
		\n├──────────────────────────────────────────────────────────────────┤\
		\n│ ➤ version: $${TEMP_VERSION} \
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n";
	#

	docker build \
		. \
		-f ./.docker/Dockerfile.scores.full \
		-t betarena-scores:$${TEMP_VERSION} \
		--platform=linux/amd64 \
		--progress=plain
		# --no-cache
	#
#

.ONESHELL:
docker-image-publish-to-registry:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: │ DESCRIPTION																						   │
	# │ ➤ initialize docker instance (spin-up) used in local environment │
	# │ ➤ comprising database initialization.                            │
	# ╰──────────────────────────────────────────────────────────────────╯

	echo -e \
		"$(COLOUR_B)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🐳 │ Creating Docker Image                                       │\
		\n│ 	 │: DockerHub Account :: $(ENV_DOCKER_HUB_USERNAME) \
		\n│ 	 │: Docker ImageId :: $(ENV_IMAGE_TAG_ID) \
		\n│ 	 │: Type :: $(type) \
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n";
	#

	# docker login \
	# 	-u $(ENV_DOCKER_HUB_USERNAME) \
	# 	-p $(ENV_DOCKER_HUB_PASSWORD) \
	# 	docker.io
	#

	if [ "$(type)" = "production" ]; then\
		# ╭─────
		# │ NOTE:
		# │ |: Docker Image Tagging (Version)
		# ╰─────
		docker tag \
			$(ENV_IMAGE_TAG_ID) \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-$(shell npm pkg get version --workspaces=false | tr -d \"); \
		docker push \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-$(shell npm pkg get version --workspaces=false | tr -d \"); \
		# ╭─────
		# │ NOTE:
		# │ |: Docker Image Tagging (Latest)
		# ╰─────
		docker tag \
			$(ENV_IMAGE_TAG_ID) \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-latest; \
		docker push \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-latest; \
	fi

	if [ "$(type)" = "staging" ]; then\
		# ╭─────
		# │ NOTE:
		# │ |: Docker Image Tagging (Version)
		# ╰─────
		docker tag \
			$(ENV_IMAGE_TAG_ID) \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-staging-$(shell npm pkg get version --workspaces=false | tr -d \"); \
		docker push \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-staging-$(shell npm pkg get version --workspaces=false | tr -d \"); \
		# ╭─────
		# │ NOTE:
		# │ |: Docker Image Tagging (Latest)
		# ╰─────
		docker tag \
			$(ENV_IMAGE_TAG_ID) \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-staging-latest; \
		docker push \
			$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-staging-latest; \
	fi
#

.ONESHELL:
docker-image-purge:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: prune docker images for Betarena // Scores service.           │
	# ╰──────────────────────────────────────────────────────────────────╯

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🐳 │ pruning docker images for scores                            │\
		\n╰──────────────────────────────────────────────────────────────────╯"
	#

	docker rmi $$(docker images -f "dangling=true" -q);
#

.ONESHELL:
docker-volume-scores-check:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: check docker volumes for Betarena // Scores service.          │
	# ╰──────────────────────────────────────────────────────────────────╯

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 💽 │ checking volumes for scores                                 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		\n"
	#

	sleep 5

	# [🐞]
	echo -e "[Makefile::docker-volume-scores-check] contents of docker volume :: betarena-scores_scores-staging-volume\n"
	# [🐞]
	docker run --rm -v betarena-scores_scores-staging-volume:/v alpine ls -lha /v

	# [🐞]
	echo -e "[Makefile::docker-volume-scores-check] contents of docker volume :: betarena-scores_scores-production-volume\n"
	# [🐞]
	docker run --rm -v betarena-scores_scores-production-volume:/v alpine ls -lha /v
#

.ONESHELL:
docker-compose-up:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: custom wrapper for 'docker-compose'                           │
	# ╰──────────────────────────────────────────────────────────────────╯

	TEMP_DEBUG_PREFIX="[Makefile::docker-compose-up]"

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🐳 │ (re)start container(s)                                      │\
		\n├──────────────────────────────────────────────────────────────────┤\
		\n│ ➤ version: $(or $(version),<undefined>) \
		\n│ ➤ type: $(type) \
		\n│ ➤ services: $(services) \
		\n╰──────────────────────────────────────────────────────────────────╯\
		\n"
	#

	# ╭─────
	# │ CHECK:
	# │ |: for validate input parameters
	# ╰─────

	if [ ! $(services) ]; then\
		echo "[Makefile::docker-compose-up] Please set a target services via services=\"<service-1>\"";\
		exit 1;\
		echo "";\
	fi

	if [[ "$(services)" == *"scores-staging"* && "$(services)" == *"scores-production"* ]]; then\
		echo "[Makefile::docker-compose-up] Please do not deploy 'scores-production & scores-staging' together";\
		exit 1;\
		echo "";\
	fi

	if [ "$(version)" = "latest" ]; then\
		cd .docker/; \
		if [[ "$(services)" == *"scores-staging"* ]]; then
			docker compose pull scores-staging; \
		fi
		if [[ "$(services)" == *"scores-production"* ]]; then
			docker compose pull scores-production; \
		fi
		cd ..; \
	fi

	if [ "$(BETARNA_SCORES__DOCKER_IMAGE)" != "name4d/betarena:scores-latest" ]; then\
		echo -e \
			"$(COLOR_R)\
			\n╭──────────────────────────────────────────────────────────────────╮\
			\n│ 🐳 │ WARNING:                                                    │\
		  \n├──────────────────────────────────────────────────────────────────┤\
			\n│ ➤ Docker image is not set to 'name4d/betarena:scores-latest'     │\
			\n│ ➤ Sleeping for 10 seconds                                        │\
			\n├──────────────────────────────────────────────────────────────────┤\
			\n│ ➤ Please set the image to 'name4d/betarena:scores-latest'        │\
			\n╰──────────────────────────────────────────────────────────────────╯\
			$(END_COLOUR)\n";\
		sleep 10; \
	fi

	mkdir \
		-p \
		./.docker/nginx/logs/scores.production \
		./.docker/nginx/logs/scores.staging \
		./.docker/nginx/logs/goaccess
	#

	# ╭─────
	# │ NOTE:
	# │ |: generate docker-compose output file for debugging
	# │ |: generated docker-compose.yml from merged files.
	# ╰─────

	# [🐞]
	docker compose \
		-f .docker/docker-compose.yml \
		-f .docker/.compose/compose.$(type).yml \
		config \
		> .docker/docker-compose.output.yml
	#

	# ╭─────
	# │ NOTE:
	# │ |: [1] export current docker container logs before (re)start
	# │ |: for debugging & archive purposes.
	# │ |: [2] archive 'scores' server changes if version=latest
	# ╰─────

	if [ "$(version)" = "latest" ]; then\
		${MAKE} docker-container-export-logs-all;\
		if [[ "$(services)" == *"scores-production"* ]]; then
			${MAKE} docker-scores-archive-server-changes type="production";\
		fi
		if [[ "$(services)" == *"scores-staging"* ]]; then
			${MAKE} docker-scores-archive-server-changes type="staging";\
		fi
	fi

	# ╭─────
	# │ NOTE:
	# │ |: docker-compose up (build & deploy)
	# ╰─────

	BUILDKIT_PROGRESS=plain \
		docker compose \
		-f .docker/docker-compose.yml \
		-f .docker/.compose/compose.$(type).yml \
		--env-file ./env/.env.docker.compose \
		up \
		--build \
		-d \
		$(services)
	#

	${MAKE} docker-volume-scores-check
#

.ONESHELL:
docker-container-export-logs-all:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: export all docker container logs to a designated directory    │
	# │ │: for archive & debugging purposes.                             │
	# ╰──────────────────────────────────────────────────────────────────╯

	PATH_OUTPUT=./.docker/.export/$$(date +%Y_%m_%d_%H_%M_%S)

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 📜 │ Exporting docker container logs                             │\
		\n├──────────────────────────────────────────────────────────────────┤\
		\n│ ➤ path: $${PATH_OUTPUT} \
		\n╰──────────────────────────────────────────────────────────────────╯\
		\n"
	#

	mkdir -p $${PATH_OUTPUT}

	# ╭─────
	# │ NOTE: IMPORTANT
	# │ |: Export current docker containers metadata to a file.
	# │ |: Used for debugging purposes.
	# ╰─────

	docker ps -a --format="table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.Status}}" --no-trunc >> $${PATH_OUTPUT}/docker.state.log

	# ╭─────
	# │ NOTE: IMPORTANT
	# │ |: Exporting all logs from 'scores' containers (& its replicas)
	# ╰─────

	for i in $$(docker ps --filter name=^betarena-scores-scores- --format="{{.ID}}" --no-trunc); do\
		echo "Exporting logs for container: $$i";\
		cp \
			/var/lib/docker/containers/$${i}/local-logs/container.log \
			$${PATH_OUTPUT}/$${i}.log;\
	done

	# ╭─────
	# │ NOTE: IMPORTANT
	# │ |: Exporting all logs from all other containers to a designated directory
	# ╰─────

	cp \
		/var/lib/docker/containers/**/*-json.log \
		$${PATH_OUTPUT}
	#
#

.ONESHELL:
docker-run-goaccess:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: run goaccess log analyzer for nginx logs.                     │
	# ╰──────────────────────────────────────────────────────────────────╯

	docker run --rm -it \
		-v $(logPath):/temp/goaccess/access.log:ro \
		-v ./.docker/goaccess/output:/var/www/goaccess/goacces.report.html:rw \
		allinurl/goaccess:1.9.3 \
		goaccess \
			$(logPath) \
			-o /var/www/goaccess/goacces.report.html \
			--log-format=COMBINED
	#
#

.ONESHELL:
docker-scores-archive-server-changes:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: export all docker container logs to a designated directory    │
	# │ │: for archive & debugging purposes.                             │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(type) ]; then\
		echo "[Makefile::docker-scores-archive-server-changes] Please set a target type via type=\"<staging|production>\"";\
		exit 1;\
		echo "";\
	fi

	TEMP_DATE=$$(date +%Y-%m-%d_%H-%M-%S)
	PATH_OUTPUT=./.docker/scores.$(type)/.archive/$${TEMP_DATE}
	PATH_OUTPUT_ZIP=./.docker/.archive/scores.$(type).$${TEMP_DATE}

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 📜 │ Exporting docker 'scores' changes                           │\
		\n├──────────────────────────────────────────────────────────────────┤\
		\n│ ➤ path: $${PATH_OUTPUT} \
		\n│ ➤ zip: $${PATH_OUTPUT_ZIP}.zip \
		\n╰──────────────────────────────────────────────────────────────────╯\
		\n"
	#

	rsync \
		-av \
		--exclude '.archive' \
		./.docker/scores.$(type)/ $${PATH_OUTPUT}
	#

	zip \
		-r \
		$${PATH_OUTPUT_ZIP}.zip \
		$${PATH_OUTPUT}
	#
#

.ONESHELL:
docker-scores-staging-toggle:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: toggle 'scores' staging container(s) ON/OFF.                  │
	# ╰──────────────────────────────────────────────────────────────────╯

	TEMP_PATH=.docker/nginx/config/production/nginx.server.scores.staging.conf
	TEMP_MODE=""

	if [ -z "$$(docker ps -aq -f name=betarena-scores-scores-staging-1)" ]; then\
		echo "[Makefile::docker-scores-staging-toggle] 'scores-staging' container not found. Please run 'make docker-compose-up services=scores-staging' to start the container.";\
		exit 1;\
		echo "";\
	fi

	if [ -z "$$(docker ps -aq -f name=betarena-scores-nginx-1)" ]; then\
		echo "[Makefile::docker-scores-staging-toggle] 'nginx' container not found. Please run 'make docker-compose-up services=nginx' to start the container.";\
		exit 1;\
		echo "";\
	fi

	if grep -q "deny all;" $${TEMP_PATH}; then\
		echo "[Makefile::docker-scores-staging-toggle] 'scores-staging' nginx config file found. Proceeding to toggle ON"; \
		TEMP_MODE="on"; \
	elif grep -q "allow all;" $${TEMP_PATH}; then\
		echo "[Makefile::docker-scores-staging-toggle] 'scores-staging' nginx config file found. Proceeding to toggle for OFF"; \
		TEMP_MODE="off"; \
	fi

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🟪 │ Toggling 'scores' staging container(s) $${TEMP_MODE} \
		\n╰──────────────────────────────────────────────────────────────────╯\
		\n"
	#

	if [ "$${TEMP_MODE}" = "on" ]; then\
		gsed -i 's/deny all;/allow all;/g' $${TEMP_PATH};\
		gsed -i 's|# proxy_pass http://scores-staging:3050;|proxy_pass http://scores-staging:3050;|g' $${TEMP_PATH};\
	elif [ "$${TEMP_MODE}" = "off" ]; then\
		gsed -i 's/allow all;/deny all;/g' $${TEMP_PATH};\
		gsed -i 's|proxy_pass http://scores-staging:3050;|# proxy_pass http://scores-staging:3050;|g' $${TEMP_PATH};\
	fi

	docker exec betarena-scores-nginx-1 nginx -s reload
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 💠 // MISCELLANOUS                                                               │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

help:
	@
	echo "TARGETS:"
	make -qpRr | egrep -e '^[a-z].*:$$' | sed -e 's~:~~g' | sort
	echo ""
#

.ONESHELL:
sleep:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ TARGET DESCRIPTION  																						 │
	# ├──────────────────────────────────────────────────────────────────┤
	# │ │: sleep for a designated number of seconds.                     │
	# ╰──────────────────────────────────────────────────────────────────╯

	if [ ! $(seconds) ]; then\
		echo "Please set a target number of seconds via seconds=";\
		exit 1;\
		echo "";\
	fi

	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ ⏱️ │ sleeping for $(seconds) seconds \
		\n╰──────────────────────────────────────────────────────────────────╯\
		\n"
	#

	sleep $(seconds)
#
