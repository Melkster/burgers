install: 
	@echo "Make sure that you install SASS"
	@echo ""
	npm install
	make server

server:
	sass --watch styling:styling/css &
	npm run dev

tree:
	clear
	tree -I node_modules
