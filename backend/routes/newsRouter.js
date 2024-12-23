const Router = require("express");
const router = new Router();
const newsController = require("../controllers/newsController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get(
  "/subsidiary-news/get",
  authChecker,
  newsController.getSubsidiaryNews
);
router.get("/event-news/get", authChecker, newsController.getEventNews);

router.get(
  "/subsidiary-news/:id/get",
  authChecker,
  newsController.getOneSubsidiaryNews
);
router.get("/event-news/:id/get", authChecker, newsController.getOneEventNews);

router.get("/top-5/get", authChecker, newsController.getTopFiveNews);

router.post(
  "/subsidiary-news/add",
  authChecker,
  roleChecker([Roles.MANAGER]),
  newsController.addSubsidiaryNews
);
router.post(
  "/event-news/add",
  authChecker,
  roleChecker([Roles.MANAGER]),
  newsController.addEventNews
);

router.put(
  "/subsidiary-news/:id/edit",
  authChecker,
  roleChecker([Roles.MANAGER]),
  newsController.editSubsidiaryNews
);
router.put(
  "/event-news/:id/edit",
  authChecker,
  roleChecker([Roles.MANAGER]),
  newsController.editEventNews
);

router.delete(
  "/delete",
  authChecker,
  roleChecker([Roles.MANAGER]),
  newsController.deleteNews
);

module.exports = router;
