const foodModel = require("../models/foodModel.js");
const fs = require("fs");

const addFood = async (req, res) => {
  const { name, description, price, category } = req.body;

  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name,
    description,
    price,
    category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({
      success: true,
      message: "Food Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id)
    res.json({
        success:true,
        message:"Food Removed Successfully"
    })
  } catch (error) {
    console.log(error);
    res.json({
        success:false,
        message:error.message
    })
  }
};

module.exports = { addFood, listFood, removeFood };
