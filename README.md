# Server Template

This template repository should be used to create backend services in NestJS.

- [Server Template](#server-template)
    - [Install](#install)
    - [Environment Setup](#environment-setup)
    - [Guidelines](#guidelines)
        - [Style](#style)
        - [Architecture](#architecture)
            - [Server Engine](#server-engine)
            - [Third party dependencies](#third-party-dependencies)
            - [Files and Directories](#files-and-directories)
                - [General](#general)
                - [Sources](#sources)

## Install

1. Create a new repository, using this one as a template. This can be done by clicking the green "Use this template" button at the top of this page.

2. Initialize it with the following commands.

   ```bash
   npm install
   node -r ts-node init.js
   ```

3. Build an awesome service !

## Environment Setup

To facilitate testing speed, we rely on some databases to be available locally when testing through `npm run test`. The easiest way to do this is to run docker containers and then bind them to your local machine.

If you do not have docker installed, follow the [installation instructions](https://docs.docker.com/docker-for-mac/install/).

To fetch and setup the containers type the following commands.

```bash
docker run --name redis -d -p 6379:6379 redis:6
docker run --name mysql -d -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=rolo -p 3306:3306 mysql:5.7
docker run --name postgres -d -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=rolo -p 5432:5432 postgres:12
docker run --name elasticsearch -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.13.1
docker run --name influxdb -d -p 8086:8086 -e DOCKER_INFLUXDB_INIT_MODE=setup -e DOCKER_INFLUXDB_INIT_USERNAME=rolo -e DOCKER_INFLUXDB_INIT_PASSWORD=rolo -e DOCKER_INFLUXDB_INIT_ORG=rolo -e DOCKER_INFLUXDB_INIT_BUCKET=rolo -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=rolo influxdb:2.0-alpine
```

To start the container again in the future you simply have to run the following command.

```bash
docker start redis mysql postgres elasticsearch
```

## Guidelines

The following set of guidelines should be followed when building a backend service. This ensures that we have full consistency across all of our codebase and that anyone can easily maintain and improve a service.

### Style

Backend services should be written in the pure Typescript. The basic style guide to follow is the [Google one](https://google.github.io/styleguide/tsguide.html).

On top of this we have some specific requirements.

- Always use module imports when possible

  ```javascript
  // Correct
  import {readFileSync} from 'fs';
  import fs from 'fs';
  // Incorrect
  const fs = require('fs');
  ```

- Always define type for a variable/function

  ```javascript
  // Correct
  const myVariable: number = 1;
  async function myFunction(): Promise<void> {}
  class MyClass {
    method(): void {}
  }
  // Incorrect
  const myVariable = 1;
  async function myFunction() {}
  class MyClass {
    method() {}
  }
  ```

- Avoid anonymous functions as much as possible as they make the call stack more obscure for debugging. Use them for small utility stuff or as callbacks.

  ```javascript
  // Correct
  function myFunction(): void {}
  const a = [...].map((item) => item.id)
  class MyClass {
    method(): void {}
  }
  // Incorrect
  const myFunction = (): void => {}
  class MyClass {
    method = (): void => {}
  }
  ```

- Add [JSDoc](https://jsdoc.app/) comments to all the functions. A description, the params, and the return should be documented. This allows other people to use your function without having to read the code.

  ```javascript
  /*
   * Add two numbers together
   * @param {Number} firstNumber - The first number to add
   * @param {Number} secondNumber - The second number to add
   * @return {Number} - The result
   */
  function addNumbers(firstNumber: number, secondNumber: number): number {
    return firstNumber + secondNumber;
  }
  ```

- Use descriptive names for function and variables and avoid generic names and abbreviations.

  ```javascript
  // Correct
  const authToken: string = '';
  let blockedContacts: Array<unknown> = [];
  function sendInvitationEmail(userId: string): void {}
  // Incorrect
  const tkn = (string = '');
  let blockList: Array<unknown> = [];
  function invitationSend(id: string): void {}
  ```

- Add comments to describe your code. The aim is that someone working on your code should be able to understand the code without having to deeply read every line of it.

  ```javascript
  function registerUser(user: User): void {
    // Find users that have already invited this user and send them friend requests
    const inviters: Array<Invitation> = Invitation.findAll({where: {userId: user.id}});
    for (const inviter of inviters) {
      sendFriendRequest(user, inviter);
    }
    // Persist the user in the DB
    UserService.registerUser(user);
    // Send a push notification to the user
    sendPushNotification(user);
  }
  ```

- Functions should be limited to a single point of logic and should not be too long. Split between multiple functions your logic as much as possible.

### Architecture

#### Server Engine

All the services must use the [Server Engine](https://github.com/phatvo21/nest-server-engine). This framework standardizes the development process and allows you to focus on building the business logic and not the server's architecture.

#### Third party dependencies

Third party dependencies can be very useful as they can solve issues that we encounter and speed up our development time.

These dependencies however import outside code into our codebase and should always be added to a project with caution.

When wishing to add a new library, look at its source code and ask yourself some questions.

- Is it a simple utility function? If so, could we not inspire ourself from the library's function and write a similar function in our project? This would allow us to keep the power over this function and make it evolve the way we want in the future.

- Is it something that is shared with other services/projects? Maybe that the logic could live in the Server Engine or in another of our libraries.

- Is it a very large library? We do not need to import lodash if we simply need one of its utility functions, it can probably be found elsewhere or written by ourselves.

- Is it maintained? Check the last updates on the repository to see if there still is some activity.

#### Files and Directories

##### General

The basic architecture is like this.

```bash
  /dist # Compiled runtime files (not committed to git)
  /src # Source code
  /test # Test utilities
    /integration # The folder holds all the integration tests
    /unit # The folder holds all the unit tests
```

Rules

- `src/main.ts` files should be used strictly for bootstrapping, and exporting, they should not hold any business logic.

- Each file should hold a single class/function whenever it is possible.

- Constants should be declared in another file located in the same directory as `{fileName}.const.ts`.

- Types/Interfaces should be declared in another file located in the same directory as `{fileName}.types.ts`.

##### Sources

The `/src` directory is by convention defined in such a way.

```bash
/src
  /module-name # Business logic functions that are shared between different endpoints.
    /`{fileName}.controller.ts` # Controller where declare all the endpoints logic of the module
    /`{fileName}.service.ts` # Service where declare all the business logic handlers and actions as a bridge to connect between Service and Database
    /`{fileName}.module.ts` # NestJS module where provides, imports and exports the entities, controllers, services, repositories needed
    /data # Holds all the information related to Database models that's represent for the module
      /repository # Contains all repository needed for the module
    /utils # Utility functions for the module
    /dtos # Declare the validation for the specific endpoints
  /const # Project-wide constants or enumerations
  /db
    /migrations # DB Migrations
    /entities # Typeorm entities
    /seeds # Typeorm seeds for database tables
    /factories # Typeorm factories  
      /data # Holds all the seeds data that are defined to match the database's entities
        /`{fileName}.ts` # File contains the seed data
    # Other Typeorm related files
  /utils
    # Utility functions
  /`app.module.ts` # The application module where imports all the project's modules
  /`main.ts` # File containing bootstrapping functions for NestJs application
```

On larger projects, the architecture can be divided in smaller sub-modules that have a separate business logic.

```bash
/src
  /db
    /entities
      `contact.entity.ts`
      `user.entity.ts`
    /migrations
      `1315526277222728-user.ts`
      `1315526272626277-contact.ts`
   /seeds
      `init-db.seed.ts`
   /factories
      /data
        `contact.data.ts`
        `user.data.ts`
  /contact
    /`contact.controller.ts`
    /`contact.service.ts`
    /`contact.module.ts`
    /data
      /repository
        interface
          `contact.repository.interface.ts`
        `contact.repository.ts`
    /utils
      `contact.utils.ts`
    /dtos
      `contact.dto.ts`      
  /user
    /`user.controller.ts`
    /`user.service.ts`
    /`user.module.ts`
    /data
      /repository
        interface
          `user.repository.interface.ts`
        `user.repository.ts`
    /utils
      `user.utils.ts` 
    /dtos
      `user.dto.ts`         
  /utils
    `{fileName}.util.ts`
  /const
    `{fileName}.const.ts`  
  `app.module.ts`
  `main.ts`  
```