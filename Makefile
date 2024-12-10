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

	echo -e\
		"\n$(COLOUR_GREY)\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		\n▓                                          ▓\
		\n▓ 🟩 Done!                                 ▓\
		\n▓                                          ▓\
		\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\
		$(END_COLOUR)\n"
	@
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🏗️ │ SETUP                                                                       │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
setup-git:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom setup for GIT target executable.                        │
	# │ > 🔗 read-more :|: https://github.com/nvm-sh/nvm							   │
	# ╰──────────────────────────────────────────────────────────────────╯

	# ▓ @see :|: https://stackoverflow.com/questions/1257592/how-do-i-remove-files-saying-old-mode-100755-new-mode-100644-from-unstaged-cha
	git config core.filemode false

	git config\
		--list\
		--show-origin
	@
#

.ONESHELL:
setup-node:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > setup of project Node/NPM via NVM                              │
	# │ > 🔗 read-more :|: https://github.com/nvm-sh/nvm							   │
	# ╰──────────────────────────────────────────────────────────────────╯

	-. ${NVM_DIR}/nvm.sh
	-nvm use

	# ▓ NOTE:
	# ▓ > installs target 'node' version, if absent.
	nvm install 18.19.0
	# nvm use 18.19.0

	npm install -g npm@10.2.3

	npm i

	$(MAKE) log-end
#

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
# │ 🛠️ │ DEVELOPEMNT                                                                 │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
dev-local-1-click:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: │ DESCRIPTION																						   │
	# │ > 1-click quick spin up of local development environment         │
	# ╰──────────────────────────────────────────────────────────────────╯

	# . ${NVM_DIR}/nvm.sh
	# nvm use

	echo \
		"$(COLOUR_B)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 📣 Initiating Development Setup                                  │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n";
	#

	DOTENV_KEY=$(shell npx --yes dotenv-vault@1.25.0 keys development)\
		npm run "sveltekit|:|dev|:|1-click"
	#
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🔑 │ DOTENV SECRETS                                                              │
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
# │ 🟪 │ HEROKU                                                                      │
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
# │ 🐳 │ DOCKER                                                                      │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
docker-test:
	echo \
		"$(TEST_ENV_VALUE)" \
		"$(ENV_DOCKER_HUB_USERNAME)"
	#
#

