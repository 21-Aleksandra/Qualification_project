const Router = require("express");
const router = new Router();
const authRouter = require("./authRouter");
const addressRouter = require("./addressRouter");
const mainOrganizationRouter = require("./mainOrganizationRouter");
const missionRouter = require("./missionRouter");
const subsidiaryRouter = require("./subsidiaryRouter");
const eventRouter = require("./eventRouter");
const eventTypeRouter = require("./eventTypeRouter");
const eventUserRouter = require("./eventUserRouter");
const statisticsRouter = require("./statisticsRouter");

router.use("/auth", authRouter);
router.use("/address", addressRouter);
router.use("/main-organization", mainOrganizationRouter);
router.use("/mission", missionRouter);
router.use("/subsidiary", subsidiaryRouter);
router.use("/event", eventRouter);
router.use("/event-type", eventTypeRouter);
router.use("/event-user", eventUserRouter);
router.use("/statistics", statisticsRouter);
module.exports = router;
