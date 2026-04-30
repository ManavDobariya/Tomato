const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Tomato:KyabPkPW3jdjwzP6@cluster0.9lt06zs.mongodb.net/food-del")
        .then(() => {
            console.log('MongoDB Connected');
        });
}

module.exports = connectDB;
