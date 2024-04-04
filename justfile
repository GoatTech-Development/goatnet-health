PHONY: clean

start-server:
    cd backend && node index.js

dev:
    cd frontend && npm run dev

build:
    cd frontend && npm run build

preview:
    cd frontend && npm run preview

lint:
    cd frontend && npm run lint

cloc:
    cloc --exclude-list-file=.clocignore $(git ls-files)

clean:
    rm -rf frontend/dist

prune-prod:
    cd frontend && npm prune --production

prune-dev:
    cd frontend && npm prune --production=false
