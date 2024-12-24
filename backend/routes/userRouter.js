const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get(
  "/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  userController.getAllUsers
);

router.get(
  "/:id/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  userController.getUserById
);

router.post(
  "/add",
  authChecker,
  roleChecker([Roles.ADMIN]),
  userController.addUser
);
router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.ADMIN]),
  userController.editUser
);
router.delete(
  "/delete",
  authChecker,
  roleChecker([Roles.ADMIN]),
  userController.deleteUsers
);

module.exports = router;
