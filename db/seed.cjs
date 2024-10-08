// Clear and repopulate the database.
require("dotenv").config();
const client = require('../client/client');
const { faker } = require("@faker-js/faker");
const uuid = require('uuid');
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
        const SQL = `
          INSERT INTO instructor(username, password) VALUES($1, $2) RETURNING *
        `;
        const response = await client.query(SQL, [username, await bcrypt.hash(password, 5)]);
        console.log("Instructors created.");
        return response.rows[0];
      }

      const createStudent = async(name, cohort, instructorId)=> {
        const SQL = `
          INSERT INTO student(name, cohort, instructorId) VALUES($1, $2, $3) RETURNING *
        `;
        const response = await client.query(SQL, [name, cohort, instructorId]);
        console.log("Students created.");
        return response.rows[0];
      
      }
    const seedDb = async () => {
        createTables();
        createInstructor();
        createStudent();
        console.log("Database seeded.");    
    }    

seedDb();
}

seed();



module.exports = {
    createTables,
    createInstructor,
    createStudent
};