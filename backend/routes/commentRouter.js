const Router = require("express");
const router = new Router();
const commentController = require("../controllers/commentController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get(
  "/event-comments/:id/get",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.REGULAR]),
  commentController.getEventComments
);
router.post(
  "/event-comments/:id/add",
  authChecker,
  roleChecker([Roles.REGULAR]),
  commentController.addEventComment
);

router.get(
  "/news-comments/:id/get",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.REGULAR]),
  commentController.getNewsComments
);
router.post(
  "/news-comments/:id/add",
  authChecker,
  roleChecker([Roles.REGULAR]),
  commentController.addNewsComment
);

router.get(
  "/subsidiary-comments/:id/get",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.REGULAR]),
  commentController.getSubsidiaryComments
);
router.post(
  "/subsidiary-comments/:id/add",
  authChecker,
  roleChecker([Roles.REGULAR]),
  commentController.addSubsidiaryComment
);

router.get(
  "/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  commentController.getAllComments
);
router.delete(
  "/delete",
  authChecker,
  roleChecker([Roles.ADMIN]),
  commentController.deleteComments
);

module.exports = router;
