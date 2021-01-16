const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("POST /auth/login", () => {
  const user = {
    name: "customer",
    email: "bill@gmail.com",
    password: "12345",
  };

  beforeEach(async () => {
    await db.$queryRaw(`
    INSERT INTO users(
      name, email, password) 
    VALUES('${user.name}','${user.email}', '${user.password}')`);
  });

  afterEach(async () => {
    await db.$queryRaw(`DELETE from users`);
    await db.$disconnect();
  });

  it("POST /login logins user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    expect(response.body).toEqual({
      email: user.email,
      name: user.name,
      id: expect.any(Number),
      created_date: expect.any(String),
    });
  });

  it("POST /login sends error message if info missing", async () => {
    const userLogin = {
      name: "soul",
      password: "",
    };

    const response = await request(app)
    .post("/api/auth/login")
    .send(userLogin);

    expect(response.body).toEqual({
      error: "One of the required information is missing",
    });
  });
});
