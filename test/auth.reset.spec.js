jest.mock("@sendgrid/mail");

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("POST /auth/reset-password", () => {
  const user = {
    name: "customer",
    email: "bill@gmail.com",
    resetToken: "abcdf",
    password: "some password",
  };

  beforeEach(async () => {
    await db.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await db.password_reset.create({
      data: {
        email: user.email,
        reset_token: user.resetToken,
      },
    });
  });

  afterEach(async () => {
    await db.users.deleteMany();
    await db.password_reset.deleteMany();
    await db.$disconnect();
  });

  it("sends email with token to user if user inputs correct info", async () => {
    const response = await request(app).post("/api/auth/reset-password").send({
      resetToken: user.resetToken,
      newPassword: "12345",
      repeatPassword: "12345",
    });

    expect(response.body).toEqual({
      message: "your password has been reset",
    });
  });
});
