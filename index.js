const express = require("express");
require("dotenv").config();
const http = require("http");
const PORT = process.env.PORT;
const app = express();
const cors = require("cors");
const routeUser = require("./src/router/routeUser");
const bodyParser = require("body-parser").json();
const io = require("./src/helper/socket");

// Static Routing
app.use("/profile-img", express.static("public/images/profile_user/"));
app.use("/group-img", express.static("public/images/group_profile/"));
app.use("/attachment", express.static("public/attachment/"));

app.use(cors({ origin: true }));
app.use(bodyParser);
app.use(routeUser);
const server = http.createServer(app);
io(server);

server.listen(PORT, () => {
  console.log("server running on " + PORT);
});
