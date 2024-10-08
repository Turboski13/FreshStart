const api = require('./server/index.js');
const pg = require('pg')
const client = new pg.Client('postgres://localhost:5432/2405-ftb-et-web-pt')
const {
    client,
    createStudent,
    createTnstructor,
    fetchStudents,
    fetchInstructors,
    } = require('./server/db/db.js');
jest.mock('./server/index.js');

test



// 2 Fetch methods
test('fetches all instructors', async () => {
    const instructors = [{
        /* id: 1, */
        username: 'John Wick',
        password: 'theCarIsntForSale'
    },
    {
        /* id: 2, */
        username: 'Jane Eyre',
        password: 'NeverThatHandsome'
    }];
    api.fetchInstructors.mockResolvedValue(instructors); // mocking the try block that getUsers returns
    const response = await api.fetchInstructors(client); // calling the function
    expect(response).toEqual(instructors); // checking if the data returned is the same as the data mocked
});

test('fetches all Studentss', async () => {
    const students = [{
        /* id: 1, */
        name: 'Roy Mustang',
        cohort: '2405',
        instructorId: 2
    },
    {
        /* id: 2, */
        name: 'Chad Rochester',
        cohort: '2405',
        instructorId: 1
    }];
    api.fetchStudents.mockResolvedValue(students); 
    const response = await api.fetchStudents(client); 
    expect(response).toEqual(students); 
});

// 2 create methods
test('Creates an instructor', async () => {
    const instructor = {
        username: 'John Wick',
        password: 'theCarIsntForSale'
    };

    api.createInstructor.mockResolvedValue(instructor); 
    const response = await api.createInstructor(client); // calling the function
    expect(response).toEqual(instructor); 
});

test('Creates a student', async () => {
    const student = {
        name: 'Roy Mustang Jr',
        cohort: '2405',
        instructorId: 1
    };

    api.createStudent.mockResolvedValue(student); 
    const response = await api.createStudent(client); // calling the function
    expect(response).toEqual(Student); 
});