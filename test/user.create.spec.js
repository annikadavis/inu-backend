const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
describe("test user routes", () => {
  beforeEach(async () => {
    await db.$executeRaw(`DELETE FROM users;`);
  });

  afterEach(async () => {
    await db.$disconnect();
  });
  it("POST /auth/create creates new user", async () => {
    const newUser = {
      name: "Something",
      email: "new@email.com",
      password: "12345",
      repeatPassword: "12345",
    };

    const response = await request(app).post("/auth/create").send(newUser);

    expect(response.body).toEqual({ message: "Created user" });
  });

  it("POST /auth/create sends error message if info missing", async () => {
    const newUser = {
      email: "new@email.com",
      password: "12345",
    };

    const response = await request(app).post("/auth/create").send(newUser);

    expect(response.body).toEqual({
      error: "One of the required information is missing",
    });
  });
});
