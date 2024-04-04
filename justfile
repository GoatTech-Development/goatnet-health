dev:
    cd frontend && npm run dev

cloc:
    echo $(cat .clocignore)
    cloc --exclude-list-file=.clocignore $(git ls-files)
