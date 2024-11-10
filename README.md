# Qualification_project

## Changelog

All notable changes to this project will be documented in this file.

### [1.0] - 28-09-2024

#### Added

- Primaty libraries/frameworks: cors, node, express, sequelize, mysql2 etc.
- User table migration.
- Database connection and configuration.
- Test code in index.js.

### [1.1] - 14-10-2024

#### Added

- Auth route, controller and service + login/logout/register endpoint implementation.
- User table seeder.
- Express-session.
- Redis instalation, connection and setup for sessions.
- ErrorHandler middleware + class.

#### Changed

- Refactored codebase to improve readability.

#### Fixed

- Resolved issue with database timezone.
- Resolve small endpoint and middleware bugs.

### [1.2] - 17-10-2024

#### Added

- Nodemailer + configuration for sending e-mails to all registered adresses via gmail.
- Password reset and email verification emails and endpoints.
- Jwt for more secure links.
- Proper jwt expiration error handling.
- New field in user table and seeder for verification.

#### Changed

- Added rolling cookies (expiration reset on each request).
- Added generalized functions for avoiding code repetition.
- Login logic (added check for verifiction).

#### Fixed

- Minor logical statement bugs in endpoints

### [1.3] - 10-11-2024 - Major update

#### Added

## Backend:

- Auth and role checking middlewares for controlling the access to future backend routes
- Add auth status cheking route
- Add regex validation for username, password, email on server

## Frontend:

- Add Navbar,Footer,Banner,Button,News,Form and Statistics reusable, fully-functional components
- Add non-template look for landing, login, register, password-reset, dashboard pages
- Add router,userrole,navbar consts for easier managment of component visibility along the system
- Add Test page for rolebased acess testing (will be removed)
- Add axios api and Auth endpont call functions for it
- Add Mobx for state managing and axios for reguests

#### Changed

## Backend:

- Changed file names to follow general naming pattern
- Username is now a unique field for user and cannot contain bad words
- Changed returns/redirects for auth service/controllers
- Changed login logic: now user has only one session per all devices/browsers
- Changed cors settings
