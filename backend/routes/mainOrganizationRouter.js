const Router = require("express");
const router = new Router();
const mainOrganizationController = require("../controllers/mainOrganizationController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get(
  "/list",
  authChecker,
  mainOrganizationController.getMainOrganizationList
);
router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  mainOrganizationController.addMainOrganization
);

router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.ADMIN]),
  mainOrganizationController.editMainOrganization
);

router.get(
  "/:id/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  mainOrganizationController.getOneMainOrganization
);

module.exports = router;
