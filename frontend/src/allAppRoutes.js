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
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage";
import MyEventsPage from "./pages/MyEventsPage/MyEventsPage";
import AddEditEventPage from "./pages/AddEditEventPage/AddEditEventPage";
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
];
