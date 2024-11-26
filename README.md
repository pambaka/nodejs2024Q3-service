# Home Library Service

### Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/pambaka/nodejs2024Q3-service.git
```

## Switch to the develop branch

```
git checkout develop-3
```

## Installing NPM modules

```
npm install
```

## Rename .env.example file

```
mv .env.example .env
```

## Running application

```
npm run docker:up
```

## Running application in watch mode
! It may take some time for the app to apply changes

```
npm run docker:watch
```

## Scan images for vulnerabilities

```
npm run scan {docker-hub}/{image}
```
replace `{docker-hub}` with the docker hub name and `{image}` with the image name


## Documentation on the app usage

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing 

```http://localhost:4000/doc```

For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests with authorization

```
npm run test:auth
```
```
npm run test:refresh
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```
---

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
