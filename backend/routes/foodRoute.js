const express = require("express");
const { addFood, listFood, removeFood } = require("../controllers/foodController.js");
const multer = require("multer");

const foodRouter = express.Router();


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

module.exports = foodRouter;