const mail = require("@sendgrid/mail");
jest.mock("@sendgrid/mail");

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("POST /auth/forgot-password", () => {
  const user = {
    name: "customer",
    email: "example@gmail.com",
    resetToken: "",
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
  });

  afterEach(async () => {
    await db.users.deleteMany();
    await db.password_reset.deleteMany();

    await db.$disconnect();
  });

  it("sends email with token to user if user inputs correct info", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ name: user.name, email: user.email });

    expect(response.body).toEqual({
      message:
        "We have sent an email with the forgot password link if you are registered!",
    });

    expect(mail.send.mock.calls[0][0].to).toEqual(user.email);
  });
});
