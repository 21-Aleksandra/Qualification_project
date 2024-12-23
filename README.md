# Qualification_project

## Changelog

All notable changes to this project will be documented in this file.

In summary:

- v1.x - Auth related jobs
- v2.x - Subsidiary related jobs
- v3.x - Event related jobs
- v4.x - Profile, news, statistics, landing page and dashboard related jobs
- v5.x - Comments related jobs
- v6.x - Administration related jobs (user administration, manager assigment, helper table data edit)
- v7.x - Quality control related jobs(code comments, code tests, possible bugfixes and clean-ups)

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

- Google Geocoding/places API loading problems

### [3.0] - 09-12-2024

#### Added

##### Backend:

- Added event_type, event and event_user tables, seeders, models

#### Changed

##### Backend:

- Relationships between PhotoSet and Subsidiary models - now its one-to-one

### [3.1] - 10-12-2024

#### Added

##### Backend:

- Added event_type, event and event_user routes, controllers, services
- New email types - eventChange and eventCancelation(delition) letters

#### Changed

##### Backend:

- Adjusted initialEventUsers seeder to have more fair destirbution of data
- User and event models relationship naming - now there are aliases for easier understanding (e.g. authors and participants)

#### Fixed

##### Backend:

- Problem with file deletion in the directory when subsidiary photo is removed

### [3.2] - 13-12-2024

#### Added

##### Backend:

- Added event address get endpoint
- Added subsidiary name endpoint in order not to retrieve the entire model for filter

##### Frontend:

- Added params to subsidiary and event stores to remember user filter requests among components
- Added event list page and event filter
- Event, event-type andevent-user API
- Added individual event page with application button

#### Changed

##### Backend:

- Access setting for endpoints added in 3.x versions

#### Fixed

##### Backend:

- Fixed role array splitting error for cintroller added in 3.0

### [3.3] - 14-12-2024

#### Added

##### Frontend:

- Added AddEdit form for event
- Added hooks and sections for AddEditEvrntPage in order to make code more readable
- Added names to subsidiary store for easier maintanance among components

#### Changed

##### Frontend:

- Changed AddOneDropDownElement to work with arrays as well
- Changed some features placement - how photo section and address section are global

#### Fixed

##### Frontend:

- Filtering issues - now sort order is the same for apply and reset by default and publish on it taken into account in store

##### Backend:

- Issues with passing authorId to edit event (was undefiend)

### [3.4] - 17-12-2024

#### Added

##### Frontend:

- Added profile and my event routes
- Added basic profile page and full my event page with filters and unregister buttons

#### Changed

##### Frontend:

- Changed profile and navigation links to variables from router consts
- Changed date formating for event pages

#### Fixed

##### Frontend:

- Fixed api call for user's event to pass data to body, not params

##### Backend:

- Fixed issues with filtering user's events

### [4.0] - 17-12-2024

#### Added

##### Backend:

- Added statistics router, controller and service as well as endpoint for summary

##### Frontend:

- Added StatisticsAPI
- Added real statistics data to landing page

#### Changed

##### Frontend:

- Changed statistics styles

### [4.1] - 19-12-2024

#### Added

##### Backend:

- Added profile router,controller, service
- Added adminRequest email
- Added RequestSequence model,table, seeder
- Added single photo processing util

##### Frontend:

- Added ProfileAPI
- Added real profile page with edit forms and admin request form to inform about bugs
- Added profile form components

#### Changed

- Login and check methods in auth service - now they return progile picture url
- User table,model, seeder - now user has photoId'
- Photo model - now it has conncection to user

##### Frontend:

- Changed auth store to store profile picture url info
- Changed login to set up profile picture on login

#### Fixed

##### Frontend:

- Layout problems connected to profile picture

### [4.2] - 23-12-2024

#### Added

##### Backend:

- Added proper error loging with winston
- Added news, news_set tables, models, seeder
- Added news controller, service, router

#### Changed

##### Frontend:

- Small changes in styles over components

#### Fixed

##### Frontend:

- Dashboard navigation problem - now links work as expected

### [4.3] - 23-12-2024

#### Added

##### Frontend:

- Added newsItem, newsList, newsPage and NewsItemPage
- Added filter for news, configured edit component
- Added news routes, assigned proper roles to them
- Added news mobix store for easier managment

#### Changed

##### Frontend:

- News block now displays author name as well

### [4.4] - 23-12-2024

#### Added

##### Frontend:

- Added AddEditNewsPage
- Added event name getting controller, route, service

#### Changed

##### Frontend:

- Some methods in newsAPI
- Updated EventAPI - how it has getEventNames method

#### Fixed

##### Backend:

- Fixed news service issues

### [5.0] - 23-12-2024

#### Added

##### Backend:

- Added comment, comment_set table, model, seeder
- Added migration to add fk between comment set and other tables

#### Changed

##### Backend:

- Changed other models and migratins to have comment set assigned

#### Fixed

##### Backend:

- Fixed big Photo_set seeder - now code is more readable and efficient

### [5.1] - 23-12-2024

#### Added

##### Backend:

- Added comment router, service, controller

#### Fixed

##### Backend:

- Fixed error with user model connection absence with comment

##### Frontned:

- Fixed error with undefined eventList fields, added forgotten names fields to EventStore
