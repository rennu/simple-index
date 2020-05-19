# How to use


## Using precompiled file
1. Copy dist/index.html file to the directory you wish to index
2. Run `tree -J -D --dirsfirst --timefmt '%H:%M:%S %d.%m.%Y' > files.json`
3. Done.

## Building
1. Install node.js, go to the project root using your favourite console application and run commands:
 ```
npx yarn
npx yarn build
```
2. Copy dist/index.html file to the directory you wish to index
3. Run `tree -J -D --dirsfirst --timefmt '%H:%M:%S %d.%m.%Y' > files.json`
4. Done.
