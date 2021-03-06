const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
describe("test user routes", () => {
  beforeEach(async () => {
    await db.users.deleteMany();
  });

  afterEach(async () => {
    await db.$disconnect();
  });

  it("POST /user/create creates new user", async () => {
    const newUser = {
      name: "Something",
      email: "new@email.com",
      password: "12345",
      repeatPassword: "12345",
    };

    const response = await request(app).post("/api/user/create").send(newUser);
<<<<<<< HEAD
   
=======

>>>>>>> 96dc0a0781b13b9db9b8cb22348a25e7bc216fff
    expect(response.body).toEqual({ message: "Created user" });
  });

  it("POST /create sends error message if info missing", async () => {
    const newUser = {
      email: "new@email.com",
      password: "12345",
    };

    const response = await request(app).post("/api/user/create").send(newUser);

    expect(response.body).toEqual({
      error: "One of the required information is missing",
    });
  });
});
