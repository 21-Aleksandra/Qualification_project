const Router = require("express");
const router = new Router();
const authRouter = require("./authRouter");
const addressRouter = require("./addressRouter");
const mainOrganizationRouter = require("./mainOrganizationRouter");
const missionRouter = require("./missionRouter");
const subsidiaryRouter = require("./subsidiaryRouter");

router.use("/auth", authRouter);
router.use("/address", addressRouter);
router.use("/main-organization", mainOrganizationRouter);
router.use("/mission", missionRouter);
router.use("/subsidiary", subsidiaryRouter);
module.exports = router;
