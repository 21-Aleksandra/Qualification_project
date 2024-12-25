import LandingPage from "./pages/LandingPage/LandingPage";
import LoginRegisterPage from "./pages/LoginRegisterPage/LoginRegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import PasswordResetEmailPage from "./pages/PasswordResetEmailPage/PasswordResetEmailPage";
import PasswordResetFormPage from "./pages/PasswordResetFormPage/PasswordResetFormPage";
import SubsidiaryPage from "./pages/SubsidiaryPage/SubsidiaryPage";
import SubsidiaryItemPage from "./pages/SubsidiaryItemPage/SubsidiaryItemPage";
import AddEditSubsidiaryPage from "./pages/AddEditSubsidiaryPage/AddEditSubsidiaryPage";
import EventItemPage from "./pages/EventItemPage/EventItemPage";
import EventPage from "./pages/EventPage/EventPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage";
import MyEventsPage from "./pages/MyEventsPage/MyEventsPage";
import AddEditEventPage from "./pages/AddEditEventPage/AddEditEventPage";
import NewsItemPage from "./pages/NewsItemPage/NewsItemPage";
import AddEditNewsPage from "./pages/AddEditNewsPage/AddEditNewsPage";
import CommentAdminPage from "./pages/CommentAdminPage/CommentAdminPage";

import UserPage from "./pages/UserPage/UserPage";
import AddEditUserPage from "./pages/AddEditUserPage/AddEditUserPage";

import SubsidiaryManagerPage from "./pages/SubsidiaryManagerPage/SubsidiaryManagerPage";
import SubsidiaryManagerEditPage from "./pages/SubsidiaryManagerEditPage/SubsidiaryManagerEditPage";

import HelperTableSelectPage from "./pages/HelperTableSelectPage/HelperTableSelectPage";

import AddressListPage from "./pages/AddressListPage/AddressListPage";
import AddressListEditPage from "./pages/AddressListEditPage/AddressListEditPage";

import EventTypeListPage from "./pages/EventTypeListPage/EventTypeListPage";
import EventTypeListEditPage from "./pages/EventTypeListEditPage/EventTypeListEditPage";

import MissionListPage from "./pages/MissionListPage/MissionListPage";
import MissionListEditPage from "./pages/MissionListEditPage/MissionListEditPage";

import OrganizationListPage from "./pages/OrganizationListPage/OrganizationListPage";
import OrganizationListEditPage from "./pages/OrganizationListEditPage/OrganizationListEditPage";

import TestPage from "./pages/TestPage";
import UserRoles from "./utils/roleConsts";

import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  LANDING_ROUTE,
  DASHBOARD_ROUTE,
  RESET_PASSWORD_MAIL_ROUTE,
  RESET_PASSWORD_FORM_ROUTE,
  TEST_ROUTE,
  SUBSIDIARIES_ROUTE,
  SUBSIDIARY_ITEM_ROUTE,
  SUBSIDIARY_EDIT_ROUTE,
  SUBSIDIARY_ADD_ROUTE,
  EVENT_ROUTE,
  EVENT_ITEM_ROUTE,
  EVENT_EDIT_ROUTE,
  EVENT_ADD_ROUTE,
  MY_EVENTS_ROUTE,
  MY_PROFILE_ROUTE,
  NEWS_ROUTE,
  EVENT_NEWS_ITEM_ROUTE,
  SUBSIDIARY_NEWS_ITEM_ROUTE,
  EVENT_NEWS_ADD_ROUTE,
  SUBSIDIARY_NEWS_ADD_ROUTE,
  EVENT_NEWS_EDIT_ROUTE,
  SUBSIDIARY_NEWS_EDIT_ROUTE,
  COMMENT_ADMIN_ROUTE,
  USERS_ROUTE,
  USERS_ADD_ROUTE,
  USERS_EDIT_ROUTE,
  MANAGERS_ROUTE,
  MANAGERS_EDIT_ROUTE,
  HELPER_TABLE_ROUTE,
  HELPER_TABLE_ADDRESS_ROUTE,
  HELPER_TABLE_ADDRESS_EDIT_ROUTE,
  HELPER_TABLE_EVENTTYPE_ROUTE,
  HELPER_TABLE_EVENTTYPE_EDIT_ROUTE,
  HELPER_TABLE_MISSION_ROUTE,
  HELPER_TABLE_MISSION_EDIT_ROUTE,
  HELPER_TABLE_ORGANIZATION_ROUTE,
  HELPER_TABLE_ORGANIZATION_EDIT_ROUTE,
} from "./utils/routerConsts";

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: LoginRegisterPage,
  },
  {
    path: RESET_PASSWORD_MAIL_ROUTE,
    Component: PasswordResetEmailPage,
  },
  {
    path: RESET_PASSWORD_FORM_ROUTE,
    Component: PasswordResetFormPage,
  },
  {
    path: REGISTER_ROUTE,
    Component: LoginRegisterPage,
  },
  {
    path: LANDING_ROUTE,
    Component: LandingPage,
  },
];

