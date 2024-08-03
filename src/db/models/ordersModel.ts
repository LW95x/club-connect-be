import { NewOrder, UpdatedOrderFields } from "../../helpers/interfaces";
import { newOrderSchema, updatedOrderSchema } from "../../helpers/schemas";
import db from "../connection";
import { findEventById } from "./eventsModel";
import { findFanById } from "./fansModel";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const calendar = google.calendar("v3");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const findAllOrders = (fanId: string) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    return db
      .query(`SELECT * FROM orders o WHERE o.user_id = $1`, [fanId])
      .then(({ rows }) => {
        return rows;
      });
  });
};

export const findOrderById = (fanId: string, orderId: string) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    return db
      .query(
        `SELECT * FROM ORDERS o WHERE o.user_id = $1 AND o.order_id = $2`,
        [fanId, orderId]
      )
      .then(({ rows }) => {
        const order = rows[0];

        if (!order) {
          return Promise.reject({
            status: 404,
            msg: "This Order ID does not exist.",
          });
        }

        return order;
      });
  });
};

export const addOrder = (fanId: string, newOrder: NewOrder, token: string) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    return findEventById(newOrder.event_id).then((event) => {
      if (!event) {
        return Promise.reject({
          status: 404,
          msg: "That Event ID does not exist",
        });
      }

      const { error } = newOrderSchema.validate(newOrder);

      if (error) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
          details: error.details,
        });
      }

      const { event_id, order_date, quantity, total_price, order_status, add_to_calendar } =
        newOrder;

      return db
        .query(
          `INSERT INTO orders (user_id, event_id, order_date, quantity, total_price, order_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
          [fanId, event_id, order_date, quantity, total_price, order_status]
        )
        .then(({ rows }) => {
          const newOrder = rows[0];

          if (add_to_calendar) {
            const eventDetails = {
              summary: event.title,
              location: event.location,
              description: event.description,
              start: {
                dateTime: new Date(event.date_time).toISOString(),
                timeZone: "Europe/London",
              },
              end: {
                dateTime: new Date(
                  new Date(event.date_time).getTime() + 10800000
                ).toISOString(),
                timeZone: "Europe/London",
              },
            };

            const authClient = new google.auth.OAuth2();
            authClient.setCredentials({ access_token: token });

            return calendar.events
              .insert({
                auth: authClient,
                calendarId: "primary",
                requestBody: eventDetails,
              })
              .then(() => {
                return newOrder;
              });
          }

          return newOrder;
        });
    });
  });
};

export const removeOrder = (fanId: string, orderId: string) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    return findOrderById(fanId, orderId).then((order) => {
      if (!order) {
        return Promise.reject({
          status: 404,
          msg: "That Order ID does not exist",
        });
      }

      return db
        .query(`DELETE FROM orders WHERE order_id = $1 RETURNING *`, [orderId])
        .then(({ rows }) => {
          const order = rows[0];

          return order;
        });
    });
  });
};

export const editOrder = (
  fanId: string,
  orderId: string,
  updatedFields: UpdatedOrderFields
) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    return findOrderById(fanId, orderId).then((order) => {
      if (!order) {
        return Promise.reject({
          status: 404,
          msg: "That Order ID does not exist",
        });
      }

      const { error } = updatedOrderSchema.validate(updatedFields);

      if (error) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
          details: error.details,
        });
      }

      let query = "UPDATE orders SET ";
      const fields = [];
      let i = 1;

      for (const [key, value] of Object.entries(updatedFields)) {
        query += `${key} = $${i}, `;
        fields.push(value);
        i++;
      }

      query = query.slice(0, -2) + ` WHERE order_id = $${i} RETURNING *`;
      fields.push(orderId);

      return db.query(query, fields).then(({ rows }) => {
        const updatedOrder = rows[0];

        return updatedOrder;
      });
    });
  });
};
