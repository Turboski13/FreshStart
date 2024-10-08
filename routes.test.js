const api = require('./server/index.js');
const pg = require('pg')
const client = new pg.Client('postgres://localhost:5432/2405-ftb-et-web-pt')
const {
    client,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    } = require('./server/db');
jest.mock('./server/index.js');

test



// 2 Fetch methods
test('fetches all users', async () => {
    const users = [{
        id: 1,
        username: 'John Wick',
        password: 'theCarIsntForSale'
    },
    {
        id: 2,
        username: 'Jane Eyre',
        password: 'NeverThatHandsome'
    }];
    api.fetchUsers.mockResolvedValue(users); // mocking the try block that getUsers returns
    const response = await api.fetchUsers(client); // calling the function
    expect(response).toEqual(users); // checking if the data returned is the same as the data mocked
});

test('fetches all products', async () => {
    const products = [{
        id: 1,
        name: 'Ford Mustang'
    },
    {
        id: 2,
        name: 'Rochester Estate'
    }];
    api.fetchProducts.mockResolvedValue(products); 
    const response = await api.fetchProducts(client); 
    expect(response).toEqual(products); 
});

// 2 create methods
test('Creates a product', async () => {
    const product = {
        id: 1,
        name: 'Ford Mustang'
    };

    api.createProduct.mockResolvedValue(product); 
    const response = await api.createProduct(client); // calling the function
    expect(response).toEqual(product); 
});

test('Creates a user', async () => {
    const user = {
        id: 1,
        username: 'John Wick',
        password: 'theCarIsntForSale'
    };

    api.createUser.mockResolvedValue(user); 
    const response = await api.createUser(client); // calling the function
    expect(response).toEqual(user); 
});