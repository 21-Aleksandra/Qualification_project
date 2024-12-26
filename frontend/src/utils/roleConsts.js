// This file stores all system roles, ensuring code readability and consistency
// across the application by using meaningful role names.
// Please add any new roles here and ensure they align with the backend enum for consistency.
// Ensure consistency with database

const UserRoles = Object.freeze({
  BLOCKED: 0,
  REGULAR: 1,
  MANAGER: 2,
  ADMIN: 3,
});

export default UserRoles;
