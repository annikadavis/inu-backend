const errorHandlingMiddleware = require("../middleware/error-handling.middleware");

describe("error handling middleware test", () => {
  const res = { status: jest.fn(), json: jest.fn() };
  const req = jest.fn();
  const error = new Error("some error");
  const next = jest.fn();

  it("sets error status to 500 if there is no error status", () => {
    errorHandlingMiddleware(error, req, res, next);
    expect(res.status.mock.calls[0][0]).toEqual(500);
  });
});
