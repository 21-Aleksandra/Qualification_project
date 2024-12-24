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

router.get("/list-event", authChecker, addressController.getEventAddressList);

router.get(
  "/list-all",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  addressController.getAllAddressList
);

router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  addressController.addAddress
);

router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.ADMIN]),
  addressController.editAddress
);

router.get(
  "/:id/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  addressController.getOneAddress
);

module.exports = router;
