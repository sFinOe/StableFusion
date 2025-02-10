# StableFusion Web Application

A User-interface Web App using technology of Stable Diffusion and Dreambooth to train a model and generate images with higher quality using GFPGAN
model.

<p>
  <img src="/misc/Capture2.PNG" width="500px" />
  <img src="/misc/Capture3.PNG" width="500px" />
</p>

# Features

- Login and sign up
- Email verification
- Upload and Download images
- Training a stable diffusion model
- Generate images with prompt

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for production or development.

# Prerequisites

- [Docker (for production)](https://docs.docker.com/engine/install/ubuntu/)
- [Node.js](https://nodejs.org/)
- [React Native](https://reactnative.dev/)

# Installation

Clone the repository

```
git clone https://github.com/sFinOe/stable-diffusion-web-app.git
cd stable-diffusion-web-app
```

To deploy using docker (for production)

```
docker-compose up --build
```

To deploy using bash (for development)

```
sudo bash setup.sh
```

## Code Structure

```
- client
  - api
  - assets
    - images
    - icons
  - components
    - atoms
    - molecules
    - organisms
    - pages
    - environment
  - hooks
  - store
    - actions
    - reducers
    - thunks
    - tests
  - styles
  - utils
- server
  - config
  - database
  - routes
- scripts
```

Component Heirarchy:

Environment > Pages > Organisms > Molecules > Atoms

This is based on atomic design. Learn more about [atomic design](http://bradfrost.com/blog/post/atomic-web-design/).

## Technologies

[React](https://facebook.github.io/react/) - View Library

[Redux](http://redux.js.org/) - State Manager

[Webpack](https://webpack.github.io/) - Module Bundler

[Express](http://expressjs.com/) - Node Application Framework

[MongoDB](https://www.mongodb.com/) - Document Database

[Mongoose](http://mongoosejs.com/) - MongoDB Framework

[Passport](http://www.passportjs.org/) - Authentication Framework

[React Notifications Component](https://teodosii.github.io/react-notifications-component/) - Notification System

[Bulma](http://bulma.io/) - CSS Framework

[React Bulma Companion](https://github.com/djizco/react-bulma-companion) - Bulma Component Library

[FontAwesome](http://fontawesome.io/) - Icons

[Ramda](http://ramdajs.com/) - Functional Library

[date-fns](https://date-fns.org/) - Date Functions Library

[SuperAgent](https://github.com/visionmedia/superagent) - HTTP Request Library

[ESLint](http://eslint.org/) - Code Linter

[Jest](https://jestjs.io/) - Testing Framework
