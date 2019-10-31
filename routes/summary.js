const express = require("express");
const router = express.Router();

const summaryController = require("../controllers/summary");

router.get("/summary", summaryController.getSummary);
router.post("/summary/add", summaryController.addNewScore);
router.get("/ranks", summaryController.getTopFive);

module.exports = router;
