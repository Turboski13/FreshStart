// Clear and repopulate the database.
require("dotenv").config();
const client = require('../client/client.cjs');
const bcrypt = require('bcrypt');


const seed = async () => {
  console.log("Seeding the database.");
  const createTables = async () => {
      
      // Clear the database.
      await client.query("DROP TABLE IF EXISTS student, instructor;"); 
      console.log("Tables dropped.");
      
      // Recreate the tables
      await client.query(`
        CREATE TABLE instructor (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
            );
            CREATE TABLE student (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                cohort TEXT NOT NULL,
                instructorId INTEGER NOT NULL REFERENCES instructor(id) ON DELETE CASCADE
                );
                
                `);
        console.log("Tables created.");        
    }

    const createInstructor = async(username, password)=> {
        const encryptedPassword = await bcrypt.hash(password, 5);
        const result = await client.query(`
            INSERT INTO instructor (username, password)
            VALUES ($1, $2)
            RETURNING *;
            `, [username, encryptedPassword]);

        console.log("Instructors created.");
        return result.rows[0];
      }

      const createStudent = async(name, cohort, instructorId)=> {
        const result = await client.query(`
            INSERT INTO student (name, cohort, instructorId)
            VALUES ($1, $2, $3)
            RETURNING *;
            `, [name, cohort, instructorId]);
        
        console.log("Students created.");
        return result.rows[0];
      
      }
    const seedDb = async () => {
        await client.connect();
        await createTables();
        await createInstructor("instructor1", "password1");
        await createInstructor("instructor2", "password2");
        await createInstructor("instructor3", "password3");
        await createStudent("Mickey Mouse", "WDI-1", 1);
        await createStudent("Miney Mouse", "WDI-1", 2);
        console.log("Database seeded.");
        await client.end();
        console.log("Connection closed.");    
    }    

seedDb();
}

seed();

//don't want to export seed file


/* // Clear and repopulate the database.

const db = require("../db");
const { faker } = require("@faker-js/faker");

async function seed() {
  console.log("Seeding the database.");
  try {
    // Clear the database.
    await db.query("DROP TABLE IF EXISTS student, instructor;");

    // Recreate the tables
    await db.query(`
      CREATE TABLE instructor (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
      CREATE TABLE student (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        cohort TEXT NOT NULL,
        instructorId INTEGER NOT NULL REFERENCES instructor(id) ON DELETE CASCADE
      );
    `);

    // Add 5 instructors.
    await Promise.all(
      [...Array(5)].map(() =>
        db.query(
          `INSERT INTO instructor (username, password) VALUES ($1, $2);`,
          [faker.internet.userName(), faker.internet.password()]
        )
      )
    );

    // Add 4 students for each instructor.
    await Promise.all(
      [...Array(20)].map((_, i) =>
        db.query(
          `INSERT INTO student (name, cohort, instructorId) VALUES ($1, $2, $3);`,
          [
            faker.person.fullName(),
            faker.number.int({ min: 2000, max: 3000 }),
            (i % 5) + 1,
          ]
        )
      )
    );

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  }
}

// Seed the database if we are running this file directly.
if (require.main === module) {
  seed();
}

module.exports = seed; */