const express = require("express");
const Router = express.Router();
const { authentication } = require("../helper/middleware/auth");
const { singleUpload } = require("../helper/middleware/addProfile");
const {
  login,
  register,
  getUserData,
  setProfile,
  setName,
  getUser,
  setLocation,
  addRooms,
} = require("../controller/user");
Router.post("/login", login)
  .post("/register", register)
  .post("/user", authentication, getUserData)
  .post("/setProfile", authentication, singleUpload, setProfile)
  .post("/changeName", authentication, setName)
  .post("/setLocation", authentication, setLocation)
  .get("/find", authentication, getUser)
  .post("/addRoom", authentication, addRooms);
module.exports = Router;
