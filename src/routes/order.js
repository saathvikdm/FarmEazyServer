import passport from "passport";
import config from "../config/config";
import { allowOnly } from "../services/routesHelper";
import {
  createOrder,
  deleteOrder,
  findAllOrders,
  findOrderById,
  updateOrder,
} from "../controllers/order";

module.exports = (app) => {
  app.post(
    "/api/order/create",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, createOrder)
  );

  app.get("/api/order", findAllOrders);

  app.get(
    "/api/order/:orderId",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, findOrderById)
  );

  app.put(
    "/api/order/:orderId",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, updateOrder)
  );

  app.delete(
    "/api/order/:orderId",
    passport.authenticate("jwt", { session: false }),
    allowOnly(config.accessLevels.user, deleteOrder)
  );
};
