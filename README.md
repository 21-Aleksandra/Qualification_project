# Qualification_project

## Changelog

All notable changes to this project will be documented in this file.

In summary:

- v1.x - Auth related jobs
- v2.x - Subsidiary related jobs

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

### [2.0] - 25-11-2024

#### Added

##### Backend:

- Address/MainOrganization/PhotoSet/Photo/Mission/Subsidiary/SubsidiaryMission/SubsidiaryManager model, migration and seeder
- Address, mainOrganization, mission and subsidiary services and controllers

#### Changed

##### Backend:

- DB settings - now tables can be named with underscores
- Changed UserRole to User_Role
- Changed UserRole related fk as well as added id field to UserRole to improve sequelize queries
- Redis client port and host configuration is moved to .env file
- Changed session model - now user has id

##### Frontend:

- User id is added to Auth storage and accoring methods

### [2.1] - 01-12-2024

#### Added

##### Frontend:

- Address/MainOrganization/Mission/Subsidiary stores for effective data managment
- MultiSelectItem, Pagination universal components
- Subsidiary list page and subsidiary item page with manager-only data retrievieng option
- Subsidiary-specific filter component
- Default subsidiary picure
- New envs and router consts
- GoogleMaps component and google maps API integration for displaying the location pf subsidiary

#### Changed

##### Backend:

- Added coordinates to Address model/table/responses
- Changed get-list responses for mainOrgainzations,addresses so they would be specific for managers and related only to subsidiaries

##### Frontend:

- Loading panels for some pages/components

#### Fixed

##### Backend:

- Minor logical statement bugs in endpoints

##### Frontend:

- Css overlapping problems (not component-specific css)

### [2.2] - 07-12-2024

#### Added

##### Backend:

- Added all address get endpoint
- Photo uploading and deleting for subsidiaries as well as PhotoUtils

##### Frontend:

- New folders for complex form features and hooks
- Add and edit form for subsidiary as well as delete functionality and checkboxes for selection
- New general components for more convenient layout - search dropdowns, simple add forms, text inputs etc.
- File utils for file-related handling such as upload from server

#### Changed

##### Backend:

- Changed Address table fields - now it has better precision for lng and lat
- Changed /static access configuration for form data handling to avoid cors mismatch and errors
- Now subsidiary photos are stored in subsidiaryPhotos folder

##### Frontend:

- Component file organisations - how conponents are sorted by general folders depending on its functionality

#### Fixed

##### Backend:

- Seeder auto-increment problem - now reseeding is prssible without errors
- Subsidiary and address endpoint logical flaws - now deletion and adding work as expected

##### Frontend:

- Google API loading problems
