"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var alertSchema = new mongoose_1.Schema({
    user_email: String,
    made_by: String,
    title: String,
    type: String,
    description: String,
    position: { lat: Number, lng: Number }
});
exports.default = (0, mongoose_1.model)("Alert", alertSchema);
