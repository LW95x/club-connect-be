import { NewEvent, UpdatedEventFields } from "../../helpers/interfaces";
import { newEventSchema, updatedEventSchema } from "../../helpers/schemas";
import db from "../connection";
import { findClubById } from "./clubsModel";

export const findEventById = (eventId: string) => {
  return db
    .query(`SELECT * FROM events e WHERE e.event_id = $1`, [eventId])
    .then(({ rows }) => {
      const event = rows[0];

      if (!event) {
        return Promise.reject({
          status: 404,
          msg: "This Event ID does not exist.",
        });
      }

      return event;
    });
};

export const findEvents = () => {
  return db.query(`SELECT * FROM events`).then(({ rows }) => {
    return rows;
  });
};

export const findEventsByClubId = (clubId: string) => {
  return db
    .query(`SELECT * FROM events e WHERE e.home_club_id = $1`, [clubId])
    .then(({ rows }) => {
      const clubEvents = rows[0];

      if (!clubEvents) {
        return Promise.reject({
          status: 404,
          msg: "This Club ID does not exist.",
        });
      }

      return clubEvents;
    });
};

export const addEvent = (clubId: string, newEvent: NewEvent) => {
  return findClubById(clubId).then((club) => {
    if (!club) {
      return Promise.reject({
        status: 404,
        msg: "That Club ID does not exist",
      });
    }

    const { error } = newEventSchema.validate(newEvent);

    if (error) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
        details: error.details,
      });
    }

    const {
      title,
      location,
      price,
      date_time,
      description,
      available_tickets,
    } = newEvent;

    return db
      .query(
        `INSERT INTO events (home_club_id, title, location, price, date_time, description, available_tickets) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [
          clubId,
          title,
          location,
          price,
          date_time,
          description,
          available_tickets,
        ]
      )
      .then(({ rows }) => {
        const newEvent = rows[0];
        return newEvent;
      });
  });
};

export const removeEvent = (clubId: string, eventId: string) => {
  return findClubById(clubId).then((club) => {
    if (!club) {
      return Promise.reject({
        status: 404,
        msg: "That Club ID does not exist",
      });
    }

    return findEventById(eventId).then((event) => {
      if (!event) {
        return Promise.reject({
          status: 404,
          msg: "That Event ID does not exist",
        });
      }

      return db
        .query(`DELETE FROM events WHERE event_id = $1 RETURNING *`, [eventId])
        .then(({ rows }) => {
          const event = rows[0];

          return event;
        });
    });
  });
};


export const editEvent = (clubId: string, eventId: string, updatedFields: UpdatedEventFields) => {
  return findClubById(clubId).then((club) => {
    if (!club) {
      return Promise.reject({
        status: 404,
        msg: "That Club ID does not exist",
      });
    }

    return findEventById(eventId).then((event) => {
      if (!event) {
        return Promise.reject({
          status: 404,
          msg: "That Event ID does not exist",
        });
      }

      const { error } = updatedEventSchema.validate(updatedFields);

      if (error) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
          details: error.details,
        });
      }

      let query = "UPDATE events SET ";
      const fields = [];
      let i = 1;

      for (const [key, value] of Object.entries(updatedFields)) {
        query += `${key} = $${i}, `;
        fields.push(value);
        i++;
      }

      query = query.slice(0, -2) + ` WHERE event_id = $${i} RETURNING *`;
      fields.push(eventId);

      return db.query(query, fields).then(({ rows }) => {
        const updatedEvent = rows[0];
  
        return updatedEvent;
      });


    })
  })
}