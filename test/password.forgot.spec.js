const mail = require("@sendgrid/mail");
jest.mock("@sendgrid/mail");

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("POST /user/forgot-password", () => {
  const user = {
    name: "customer",
    email: "angel.encisso@gmail.com",
    resetToken: "",
  };

  beforeEach(async () => {
    await db.$queryRaw(`
    INSERT INTO users(name, email, password) 
    VALUES('${user.name}','${user.email}', '${user.password}')`);
  });

  afterEach(async () => {
    await db.$queryRaw(`DELETE from users`);
    await db.$queryRaw(`DELETE from password_reset`);
    await db.$disconnect();
  });

  it("sends email with token to user if user inputs correct info", async () => {
    const response = await request(app)
      .post("/user/forgot-password")
      .send({ name: user.name, email: user.email });

    expect(response.body).toEqual({
      message:
        "We have sent an email with the forgot password link if you are registered!",
    });

    expect(mail.send.mock.calls[0][0].to).toEqual(user.email);
  });
});
