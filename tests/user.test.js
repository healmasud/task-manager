const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

//genarating demo IDs

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mikae@example.com",
  password: "5456465462asdsd!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

// cleaning db after each test cases runs

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// sign up new user

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Andrew",
      email: "masud7827@gmail.com",
      password: "MyPass777!",
    })

    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assert about the response

  expect(response.body).toMatchObject({
    user: {
      name: "Andrew",
      email: "masud7827@gmail.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("MyPass777!");
});

// login for authenticated user

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

// login for unauthenticated user

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "kanok@example.com", //bad username to test
      password: userOne.password,
    })
    .expect(400);
});

// viewing user profile for authenticated user

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

// viewing profile for unauthenticated user

test("should not get profile for unauthorized user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

// delete profile for authenticated user

test("should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assert that the database was changed correctly
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

// delete profile for unauthenticated user

test("should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
