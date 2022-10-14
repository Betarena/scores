# ===========
# DEVELOPMENT
# ===========

dev-start:
	echo 'Starting DEV Environment'
	npm run dev
	echo 'Removing Old DEV Logs'
	rm -r ./datalog/
	echo 'DEV Ready!'

dev-clean:
	echo 'Removing Old DEV Logs'
	rm -r ./datalog/