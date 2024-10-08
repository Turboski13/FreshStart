// Clear and repopulate the database.
require("dotenv").config();
const client = require('../client/client.cjs');
const bcrypt = require('bcrypt');


const seed = async () => {
   /* const createTables = async () => { */
  console.log("Seeding the database.");
  /* try { */
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

// Add 5 instructors.
/* await Promise.all(
  [...Array(5)].map(() =>
    prisma.instructor.create({
      data: {
        name: faker.internet.userName(),
        password: faker.internet.password(),
        token: faker.company.catchPhrase()
      },
      console.log("Instructors created.");
    }) )
); 
 */

  const createStudent = async(name, cohort, instructorId)=> {
        const result = await client.query(`
            INSERT INTO student (name, cohort, instructorId)
            VALUES ($1, $2, $3)
            RETURNING *;
            `, [name, cohort, instructorId]);
        
        console.log("Students created.");
        return result.rows[0];
      
      } 


// Add 4 students for each instructor.
/* await Promise.all(
  [...Array(20)].map((_, i) =>
    prisma.student.create({
      data: {
        name: faker.person.fullName(),
        cohort: '2405',
        password: faker.internet.password(),
        
      },
    })
  )
);  */

/* console.log("Database is seeded.");
} catch (err) {
console.error(err);
}} */



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
        console.log("Connection closed.");     */
    }    

seedDb();
}

seed();

//don't want to export seed file maybe