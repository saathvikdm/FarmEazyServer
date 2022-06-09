import passport from "passport";
import config from "../config/config";
import { allowOnly } from "../services/routesHelper";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  updateProduct,
} from "../controllers/product";

const path = require("path");
import multer from "multer";

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

  app.post(
    "/api/product/create",
    upload.single("image"),
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, createProduct)
  );

  app.get("/api/product", findAllProducts);

  app.get(
    "/api/product/:productId",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, findProductById)
  );

  app.put(
    "/api/product/:productId",
    upload.single("image"),
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, updateProduct)
  );

  app.delete(
    "/api/product/:productId",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, deleteProduct)
  );
};
