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

module.exports = (app) => {
  app.post(
    "/api/product/create",
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
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, updateProduct)
  );

  app.delete(
    "/api/product/:productId",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, deleteProduct)
  );
};
