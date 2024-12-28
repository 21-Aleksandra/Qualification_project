describe("Auth API Tests", () => {
  let request, expect;
  const serverUrl = process.env.SERVER_URL || "http://localhost:7000";

  before(async () => {
    ({ expect } = await import("chai"));
    const supertest = await import("supertest");
    request = supertest.default;
  });

  describe("POST /api/auth/register", () => {
    it("should register a user with valid data and send email", function () {
      this.timeout(5000);
      return request(serverUrl)
        .post("/api/auth/register")
        .send({
          username: "validUsername",
          email: "valid@example.com",
          password: "ValidPass123!!!",
        })
        .then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body.message).to.equal(
            "User registered successfully"
          );
        });
    });

    describe("POST /api/auth/register Error Cases", () => {
      it("should return an error when username is missing", async () => {
        const response = await request(serverUrl)
          .post("/api/auth/register")
          .send({
            email: "valid@example.com",
            password: "ValidPass123!",
          });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Username, email, and password are required"
        );
      });

      it("should return an error when email is missing", async () => {
        const response = await request(serverUrl)
          .post("/api/auth/register")
          .send({
            username: "validUsername",
            password: "ValidPass123!",
          });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Username, email, and password are required"
        );
      });

      it("should return an error when password is missing", async () => {
        const response = await request(serverUrl)
          .post("/api/auth/register")
          .send({
            username: "validUsername",
            email: "valid@example.com",
          });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Username, email, and password are required"
        );
      });

      it("should return an error for an invalid email format", async () => {
        const response = await request(serverUrl)
          .post("/api/auth/register")
          .send({
            username: "validUsername",
            email: "invalid-email",
            password: "ValidPass123!",
          });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid email format");
      });

      it("should return an error for an invalid password format", async () => {
        const response = await request(serverUrl)
          .post("/api/auth/register")
          .send({
            username: "validUsername_2",
            email: "valid@example2.com",
            password: "short",
          });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Password must be 8-80 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character (! . - _)."
        );
      });

      it("should return an error when email already exists", async () => {
        const response = await request(serverUrl)
          .post("/api/auth/register")
          .send({
            username: "existingUsername",
            email: "luna.stardust@cosmicmail.com",
            password: "ValidPass123!",
          });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "User with this email already exists."
        );
      });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(serverUrl).post("/api/auth/login").send({
        email: "luna.stardust@cosmicmail.com",
        password: "Starlight123!",
      });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Login successful");
      expect(response.body.username).to.equal("Luna Stardust");
    });

    describe("POST /api/auth/login Error Cases", () => {
      it("should return an error when email is missing", async () => {
        const response = await request(serverUrl).post("/api/auth/login").send({
          password: "Starlight123!",
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Email, and password are required"
        );
      });

      it("should return an error when password is missing", async () => {
        const response = await request(serverUrl).post("/api/auth/login").send({
          email: "luna.stardust@cosmicmail.com",
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Email, and password are required"
        );
      });

      it("should return an error for invalid password", async () => {
        const response = await request(serverUrl).post("/api/auth/login").send({
          email: "luna.stardust@cosmicmail.com",
          password: "Starlight123!5674",
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid data");
      });

      it("should return an error for invalid email", async () => {
        const response = await request(serverUrl).post("/api/auth/login").send({
          email: "luuuuna.stardust@cosmicmail.com",
          password: "Starlight123!",
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "User with this email does not exist."
        );
      });

      it("should return an error for unverified email", async () => {
        const response = await request(serverUrl).post("/api/auth/login").send({
          email: "john.doe@example.com",
          password: "John_doe2024",
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("You must verify your email");
      });
    });
  });

  describe("POST /api/auth/forgot-password", function () {
    this.timeout(10000);
    it("should send a password reset email for valid email", async function () {
      const response = await request(serverUrl)
        .post("/api/auth/forgot-password")
        .send({ email: "zephyr.horizon@gmail.com" });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Password email sent!");
    });

    describe("POST /api/auth/forgot-password Error Cases", () => {
      it("should return an error if email is not registered", async function () {
        const response = await request(serverUrl)
          .post("/api/auth/forgot-password")
          .send({ email: "somemail@example.com" });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("No user with such email");
      });

      it("should return an error if email is not verified", async function () {
        const unverifiedEmail = "john.doe@example.com";

        const response = await request(serverUrl)
          .post("/api/auth/forgot-password")
          .send({ email: unverifiedEmail });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Verify your email first!");
      });
    });
  });

  describe("DELETE /api/auth/logout", function () {
    it("should log out the user and clear the session", async function () {
      const response = await request(serverUrl).delete("/api/auth/logout");

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Logout successful");
    });
  });

  describe("GET /api/auth/status", function () {
    let cookies;
    before(async function () {
      const loginResponse = await request(serverUrl)
        .post("/api/auth/login")
        .send({
          email: "luna.stardust@cosmicmail.com",
          password: "Starlight123!",
        })
        .set("Accept", "application/json");

      expect(loginResponse.status).to.equal(200);
      expect(loginResponse.body.message).to.equal("Login successful");

      cookies = loginResponse.headers["set-cookie"];
    });

    after(async function () {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(logoutResponse.status).to.equal(200);
      expect(logoutResponse.body.message).to.equal("Logout successful");
    });

    it("should return user details when authenticated", async function () {
      const response = await request(serverUrl)
        .get("/api/auth/status")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.isAuthenticated).to.be.true;
      expect(response.body.username).to.not.be.null;
      expect(response.body.roles).to.be.an("array").that.is.not.empty;
    });

    it("should return a status indicating the user is not authenticated", async function () {
      const response = await request(serverUrl)
        .get("/api/auth/status")
        .set("Accept", "application/json");
      expect(response.status).to.equal(200);
      expect(response.body.isAuthenticated).to.be.false;
      expect(response.body.username).to.be.null;
      expect(response.body.roles).to.be.an("array").that.is.empty;
    });
  });
});
