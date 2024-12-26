const Router = require("express");
const router = new Router();
const newsController = require("../controllers/newsController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

// gets all news related to subsidiaries
router.get(
  "/subsidiary-news/get",
  authChecker,
  newsController.getSubsidiaryNews
);

// gets all news related to events
router.get("/event-news/get", authChecker, newsController.getEventNews);

// gets one news object related to subsidiaries by newsId
router.get(
  "/subsidiary-news/:id/get",
  authChecker,
  newsController.getOneSubsidiaryNews
);

// gets one news object related to event by newsId
router.get("/event-news/:id/get", authChecker, newsController.getOneEventNews);

//Route to get the top 5 news by creation date
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
  "/subsidiary-news/:id/edit", // id is subsidiary id here to get news set
  authChecker,
  roleChecker([Roles.MANAGER]),
  newsController.editSubsidiaryNews
);
router.put(
  "/event-news/:id/edit", // id is event id here to get news set
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
