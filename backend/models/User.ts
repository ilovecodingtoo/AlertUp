import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true },
  nickname: String,
  salt: String,
  digest: String,
  saved_locations: [{ position: { lat: Number, lng: Number }, label: String }],
  fcm_token: String
});

export default model("User", userSchema);