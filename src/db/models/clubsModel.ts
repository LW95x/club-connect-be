import {
  NewClub,
  NewPassword,
  UpdatedClubFields,
} from "../../helpers/interfaces";
import {
  newClubSchema,
  updatedClubSchema,
  updatedPasswordSchema,
} from "../../helpers/schemas";
import db from "../connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const findClubById = (clubId: string) => {
  return db
    .query(
      `SELECT
        c.club_id,
        c.username,
        c.password,
        c.club_name,
        c.league,
        c.location,
        c.stadium_capacity,
        c.email,
        c.phone_number,
        c.website,
        c.facebook,
        c.twitter
        FROM clubs c
        WHERE c.club_id = $1`,
      [clubId]
    )
    .then(({ rows }) => {
      const club = rows[0];

      if (!club) {
        return Promise.reject({
          status: 404,
          msg: "This Club ID does not exist.",
        });
      }

      return club;
    });
};

export const findClubs = () => {
  return db.query(`SELECT * FROM clubs`).then(({ rows }) => {
    return rows;
  });
};

export const postClub = (newClub: NewClub) => {
  const { error } = newClubSchema.validate(newClub);

  if (error) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
      details: error.details,
    });
  }

  const {
    username,
    password,
    club_name,
    league,
    location,
    stadium_capacity,
    email,
    phone_number,
    website = "",
    facebook = "",
    twitter = "",
  } = newClub;

  const hashPasswordPromise = bcrypt.hash(password, 10);

  return hashPasswordPromise
    .then((hashedPassword: string) => {
      const dbQueryPromise = db.query(
        `INSERT INTO clubs (username, password, club_name, league, location, stadium_capacity, email, phone_number, website, facebook, twitter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`,
        [
          username,
          hashedPassword,
          club_name,
          league,
          location,
          stadium_capacity,
          email,
          phone_number,
          website,
          facebook,
          twitter,
        ]
      );

      return dbQueryPromise;
    })
    .then(({ rows }: { rows: NewClub[] }) => {
      const newClub = rows[0];
      return newClub;
    });
};

export const removeClub = (clubId: string) => {
  return findClubById(clubId).then((club) => {
    if (!club) {
      return Promise.reject({
        status: 404,
        msg: "That Club ID does not exist",
      });
    }

    return db
      .query(`DELETE FROM clubs WHERE club_id = $1 RETURNING *`, [clubId])
      .then(({ rows }) => {
        const club = rows[0];

        return club;
      });
  });
};

export const editClub = (clubId: string, updatedFields: UpdatedClubFields) => {
  return findClubById(clubId).then((club) => {
    if (!club) {
      return Promise.reject({
        status: 404,
        msg: "That Club ID does not exist",
      });
    }

    const { error } = updatedClubSchema.validate(updatedFields);

    if (error) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
        details: error.details,
      });
    }

    let query = "UPDATE clubs SET ";
    const fields = [];
    let i = 1;

    for (const [key, value] of Object.entries(updatedFields)) {
      query += `${key} = $${i}, `;
      fields.push(value);
      i++;
    }

    query = query.slice(0, -2) + ` WHERE club_id = $${i} RETURNING *`;
    fields.push(clubId);

    return db.query(query, fields).then(({ rows }) => {
      const updatedClub = rows[0];

      return updatedClub;
    });
  });
};

export const editClubPassword = (
  clubId: string,
  updatedPassword: NewPassword
) => {
  return findClubById(clubId).then((club) => {
    if (!club) {
      return Promise.reject({
        status: 404,
        msg: "That Club ID does not exist",
      });
    }

    const { current_password, new_password } = updatedPassword;

    return bcrypt.compare(current_password, club.password).then((result) => {
      if (!result) {
        return Promise.reject({
          status: 401,
          msg: "Provided current password is incorrect.",
        });
      }

      const { error } = updatedPasswordSchema.validate({
        password: new_password,
      });

      if (error) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
          details: error.details,
        });
      }

      return bcrypt.hash(new_password, 10).then((hashedPassword: string) => {
        return db
          .query(
            `UPDATE clubs SET password = $1 WHERE club_id = $2 RETURNING *`,
            [hashedPassword, clubId]
          )
          .then(({ rows }) => {
            const updatedPassword = rows[0];

            return updatedPassword;
          });
      });
    });
  });
};

export const postLoginClub = (username: string, password: string) => {
  return db
    .query(`SELECT * FROM clubs WHERE username = $1`, [username])
    .then((result) => {
      const club = result.rows[0];
      if (!club) {
        return Promise.reject({
          status: 404,
          msg: "That username does not exist",
        });
      }

      return bcrypt.compare(password, club.password).then((matchResult) => {
        if (!matchResult) {
          return Promise.reject({
            status: 401,
            msg: "Provided password is incorrect.",
          });
        }

        const token = jwt.sign(
          { id: club.club_id, username: club.username },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        return token;
      });
    });
};
