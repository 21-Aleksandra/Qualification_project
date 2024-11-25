const Router = require("express");
const router = new Router();
const subsidiaryController = require("../controllers/subsidiaryController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get(
  "/list",
  authChecker,
  subsidiaryController.getSubsidiaryFilteredList
);
router.get("/:id", authChecker, subsidiaryController.getSubsidiaryById);

router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  subsidiaryController.addSubsidiary
);
router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  subsidiaryController.editSubsidiary
);
router.delete(
  "/delete",
  authChecker,
  roleChecker([Roles.ADMIN]),
  subsidiaryController.deleteSubsidiaries
);

module.exports = router;
