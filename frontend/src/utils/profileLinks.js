// This file defines the profile-related dropdown navigation links, including their names, URLs,
// and the roles that are allowed to access each link. These links are used to render
// profile-specific dropdown navigation options with role-based access control.

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
