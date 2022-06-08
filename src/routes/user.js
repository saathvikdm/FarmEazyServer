import multer from "multer";
import passport from "passport";
import config from "../config/config";
import { allowOnly } from "../services/routesHelper";
import {
  create,
  login,
  findAllUsers,
  findById,
  update,
  deleteUser,
} from "../controllers/user";

const path = require("path");

module.exports = (app) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/public/images");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  let upload = multer({ storage: storage });

  // create a new user
  app.post(
    "/api/users/create",
    upload.single("user_image"),
    // passport.authenticate("jwt", { session: false }),
    // allowOnly(config.accessLevels.admin, create)
    create
  );

  // user login
  app.post("/api/users/login", login);

  //retrieve all users
  app.get(
    "/api/users",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.admin, findAllUsers)
    // findAllUsers
  );

  // retrieve user by id
  app.get(
    "/api/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.user, findById)
    // findById
  );

  // update a user with id
  app.put(
    "/api/users/:userId",
    upload.single("user_image"),
    passport.authenticate("jwt", {
      session: false,
    }),
    allowOnly(config.accessLevels.user, update)
    // update
  );

  // delete a user
  app.delete(
    "/api/users/:userId",
    passport.authenticate("jwt", {
      session: false,
    }),
    // deleteUser
    allowOnly(config.accessLevels.admin, deleteUser)
  );
};
