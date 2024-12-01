import LandingPage from "./pages/LandingPage/LandingPage";
import LoginRegisterPage from "./pages/LoginRegisterPage/LoginRegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import PasswordResetEmailPage from "./pages/PasswordResetEmailPage/PasswordResetEmailPage";
import PasswordResetFormPage from "./pages/PasswordResetFormPage/PasswordResetFormPage";
import SubsidiaryPage from "./pages/SubsidiaryPage/SubsidiaryPage";
import SubsidiaryItemPage from "./pages/SubsidiaryItemPage/SubsidiaryItemPage";
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
];
