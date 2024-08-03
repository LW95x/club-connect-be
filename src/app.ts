import express from "express";
import cors from "cors";
import {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} from "./db/errors";
import {
  deleteFan,
  getFanById,
  getFans,
  loginFan,
  patchFan,
  patchFanPassword,
  registerFan,
} from "./db/controllers/fansController";
import {
  deleteClub,
  getClubById,
  getClubs,
  loginClub,
  patchClub,
  patchClubPassword,
  registerClub,
} from "./db/controllers/clubsController";
import {
  deleteEvent,
  getEventById,
  getEvents,
  getEventsByClubId,
  patchEvent,
  postEvent,
} from "./db/controllers/eventsController";
import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  patchOrder,
  postOrder,
} from "./db/controllers/ordersController";
import { getApi } from "./db/controllers/apiController";
import { authFlow, handleCallback } from "./db/controllers/authController";

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/fans/:fanId", getFanById);

app.get("/api/fans", getFans);

app.get("/api/clubs/:clubId", getClubById);

app.get("/api/clubs", getClubs);

app.get("/api/events/:eventId", getEventById);

app.get("/api/events", getEvents);

app.get("/api/clubs/:clubId/events", getEventsByClubId);

app.get("/api/fans/:fanId/orders/:orderId", getOrderById);

app.get("/api/fans/:fanId/orders", getAllOrders);

app.post("/api/fans/register", registerFan);

app.delete("/api/fans/:fanId", deleteFan);

app.post("/api/clubs/register", registerClub);

app.delete("/api/clubs/:clubId", deleteClub);

app.post("/api/clubs/:clubId/events", postEvent);

app.delete("/api/clubs/:clubId/events/:eventId", deleteEvent);

app.post("/api/fans/:fanId/orders", postOrder);

app.delete("/api/fans/:fanId/orders/:orderId", deleteOrder);

app.patch("/api/fans/:fanId", patchFan);

app.patch("/api/fans/:fanId/change-password", patchFanPassword);

app.patch("/api/clubs/:clubId", patchClub);

app.patch("/api/clubs/:clubId/change-password", patchClubPassword);

app.patch("/api/clubs/:clubId/events/:eventId", patchEvent);

app.patch("/api/fans/:fanId/orders/:orderId", patchOrder);

app.post("/api/fans/login", loginFan);

app.post("/api/clubs/login", loginClub);

app.get("/api/auth", authFlow);

app.get("/api/callback", handleCallback);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}

export default app;
