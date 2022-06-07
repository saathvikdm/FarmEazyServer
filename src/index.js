import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors";
import models from "./models";
import bcrypt from "bcryptjs";

import db from "./models";
const User = db.User;
const UserType = db.UserType;

const app = express();

app.use(bodyParser.json());

let port = process.env.PORT || 8080;

// set the view engine to ejs
app.set("view engine", "ejs");

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + "/public"));

app.use(
  cors({
    origin: "*", // <-- location of the react app we're connecting to
    credentials: true,
  })
);

// force: true will drop the table if it already exits
// models.sequelize.sync({ force: true }).then(() => {
models.sequelize.sync().then(() => {
  console.log("Drop and Resync with {force: true}");
});

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

//default route
app.get("/", async (req, res) => {
  const userType_count = await UserType.count();
  const user_count = await User.count();

  if (userType_count === 0) {
    UserType.create({ name: "Farmer", accessLevel: 2, role: 3 });
    UserType.create({ name: "User", accessLevel: 2, role: 2 });
    UserType.create({ name: "Renter", accessLevel: 2, role: 4 });
    UserType.create({ name: "Admin", accessLevel: 4, role: 1 });
    UserType.create({ name: "Manufacturer", accessLevel: 2, role: 5 });
  }

  if (user_count === 0) {
    let newUser = {
      firstname: "Admin",
      lastname: "A",
      email: "admin@gmail.com",
      password: "password",
      address: "#123, KR Puram, Mysuru",
      city: "Mysuru",
      UserTypeId: 4,
    };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        User.create(newUser)
          .then((user) => {
            console.log("Default User Created");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  }

  res.send("Hello FarmEazy API");
});

require("./routes/user.js")(app);
require("./routes/product.js")(app);
require("./routes/order.js")(app);

//create a server
var server = app.listen(port, async function () {
  var host = server.address().address;
  var port = server.address().port;

  await models.sequelize.authenticate();
  console.log("Database Authenticated");

  console.log("App listening at http://%s:%s", host, port);
});
