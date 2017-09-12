"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var proSchema = new Schema({
    image: { type: String, required: true },
    dis: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true }
});
module.exports = mongoose.model("Product", proSchema);