import UserRoles from "./roleConsts";
import { SUBSIDIARIES_ROUTE } from "../utils/routerConsts";

const navigationLinks = [
  {
    name: "Subsidiaries",
    link: SUBSIDIARIES_ROUTE,
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    name: "Events",
    link: "/events",
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
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
