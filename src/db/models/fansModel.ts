import db from "../connection";
import {
  NewFan,
  NewPassword,
  UpdatedFanFields,
} from "../../helpers/interfaces";
import {
  newFanSchema,
  updatedFanSchema,
  updatedPasswordSchema,
} from "../../helpers/schemas";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const findFanById = (fanId: string) => {
  return db
    .query(
      `SELECT *
        FROM fans f
        WHERE f.fan_id = $1`,
      [fanId]
    )
    .then(({ rows }) => {
      const fan = rows[0];

      if (!fan) {
        return Promise.reject({
          status: 404,
          msg: "This Fan ID does not exist.",
        });
      }

      return fan;
    });
};

export const findFans = () => {
  return db.query(`SELECT * FROM fans`).then(({ rows }) => {
    return rows;
  });
};

export const postFan = (newFan: NewFan) => {
  const { error } = newFanSchema.validate(newFan);

  if (error) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
      details: error.details,
    });
  }

  const { username, password, date_of_birth, address, email, phone_number } =
    newFan;

  const hashPasswordPromise = bcrypt.hash(password, 10);

  return hashPasswordPromise
    .then((hashedPassword: string) => {
      const dbQueryPromise = db.query(
        `INSERT INTO fans (username, password, date_of_birth, address, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [username, hashedPassword, date_of_birth, address, email, phone_number]
      );

      return dbQueryPromise;
    })
    .then(({ rows }: { rows: NewFan[] }) => {
      const newUser = rows[0];
      return newUser;
    });
};

export const removeFan = (fanId: string) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    return db
      .query(`DELETE FROM fans WHERE fan_id = $1 RETURNING *`, [fanId])
      .then(({ rows }) => {
        const fan = rows[0];

        return fan;
      });
  });
};

export const editFan = (fanId: string, updatedFields: UpdatedFanFields) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    const { error } = updatedFanSchema.validate(updatedFields);

    if (error) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
        details: error.details,
      });
    }

    let query = "UPDATE fans SET ";
    const fields = [];
    let i = 1;

    for (const [key, value] of Object.entries(updatedFields)) {
      query += `${key} = $${i}, `;
      fields.push(value);
      i++;
    }

    query = query.slice(0, -2) + ` WHERE fan_id = $${i} RETURNING *`;
    fields.push(fanId);

    return db.query(query, fields).then(({ rows }) => {
      const updatedFan = rows[0];

      return updatedFan;
    });
  });
};

export const editFanPassword = (
  fanId: string,
  updatedPassword: NewPassword
) => {
  return findFanById(fanId).then((fan) => {
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That Fan ID does not exist",
      });
    }

    const { current_password, new_password } = updatedPassword;

    return bcrypt.compare(current_password, fan.password).then((result) => {
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
            `UPDATE fans SET password = $1 WHERE fan_id = $2 RETURNING *`,
            [hashedPassword, fanId]
          )
          .then(({ rows }) => {
            const updatedPassword = rows[0];

            return updatedPassword;
          });
      });
    });
  });
};


export const postLoginFan = (username: string, password: string) => {
  return db.query(`SELECT * FROM fans WHERE username = $1`, [username])
  .then((result) => {
    const fan = result.rows[0];
    if (!fan) {
      return Promise.reject({
        status: 404,
        msg: "That username does not exist",
      });
    }

    return bcrypt.compare(password, fan.password).then((matchResult) => {
      if (!matchResult) {
        return Promise.reject({
          status: 401,
          msg: "Provided password is incorrect.",
        });
      }

      const token = jwt.sign(
        { id: fan.fan_id, username: fan.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      return token;
    })
  })
}