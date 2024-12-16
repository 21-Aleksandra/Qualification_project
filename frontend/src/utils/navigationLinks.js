import UserRoles from "./roleConsts";
import { SUBSIDIARIES_ROUTE, EVENT_ROUTE } from "../utils/routerConsts";

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
    name: "Organisations",
    link: "/organisations",
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    name: "Admin Panel",
    link: "/admin",
    allowedRoles: [UserRoles.ADMIN],
  },
  {
    name: "My organisations",
    link: "/my-organisations",
    allowedRoles: [UserRoles.MANAGER],
  },
];

export default navigationLinks;
