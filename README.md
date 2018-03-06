[![TravisCIBadge](https://travis-ci.org/research-software-directory/admin.svg?branch=master)](https://travis-ci.org/research-software-directory/admin)
[![Docker badge](https://dockerbuildbadges.quelltext.eu/status.svg?organization=rsdnlesc&repository=admin)](https://hub.docker.com/r/rsdnlesc/admin/)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app). Original documentation [here](https://github.com/NLeSC/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Dependencies
- Auth service e.g. [github-auth](https://github.com/research-software-directory/auth-github).
- Data api service like [rsd-backend](https://github.com/research-software-directory/backend).

# Installation
- Clone repository
- Use node version `^8.0`, eg using [nvm](#install-node-using-nvm)
- Install dependencies: `npm install`
- Run tests `npm run test`
- Start app in dev server: `npm start`

## Settings
Run-time settings should be reachable through `[BASE_URL]/settings.json`, see e.g. `public/settings.json`.
This settings file should be overriden in production.

# Build
- `npm run build`
- Will build to `[current directory]/build`

### Install node using NVM
See https://github.com/creationix/nvm#install-script
- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
- restart terminal
- run `nvm install 8`
