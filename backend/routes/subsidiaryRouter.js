const Router = require("express");
const router = new Router();
const subsidiaryController = require("../controllers/subsidiaryController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");
const multer = require("multer");
const upload = multer();

router.get(
  "/list",
  authChecker,
  subsidiaryController.getSubsidiaryFilteredList
);
router.get("/:id", authChecker, subsidiaryController.getSubsidiaryById);

router.get(
  "/get/names",
  authChecker,
  subsidiaryController.getSubsidiaryNamesList
);

router.post(
  "/add",
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),
  authChecker,
  roleChecker([Roles.MANAGER]),
  subsidiaryController.addSubsidiary
);
router.put(
  "/:id/edit",
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),
  authChecker,
  roleChecker([Roles.MANAGER]),
  subsidiaryController.editSubsidiary
);
router.delete(
  "/delete",
  authChecker,
  roleChecker([Roles.MANAGER]),
  subsidiaryController.deleteSubsidiaries
);
router.put(
  "/:id/change-managers",
  authChecker,
  roleChecker([Roles.ADMIN]),
  subsidiaryController.changeManagers
);

module.exports = router;
