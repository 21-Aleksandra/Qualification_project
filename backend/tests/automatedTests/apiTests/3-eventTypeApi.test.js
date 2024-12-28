describe("Event Type API Tests", () => {
  let request, expect;
  const serverUrl = process.env.SERVER_URL || "http://localhost:7000";
  let cookies, managerCookies;

  before(async () => {
    ({ expect } = await import("chai"));
    const supertest = await import("supertest");
    request = supertest.default;
  });

  describe("Regular User Tests (luna.stardust)", () => {
    beforeEach(async () => {
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

    afterEach(async () => {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(logoutResponse.status).to.equal(200);
      expect(logoutResponse.body.message).to.equal("Logout successful");
    });

    it("GET /api/event-type/list : should return 5 event types for regular user", async () => {
      const response = await request(serverUrl)
        .get("/api/event-type/list")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.eventTypes).to.be.an("array").with.lengthOf(5);
    });
  });

  describe("Manager Tests (nova.blaze)", () => {
    beforeEach(async () => {
      const loginResponse = await request(serverUrl)
        .post("/api/auth/login")
        .send({
          email: "nova.blaze@mail.com",
          password: "Blaze_fire789",
        })
        .set("Accept", "application/json");

      expect(loginResponse.status).to.equal(200);
      expect(loginResponse.body.message).to.equal("Login successful");

      managerCookies = loginResponse.headers["set-cookie"];
    });

    afterEach(async () => {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(logoutResponse.status).to.equal(200);
      expect(logoutResponse.body.message).to.equal("Logout successful");
    });

    it("GET /api/event-type/list : should return 3 event types for manager", async () => {
      const response = await request(serverUrl)
        .get("/api/event-type/list")
        .query({ userId: 2, userRoles: "2" })
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.eventTypes).to.be.an("array").with.lengthOf(3);
    });

    it("POST /api/event-type/add : should successfully add a new event type", async () => {
      const newEventType = { name: "Community Gardening" };

      const response = await request(serverUrl)
        .post("/api/event-type/add")
        .send(newEventType)
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Event type added successfully");
      expect(response.body.eventType).to.have.property("id");
      expect(response.body.eventType.name).to.equal("Community Gardening");
    });

    describe("POST /api/event-type/add Error Cases", () => {
      it("should return error when name is missing", async () => {
        const missingNameResponse = await request(serverUrl)
          .post("/api/event-type/add")
          .send({})
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(missingNameResponse.status).to.equal(400);
        expect(missingNameResponse.body.message).to.equal(
          "Name is a required field."
        );
      });

      it("should return error when name exceeds maximum length", async () => {
        const longName = { name: "A".repeat(256) };
        const longNameResponse = await request(serverUrl)
          .post("/api/event-type/add")
          .send(longName)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(longNameResponse.status).to.equal(400);
        expect(longNameResponse.body.message).to.equal(
          "Event type name exceeds the maximum length of 255 characters."
        );
      });

      it("should return error for duplicate event type name", async () => {
        const duplicateName = { name: "Kitchen volunteering" };
        const duplicateNameResponse = await request(serverUrl)
          .post("/api/event-type/add")
          .send(duplicateName)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(duplicateNameResponse.status).to.equal(400);
        expect(duplicateNameResponse.body.message).to.equal(
          "Event Type with the same name already exists."
        );
      });
    });
  });
});