export const registeredRoutes = [
  {
    path: DASHBOARD_ROUTE,
    Component: DashboardPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    path: TEST_ROUTE,
    Component: TestPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: SUBSIDIARIES_ROUTE,
    Component: SubsidiaryPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    path: SUBSIDIARY_ITEM_ROUTE,
    Component: SubsidiaryItemPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    path: SUBSIDIARY_EDIT_ROUTE,
    Component: AddEditSubsidiaryPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: SUBSIDIARY_ADD_ROUTE,
    Component: AddEditSubsidiaryPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: EVENT_ROUTE,
    Component: EventPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    path: EVENT_ITEM_ROUTE,
    Component: EventItemPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    path: EVENT_EDIT_ROUTE,
    Component: AddEditEventPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: EVENT_ADD_ROUTE,
    Component: AddEditEventPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: MY_EVENTS_ROUTE,
    Component: MyEventsPage,
    roles: [UserRoles.REGULAR],
  },
  {
    path: MY_PROFILE_ROUTE,
    Component: MyProfilePage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    path: NEWS_ROUTE,
    Component: NewsPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER],
  },
  {
    path: EVENT_NEWS_ITEM_ROUTE,
    Component: NewsItemPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER],
  },
  {
    path: SUBSIDIARY_NEWS_ITEM_ROUTE,
    Component: NewsItemPage,
    roles: [UserRoles.REGULAR, UserRoles.MANAGER],
  },

  {
    path: SUBSIDIARY_NEWS_ADD_ROUTE,
    Component: AddEditNewsPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: SUBSIDIARY_NEWS_EDIT_ROUTE,
    Component: AddEditNewsPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: EVENT_NEWS_ADD_ROUTE,
    Component: AddEditNewsPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: EVENT_NEWS_EDIT_ROUTE,
    Component: AddEditNewsPage,
    roles: [UserRoles.MANAGER],
  },
  {
    path: COMMENT_ADMIN_ROUTE,
    Component: CommentAdminPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: USERS_ROUTE,
    Component: UserPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: USERS_ADD_ROUTE,
    Component: AddEditUserPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: USERS_EDIT_ROUTE,
    Component: AddEditUserPage,
    roles: [UserRoles.ADMIN],
  },

  {
    path: MANAGERS_ROUTE,
    Component: SubsidiaryManagerPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: MANAGERS_EDIT_ROUTE,
    Component: SubsidiaryManagerEditPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: HELPER_TABLE_ROUTE,
    Component: HelperTableSelectPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: HELPER_TABLE_ADDRESS_ROUTE,
    Component: AddressListPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: HELPER_TABLE_ADDRESS_EDIT_ROUTE,
    Component: AddressListEditPage,
    roles: [UserRoles.ADMIN],
  },

  {
    path: HELPER_TABLE_EVENTTYPE_ROUTE,
    Component: EventTypeListPage,
    roles: [UserRoles.ADMIN],
  },

  {
    path: HELPER_TABLE_EVENTTYPE_EDIT_ROUTE,
    Component: EventTypeListEditPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: HELPER_TABLE_MISSION_ROUTE,
    Component: MissionListPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: HELPER_TABLE_MISSION_EDIT_ROUTE,
    Component: MissionListEditPage,
    roles: [UserRoles.ADMIN],
  },

  {
    path: HELPER_TABLE_ORGANIZATION_ROUTE,
    Component: OrganizationListPage,
    roles: [UserRoles.ADMIN],
  },

  {
    path: HELPER_TABLE_ORGANIZATION_EDIT_ROUTE,
    Component: OrganizationListEditPage,
    roles: [UserRoles.ADMIN],
  },
];
