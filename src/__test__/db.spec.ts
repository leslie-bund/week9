const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { userData } = require('../../dist/models/user');
const { recipeData } = require('../../dist/models/recipe');

require('dotenv').config()

// const app = require('../../dist/app');
// const jwt = require('jsonwebtoken');
const request = require('supertest');


const testUser = {
    email: 'ikeoluwa@decagon.com', 
    fullname: 'Ikeoluwa Idowu', 
    password: '00000', 
    confirm_password: '00000'
}

const testRecipe = {
    title: 'Sober day', 
    meal_type: 'supper', 
    difficulty_level: 'Intermediate', 
    ingredients: [
        {"name":"karim","price":"1"},
        {"name":"dozie","price":"1000"},
        {"name":"happiness","price":"300"}
    ],
    preparation: "Only the real can recognize...!"
}

const testLogin = {
  email: 'ikeoluwa@decagon.com',
  password: '00000'
}

const testUser2 = {
  email: 'ikeoluwa@gmail.com', 
  fullname: 'Ikeoluwa Idowu', 
  password: '00000', 
  confirm_password: '00000'
}


describe('Single MongoMemoryServer', () => {

  beforeAll(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoose.disconnect();
  });

  describe('User Model test', () => {
      
      it('User Model saves a new user', async () => {
        const user = await userData.create(testUser);
        expect(user).toBeTruthy();
        expect(user._id).toBeDefined();
    });

    it('User email remains unique', async () => {
        try {
            await userData.create(testUser)
        } catch (error) {
            const { name, code } = error;
            expect(name).toEqual('MongoServerError');
            expect(code).toBe(11000);
        }
    });
  })

  describe('Recipe Model test', () => {
      
      it('Recipe gets created', async () => {
        const user = await userData.findOne(testUser, { _id: 1 });
        const recipe = await recipeData.create({...testRecipe, creator: user._id});
        expect(recipe).toBeTruthy();
        expect(recipe._id).toBeDefined();
    });

    it('Recipe returns an array', async () => {
        const recipes = await recipeData.find({}).exec();
        expect(recipes).toBeDefined();
        expect(recipes).not.toBeNull();
    });
  })


  // describe('Testing Signup and Login routes', () => {
  //   test('User signs up', async () => {
  //       let response = await request(app)
  //           .post('/users/signup')
  //           .send(testUser2)
  //       expect(response.status).toBe(200);
  //       expect(response.header).toHaveProperty('set-cookie');
  //   })


  //   test('User Logins in with credentials in mock DB', async () => {
  //       let response = await request(app)
  //           .post('/users/login')
  //           .send(testLogin)
  //       expect(response.status).toBe(301);
  //       expect(response.header).toHaveProperty('set-cookie');
  //   })
  // })

  // describe("Handles routes that don\'t need auth", () => {
  //   test('Landing page returns status 200', async () => {
  //       await request(app).get('/').expect(200);
  //   })
  //   test('Logout page returns status 200', async () => {
  //       let response = await request(app).get('/user/logout');
  //       expect(response.status).not.toBe(404);
  //   })
  // })
});
