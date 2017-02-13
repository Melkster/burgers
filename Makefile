install: 
	npm install
	make server

server:
	npm run dev

tree:
	tree -I node_modules
