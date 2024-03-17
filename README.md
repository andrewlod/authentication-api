# Authentication System API
The Authentication System API is a robust authentication system REST API built in TypeScript, designed to provide seamless user authentication and session management for web applications. With a focus on security and usability, this API allows users to effortlessly create accounts using their email addresses and facilitates session management using JSON Web Tokens (JWT).

## Table of Contents
- [Authentication System API](#authentication-system-api)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
    - [Environment](#environment)
  - [Build \& Run](#build--run)
    - [Development](#development)
    - [Production](#production)
  - [Documentation](#documentation)
  - [Running Tests](#running-tests)
  - [Work-in-progress](#work-in-progress)
  - [Authors](#authors)
  - [License](#license)


## Technologies
- TypeScript
- Node.js 20
- Prisma ORM (MySQL)
- AWS Secrets Manager

## Features
- **User Account Management:** Easily create user accounts using email addresses, providing a streamlined registration process for your application.
- **Session Management with JWT:** Manage user sessions securely using JSON Web Tokens, ensuring authenticated access to protected resources while minimizing vulnerabilities.
- **Safe Modification of Credentials:** Implement a safe and straightforward method for users to update their email addresses and passwords, maintaining the integrity and security of user accounts.
- **Credential Storage:** Passwords are securely encrypted through hashing in a MySQL Database, ensuring maximum protection against unauthorized access.
- **Admin User Support:** Administrators can efficiently manage user accounts and permissions, ensuring smooth operations and scalability for your application.
- **Sensitive Application Data:** Safeguard sensitive application data with AWS Secrets Manager for secure storage and management.

## Getting Started
This step describes the prerequisites and install steps for the libraries needed to build and run the project.

### Prerequisites
- [Node.js 20+](https://nodejs.org/en)
- [Node Package Manager (NPM)](https://www.npmjs.com)
- [MySQL](https://dev.mysql.com/downloads/installer/)

### Installing
First of all, you must clone this repository:
```sh
git clone https://github.com/andrewlod/authentication-api.git
```

Then install all dependencies:
```sh
cd authentication-api
npm install
npm run install-db
npm run migrate
```

### Environment
This project uses environment variables on non-production environment and a mix of environment variables and AWS Secrets Manager secrets on production environment. In order to setup the development environment, create a `.env` file in the root of this project, paste the following configuration and fill in the blank variables:
```env
# Environment Variables
SV_PORT=3000
NODE_ENV=development
LOG_STRATEGY=CONSOLE

SECRETS_CONNECTOR=AWS
# If this is not a production environment, the next variable may be left as blank
SECRETS_LIST=

DATABASE_URL="mysql://<username>:<password>@localhost:3306/<schema_name>?schema=public"

# Secrets
PASSWORD_SALT=
JWT_SECRET=
JWT_EXPIRE_MINUTES=
JWT_COOKIE_KEY=
```

## Build & Run
### Development
In order to run the application in your development environment, simply run the following command:
```sh
npm run dev
```

Any file changes will automatically reload the application

### Production
TODO: Write production instructions

## Documentation
TODO: Implement Swagger documentation

## Running Tests
TODO: Implement unit testing

## Work-in-progress
This section describes features that are either work-in-progress or will be implemented in the future. Features are sorted by priority.
- 🚧: Work-in-progress
- ❌: Not yet started

| Feature | Status |
|---------|--------|
| Unit Tests | ❌ |
| Centralize types/interfaces | 🚧 |
| Track JWT expiry status when user logs off | ❌ |
| Turn DATABASE_URL into secret | ❌ |
| Swagger Documentation | ❌ |
| Production Build Scripts | ❌ |
| Dockerize Application | ❌ |
| Kubernetes Configuration | ❌ |
| CI with GitHub Actions | ❌ |
| CI/CD with AWS CodeBuild/CodePipeline | ❌ |
| Terraform to deploy necessary AWS infrastructure | ❌ |

## Authors
- Andre Wlodkovski - [@andrewlod](https://github.com/andrewlod)

## License
This project is licensed under the [MIT License](https://opensource.org/license/mit) - see the [LICENSE](LICENSE) file for details.
