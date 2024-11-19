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

##### Backend:

- Auth and role checking middlewares for controlling the access to future backend routes
- Add auth status cheking route
- Add regex validation for username, password, email on server

##### Frontend:

- Add Navbar,Footer,Banner,Button,News,Form and Statistics reusable, fully-functional components
- Add non-template look for landing, login, register, password-reset, dashboard pages
- Add router,userrole,navbar consts for easier managment of component visibility along the system
- Add Test page for rolebased acess testing (will be removed)
- Add axios api and Auth endpont call functions for it
- Add Mobx for state managing and axios for reguests

#### Changed

##### Backend:

- Changed file names to follow general naming pattern
- Username is now a unique field for user and cannot contain bad words
- Changed returns/redirects for auth service/controllers
- Changed login logic: now user has only one session per all devices/browsers
- Changed cors settings

### [1.4] - 14-11-2024

#### Added

##### Backend:

- Role model, migration and seeder
- UserRole model, migration and seeder for more scalible and reliable system

#### Changed

##### Backend:

- RoleChecker middleware processing logic for roles - now ensures correct permissons even for multiple roles
- Changed some responses that included role id to role id array
- User table now don't have userId column

##### Frontend:

- Auth store now stores roles as array
- Changed role-based permission processing to potentially allow multiple roles for one user in future

### [2.0] - 19-11-2024

#### Added

##### Backend:

- Address/MainOrganization/PhotoSet/Photo/Mission/Subsidiary/SubsidiaryMission/SubsidiaryManager model, migration and seeder

#### Changed

##### Backend:

- DB settings - now tables can be named with underscores
- Changed UserRole to User_Role
- Changed UserRole related fk as well as added id field to UserRole to improve sequelize queries
- Redis client port and host configuration is moved to .env file
