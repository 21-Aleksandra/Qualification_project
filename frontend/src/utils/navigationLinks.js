import UserRoles from "./roleConsts";
import {
  SUBSIDIARIES_ROUTE,
  EVENT_ROUTE,
  NEWS_ROUTE,
  COMMENT_ADMIN_ROUTE,
  USERS_ROUTE,
  MANAGERS_ROUTE,
} from "../utils/routerConsts";

const navigationLinks = [
  {
    name: "Subsidiaries",
    link: SUBSIDIARIES_ROUTE,
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER],
  },
  {
    name: "Events",
    link: EVENT_ROUTE,
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER],
  },
  {
    name: "News",
    link: NEWS_ROUTE,
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER],
  },
  {
    name: "Users",
    link: USERS_ROUTE,
    allowedRoles: [UserRoles.ADMIN],
  },
  {
    name: "Comments",
    link: COMMENT_ADMIN_ROUTE,
    allowedRoles: [UserRoles.ADMIN],
  },
  {
    name: "Manager assignment",
    link: MANAGERS_ROUTE,
    allowedRoles: [UserRoles.ADMIN],
  },
];

export default navigationLinks;
