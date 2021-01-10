jest.mock("@sendgrid/mail");

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("POST /user/forgot-password", () => {
  const user = {
    name: "customer",
    email: "bill@gmail.com",
  };

  beforeEach(async () => {
    await db.$queryRaw(`
    INSERT INTO users(
      name, email, password) 
    VALUES('${user.name}','${user.email}', '${user.password}')`);
  });

  afterEach(async () => {
    await db.$queryRaw(`DELETE from users`);
    await db.$queryRaw(`DELETE from password_reset`);
    await db.$disconnect();
  });

  it("sends email with token to user if user inputs correct info", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ email: user.email, password: user.password });

    expect(response.body).toEqual({
      email: user.email,
      name: user.name,
      id: expect.any(Number),
      created_date: expect.any(String),
    });
  });
});
