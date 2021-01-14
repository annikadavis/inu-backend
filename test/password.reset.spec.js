jest.mock("@sendgrid/mail");

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("POST /reset-password", () => {
  const user = {
    name: "customer",
    email: "bill@gmail.com",
    resetToken: "abcdf",
  };

  beforeEach(async () => {
    await db.$queryRaw(`
    INSERT INTO users(
      name, email, password) 
    VALUES('${user.name}','${user.email}', '${user.password}')`);

    await db.$queryRaw(`
    INSERT INTO password_reset(email, reset_token) 
    VALUES('${user.email}','${user.resetToken}')`);
  });

  afterEach(async () => {
    await db.$queryRaw(`DELETE from users`);
    await db.$queryRaw(`DELETE from password_reset`);
    await db.$disconnect();
  });

  it("sends email with token to user if user inputs correct info", async () => {
    const response = await request(app).post("/reset-password").send({
      resetToken: user.resetToken,
      newPassword: 12345,
      repeatPassword: 12345,
    });

    expect(response.body).toEqual({
      message: "your password has been reset"
    });
  });
});