.ONESHELL:
docker-image-build:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: │ DESCRIPTION																						   │
	# │ ➤ create docker image for Betarena // Scores                     │
	# ╰──────────────────────────────────────────────────────────────────╯

	echo \
		"$(COLOUR_B)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🐳 │ Building Docker Image                                       │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n";
	#

	-dot_clean .

	docker build \
		-t betarena-scores:$(shell npm pkg get version --workspaces=false | tr -d \") \
		-f ./.docker/Dockerfile \
		. \
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

	echo \
		"$(COLOUR_B)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🐳 │ Creating Docker Image                                       │\
		\n│ 	 │: DockerHub Account :: $(ENV_DOCKER_HUB_USERNAME) \
		\n│ 	 │: Docker ImageId :: $(ENV_IMAGE_TAG_ID) \
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n";
	#

	# docker login \
	# 	-u $(ENV_DOCKER_HUB_USERNAME) \
	# 	-p $(ENV_DOCKER_HUB_PASSWORD) \
	# 	docker.io
	#

	# ╭─────
	# │ NOTE:
	# │ |: Docker Image Tagging (Version)
	# ╰─────

	docker tag \
		$(ENV_IMAGE_TAG_ID) \
		$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-$(shell npm pkg get version --workspaces=false | tr -d \")
	#

	docker push \
		$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-$(shell npm pkg get version --workspaces=false | tr -d \")
	#

	# ╭─────
	# │ NOTE:
	# │ |: Docker Image Tagging (Latest)
	# ╰─────

	docker tag \
		$(ENV_IMAGE_TAG_ID) \
		$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-latest
	#

	docker push \
		$(ENV_DOCKER_HUB_USERNAME)/betarena:scores-latest
	#
#

.ONESHELL:
docker-spin-start-production:
	@
	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🔴 │ (re)Start container(s) | Production                         │\
		\n╰──────────────────────────────────────────────────────────────────╯"
	#

	BUILDKIT_PROGRESS=plain \
		docker compose \
		-f .docker/docker-compose.yml \
		--env-file .env.docker \
		up \
		--build \
		-d \
		web-prod
	#
#

.ONESHELL:
docker-spin-start-ngnix:
	@
	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🔀 │ (re)Start container(s) | Nginx                              │\
		\n╰──────────────────────────────────────────────────────────────────╯"
	#

	mkdir \
		-p \
		./.docker/nginx/logs/scores \
		./.docker/nginx/logs/goaccess
	#

	BUILDKIT_PROGRESS=plain \
		docker compose \
		-f .docker/docker-compose.yml \
		--env-file .env.docker \
		up \
		--build \
		-d \
		nginx goaccess
	#
#

.ONESHELL:
docker-container-log-full-export:
	@
	echo -e \
		"\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 📜 │ Exporting docker container logs                             │\
		\n╰──────────────────────────────────────────────────────────────────╯"
	#

	mkdir -p ./.docker/export/$(date +%d-%m-%Y %H:%M:%S)

	cp \
		/var/lib/docker/containers/**/*-json.log \
		/var/lib/docker/containers/**/local-logs*.log \
		./.docker/export/$(date +%d-%m-%Y %H:%M:%S)
	#
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🟣 │ SENTRY                                                                      │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

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

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 🔑 │ GIT                                                                         │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

.ONESHELL:
git-commit:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > custom GIT commit target executable, used for: 	               │
	# │ > 1. MacOS system file clean, and            							       │
	# │ > 2. enforce husky use                       							       │
	# ╰──────────────────────────────────────────────────────────────────╯

	$(MAKE) mac-os-clean

	# ▓ NOTE:
	# ▓ > initiate custom GIT commit flow.
	git commit

	$(MAKE) log-end
#

.ONESHELL:
git-pr-close-clean:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │  ▓ DESCRIPTION ▓ NOTE: ▓ IMPORTANT														   │
	# │ > please run '_this_' target AFTER each successull `closed`			 │
	# │ > pull-request to (main) to get (local) dev in pair with (main). │
	# │ > 1. MacOS system file clean, and            							       │
	# │ > 2. enforce husky use                       							       │
	# ╰──────────────────────────────────────────────────────────────────╯

	echo\
		"$(COLOUR_B)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ ⚙️ POST origin/main PR clean                      		        	  │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	git checkout main
	git pull origin main
	git checkout dev
	git stash
	git reset --hard main

	$(MAKE) log-end
#

git-del-branches-w-origin:
	echo 'Deleting branches not present in origin + /dev'
	# Original command (below) is without \(...\) syntax
	# git fetch -p ; git branch -r | awk '{print $$1}' | egrep -v -f /dev/fd/0 <\(git branch -vv | grep origin\) | awk '{print $$1}' | xargs git branch -D
	# git branch --merged | grep -v "*" | grep -v "main" | xargs git branch -d
#

#: deprecated/archive
git-repo-secrets-ci-cd-update:
	echo \
		"$(COLOR_G)\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		\n◼️ 🚀 Scores | Set Github Secrets             ◼️\
		\n◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️\
		$(END_COLOUR)\n"
	gh secret set -f .env.ci-cd
	echo ""
	gh secret set ENV_FILE --body "$(shell cat .env.ci-cd | base64)"
	echo ""
#

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 💠 │ MISCELLANOUS                                                                │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

help:
	@echo "\nTARGETS:\n"
	@make -qpRr | egrep -e '^[a-z].*:$$' | sed -e 's~:~~g' | sort
	@echo ""
#

.ONESHELL:
test:
	@

	echo \
		"$(COLOUR_R)\
		\n╭──────────────────────────────────────────────────────────────────╮\
		\n│ 🔑 Heroku | Deployment (Worflow)                                 │\
		\n╰──────────────────────────────────────────────────────────────────╯\
		$(END_COLOUR)\n"
	@

	echo "testing"
#

mac-os-clean:
	@
	# ╭──────────────────────────────────────────────────────────────────╮
	# │ NOTE: ▓ DESCRIPTION																						   │
	# │ > required for MacOS removal of `._*` files.     	               │
	# │ > for deploying a custom deployment sequence.							       │
	# ╰──────────────────────────────────────────────────────────────────╯
	# ▓ > @see :|: https://apple.stackexchange.com/questions/14980/why-are-dot-underscore-files-created-and-how-can-i-avoid-them

	$(eval UNAME_S=$(shell uname -s))
	if [ "$(UNAME_S)" == "Darwin" ]; then\
		echo \
			"$(COLOUR_B)\
			\n╭──────────────────────────────────────────────────────────────────╮\
			\n│ Misc (clean)                                                     │\
			\n╰──────────────────────────────────────────────────────────────────╯\
			$(END_COLOUR)\n";

		dot_clean .;\
	fi
#

changelog-init:
	@echo ""
	# ▓ DESCRIPTION
	# ▓ > custom use of `conventional-changelog` command.
	# ▓ > for generating new CHANGELOG.md
	# ▓ > use the `conventional-changelog --help` for more information.
	@echo ""

	@npx --yes conventional-changelog-cli -p angular -i CHANGELOG.md -s -r 0

	$(MAKE) log-end
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