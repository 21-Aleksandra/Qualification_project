// This file stores all the route constants for the application.
// These constants ensure consistency and avoid hardcoding URLs throughout the application.
// Please add new routes here as the application grows, ensuring all route paths are defined
// in one place for easier maintenance and better readability.

export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const LANDING_ROUTE = "/home";
export const DASHBOARD_ROUTE = "/dashboard";
export const RESET_PASSWORD_MAIL_ROUTE = "/forgot-password";
export const RESET_PASSWORD_FORM_ROUTE = "/reset-password/:token";
export const TEST_ROUTE = "/test";
export const EVENTS_ROUTE = "/events";
export const MY_ORGANISATIONS_ROUTE = "/my-organisations";
export const SUBSIDIARIES_ROUTE = "/subsidiaries";
export const SUBSIDIARY_ITEM_ROUTE = "/subsidiaries/:id";
export const SUBSIDIARY_EDIT_ROUTE = "/subsidiaries/edit/:id";
export const SUBSIDIARY_ADD_ROUTE = "/subsidiaries/add";
export const EVENT_ROUTE = "/events";
export const EVENT_ITEM_ROUTE = "/events/:id";
export const EVENT_EDIT_ROUTE = "/events/edit/:id";
export const EVENT_ADD_ROUTE = "/events/add";
export const MY_EVENTS_ROUTE = "/events/my-events";
export const MY_PROFILE_ROUTE = "/profile";
export const NEWS_ROUTE = "/news";
export const EVENT_NEWS_ITEM_ROUTE = "/news/event-news/:id";
export const SUBSIDIARY_NEWS_ITEM_ROUTE = "/news/subsidiary-news/:id";
export const EVENT_NEWS_ADD_ROUTE = "/news/event-news/add";
export const SUBSIDIARY_NEWS_ADD_ROUTE = "/news/subsidiary-news/add";
export const EVENT_NEWS_EDIT_ROUTE = "/news/event-news/:id/edit";
export const SUBSIDIARY_NEWS_EDIT_ROUTE = "/news/subsidiary-news/:id/edit";
export const COMMENT_ADMIN_ROUTE = "/comment-admin";

export const USERS_ROUTE = "/users";
export const USERS_EDIT_ROUTE = "/users/:id/edit";
export const USERS_ADD_ROUTE = "/users/add";

export const MANAGERS_ROUTE = "/subsidiary-managers";
export const MANAGERS_EDIT_ROUTE = "/subsidiary-managers/:id/edit";

export const HELPER_TABLE_ROUTE = "/helper-tables";
export const HELPER_TABLE_ADDRESS_ROUTE = "/helper-tables/address";
export const HELPER_TABLE_ADDRESS_EDIT_ROUTE =
  "/helper-tables/address/:id/edit";

export const HELPER_TABLE_EVENTTYPE_ROUTE = "/helper-tables/event-type";
export const HELPER_TABLE_EVENTTYPE_EDIT_ROUTE =
  "/helper-tables/event-type/:id/edit";

export const HELPER_TABLE_MISSION_ROUTE = "/helper-tables/mission";
export const HELPER_TABLE_MISSION_EDIT_ROUTE =
  "/helper-tables/mission/:id/edit";

export const HELPER_TABLE_ORGANIZATION_ROUTE =
  "/helper-tables/main-organization";
export const HELPER_TABLE_ORGANIZATION_EDIT_ROUTE =
  "/helper-tables/main-organization/:id/edit";
