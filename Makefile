# ===========
# DEVELOPMENT
# ===========

dev-start:
	echo 'Starting DEV Environment'
	npm run dev
	echo 'Removing Old DEV Logs'
	rm -r ./data/
	echo 'DEV Ready!'

dev-clean:
	echo 'Removing Old DEV Logs'
	rm -r ./data/