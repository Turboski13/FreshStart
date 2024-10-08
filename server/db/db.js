const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/2504-ftb-et-web-pt');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

const createInstructor = async({ username, password})=> {
  const SQL = `
    INSERT INTO users( username, password) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const createStudent = async({ name, cohort, instructorId })=> {
  const SQL = `
    INSERT INTO products(name, cohort, instructorId) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [name, cohort, instructorId]);
  return response.rows[0];
};

const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, password
    FROM instructors
    WHERE username = $1
  `;
  const response = await client.query(SQL, [ username ]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password))=== false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};


const findInstructorWithToken = async(id)=> {
  const SQL = `
    SELECT id, username FROM instructors WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchInstructors = async()=> {
  const SQL = `
    SELECT id, username FROM instructors;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchStudents = async()=> {
  const SQL = `
    SELECT * FROM students;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createInstructor,
  createStudent,
  fetchInstructors,
  fetchStudents,
  authenticate,
  findInstructorWithToken
};