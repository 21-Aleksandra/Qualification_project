const Router = require("express");
const router = new Router();
const addressController = require("../controllers/addressController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get(
  "/list-subsidiary",
  authChecker,
  addressController.getSubsidiaryAddressList
);

router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  addressController.addAddress
);

module.exports = router;
