describe("Admin User Management API Tests", () => {
  let request, expect;
  const serverUrl = process.env.SERVER_URL || "http://localhost:7000";
  let adminCookie;

  before(async () => {
    ({ expect } = await import("chai"));
    const supertest = await import("supertest");
    request = supertest.default;
  });

  beforeEach(async () => {
    const loginResponse = await request(serverUrl)
      .post("/api/auth/login")
      .send({
        email: "admin@adminmail.com",
        password: "Rootpass24!",
      })
      .set("Accept", "application/json");

    expect(loginResponse.status).to.equal(200);
    adminCookie = loginResponse.headers["set-cookie"];
  });

  it("should return a list of users for a valid request", async () => {
    const response = await request(serverUrl)
      .get("/api/user/get")
      .set("Accept", "application/json")
      .set("Cookie", adminCookie);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.be.greaterThan(0);
  });

  it("should return user details for a valid request", async () => {
    const response = await request(serverUrl)
      .get("/api/user/1/get")
      .set("Accept", "application/json")
      .set("Cookie", adminCookie);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("username", "LunaStardust");
    expect(response.body).to.have.property(
      "email",
      "luna.stardust@cosmicmail.com"
    );
  });

  it("should create a new user when valid data is provided", async () => {
    const response = await request(serverUrl)
      .post("/api/user/add")
      .send({
        username: "newuser",
        password: "NewUser123!",
        email: "newuser@example.com",
        roles: "1",
      })
      .set("Accept", "application/json")
      .set("Cookie", adminCookie);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property(
      "message",
      "User added successfully"
    );
    expect(response.body.user).to.have.property("username", "newuser");
  });

  it("should update user details when valid data is provided", async () => {
    const response = await request(serverUrl)
      .put("/api/user/1/edit")
      .send({
        username: "updatedUser",
        email: "updated@example.com",
        roles: "1",
      })
      .set("Accept", "application/json")
      .set("Cookie", adminCookie);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property(
      "message",
      "User updated successfully"
    );
    expect(response.body.user).to.have.property("username", "updatedUser");
    expect(response.body.user).to.have.property("email", "updated@example.com");
  });

  it("should delete users when valid IDs are provided", async () => {
    const response = await request(serverUrl)
      .delete("/api/user/delete")
      .send({ ids: [2, 3] })
      .set("Accept", "application/json")
      .set("Cookie", adminCookie);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("deletedCount", 2);
  });

  describe("Error Scenarios for Adding Users", () => {
    it("should return 400 if required fields are missing", async () => {
      const response = await request(serverUrl)
        .post("/api/user/add")
        .send({
          username: "testuser",
          email: "test@example.com",
        })
        .set("Accept", "application/json")
        .set("Cookie", adminCookie);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property(
        "message",
        "Username, password, email, roles are required"
      );
    });

    it("should return 400 if the email is already taken", async () => {
      const response = await request(serverUrl)
        .post("/api/user/add")
        .send({
          username: "admin",
          password: "Password123!",
          email: "admin@adminmail.com",
          roles: "1",
        })
        .set("Accept", "application/json")
        .set("Cookie", adminCookie);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property(
        "message",
        "User with this email already exists."
      );
    });
  });

  describe("Error Scenarios for Editing Users", () => {
    it("should return 404 if the user does not exist", async () => {
      const response = await request(serverUrl)
        .put("/api/user/9999/edit")
        .send({
          username: "updatedUser",
          email: "updated@example.com",
          roles: "1",
        })
        .set("Accept", "application/json")
        .set("Cookie", adminCookie);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("message", "User not found");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(serverUrl)
        .put("/api/user/1/edit")
        .send({
          username: "updatedUser",
        })
        .set("Accept", "application/json")
        .set("Cookie", adminCookie);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property(
        "message",
        "Username, email, roles are required"
      );
    });
  });

  describe("Error Scenarios for Deleting Users", () => {
    it("should return 400 if no IDs are provided", async () => {
      const response = await request(serverUrl)
        .delete("/api/user/delete")
        .send({})
        .set("Accept", "application/json")
        .set("Cookie", adminCookie);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property(
        "message",
        "An array of user IDs is required"
      );
    });
  });
});
