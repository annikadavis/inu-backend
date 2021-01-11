import App from './app';
import UsersController from './controllers/users.controller';

const app = new App(
  [
    new UsersController(),
  ],
  8088,
);

app.listen();

// // require("dotenv").config();
// import express from "express";

// import https from 'https';
// import mysql from 'mysql';
// import mail from "@sendgrid/mail";
// import { nanoid } from "nanoid"; // generates random unique strings
// import { hostname } from "os";

// we set the API KEY here.
// it's a free account from https://www.sendgrid.com/
// it can only send 100 emails per day.
// mail.setApiKey(process.env.SENDGRID_API_KEY);
// const PORT = process.env.PORT;

// async function startServer() {

//   const db = await mysql.createConnection({
//     host: process.env.DB_HOST, // address of the server
//     user: process.env.DB_USER, // username
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });

  // const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  //   host: dbConfig.HOST,
  //   dialect: dbConfig.dialect,
  //   operatorsAliases: false,
  //   pool: {
  //     max: dbConfig.pool.max,
  //     min: dbConfig.pool.min,
  //     acquire: dbConfig.pool.acquire,
  //     idle: dbConfig.pool.idle
  //   }
  // });

  // Migrations allow for you to define sets of schema changes so upgrading a database is a breeze.
  // Schema here refers to database Schema.
  // Upgrading a database can mean anything ranging from changing a column
  // or adding a new column or adding a new table.
  // The point is that database can change,
  // and for everyone to have the same changes on their computers
  // (remember you are cooperating with others), you have to make database changes that you did
  // happen automatically on all computers.
  // For further information: http://knexjs.org/#Migrations

  // The record (which one was run, which one was not run) for these migrations are kept in the database.
  // Table names used by default to keep record are knex_migrations and knex_migrations_lock.
  // (async () => {
  //   await db.execute(`
  //     CREATE TABLE IF NOT EXISTS users(
  //       id INT AUTO_INCREMENT PRIMARY KEY,
  //       name VARCHAR(30) NOT NULL,
  //       email VARCHAR(100) NOT NULL,
  //       password VARCHAR(100) NOT NULL,
  //       reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  //       CONSTRAINT email_unique UNIQUE (email)
  //     );
  //   `);

  //   // NEW table for keeping track of the password reset requests
  //   await db.execute(`
  //   CREATE TABLE IF NOT EXISTS password_reset(
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     email VARCHAR(100) NOT NULL,
  //     reset_token VARCHAR(100) NOT NULL,
  //     CONSTRAINT email_unique UNIQUE (email)
  //   );
  // `);

    // runs migrations down (undoes the change as specified in the migration)
    // THIS MEANS ALL DATA GETS DELETED EVERY TIME THE APP RESTARTS!!!!
    // await db.migrate.down(); // DISABLE THIS LINE TO AVOID DELETION OF DATA

    // Runs migrations up (do the change as specified in the migration)
    // await db.migrate.latest();
  // })();
// }

// startServer(); // The reason why we had to put the whole server creation into a function and execute that function is:
// because of this line:

// the new mysql createConnection HAS TO BE AWAITED. for it to finish. But we cannot await in the very top level.
// because you can ONLY AWAIT in async functions.
// so, we make an async function and put everything in it, and it works.
