import UserRoles from "./roleConsts";

const profileLinks = [
  {
    name: "My Profile",
    link: "/profile",
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    name: "Account Settings",
    link: "/settings",
    allowedRoles: [UserRoles.REGULAR, UserRoles.MANAGER, UserRoles.ADMIN],
  },
  {
    name: "User Management",
    link: "/user-management",
    allowedRoles: [UserRoles.ADMIN],
  },
];

export default profileLinks;
