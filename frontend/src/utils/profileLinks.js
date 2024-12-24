import UserRoles from "./roleConsts";
import { MY_EVENTS_ROUTE, MY_PROFILE_ROUTE } from "./routerConsts";
const profileLinks = [
  {
    name: "My Profile",
    link: MY_PROFILE_ROUTE,
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    name: "My events",
    link: MY_EVENTS_ROUTE,
    allowedRoles: [UserRoles.REGULAR],
  },
];

export default profileLinks;
