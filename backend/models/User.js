"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    email: { type: String, unique: true },
    nickname: String,
    salt: String,
    digest: String,
    saved_locations: [{ position: { lat: Number, lng: Number }, label: String }],
    fcm_token: String
});
exports.default = (0, mongoose_1.model)("User", userSchema);
