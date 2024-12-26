/* 
  This file is stores all system roles
  for ensuring code readability.

  Please add new roles here and make use
  it matches the similar frontend enum
*/

const Roles = Object.freeze({
  BLOCKED: 0,
  REGULAR: 1,
  MANAGER: 2,
  ADMIN: 3,
});

module.exports = Roles;
