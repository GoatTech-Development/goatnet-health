PHONY: clean

start-server:
    cd backend && tsc && node dist/index.js

dev:
    cd frontend && npm run dev

build-frontend:
    cd frontend && npm run build

build-docker:
    docker compose build

preview:
    cd frontend && npm run preview

serve:
    cd frontend && npm run serve

lint-frontend:
    cd frontend && npm run lint

cloc:
    cloc --exclude-list-file=.clocignore $(git ls-files)

clean:
    rm -rf frontend/dist

prune-prod:
    cd frontend && npm prune --production

prune-dev:
    cd frontend && npm prune --production=false
