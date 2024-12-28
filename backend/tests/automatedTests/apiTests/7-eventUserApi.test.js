describe("EventUserAPI Tests", () => {
  let request, expect;
  const serverUrl = process.env.SERVER_URL || "http://localhost:7000";
  let cookies;

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
      cookies = loginResponse.headers["set-cookie"];
    });

    afterEach(async () => {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", cookies);

      expect(logoutResponse.status).to.equal(200);
    });

    it("GET /event-user/list/:userId : should return a list of events the user is registered for", async () => {
      const response = await request(serverUrl)
        .get("/api/event-user/list/1")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.events).to.be.an("array").with.lengthOf(1);

      const event1 = response.body.events[0];
      expect(event1).to.have.property("id").that.equals(1);
      expect(event1.name).to.equal("Community Park Cleanup");
      expect(event1.Participants[0].username).to.equal("Luna Stardust");
      expect(event1.Address.country).to.equal("Latvia");
      expect(event1.Photo_Set.Photos[0].url).to.equal(
        "static/eventPhotos/test_1_event.png"
      );
    });

    it("GET /event-user/list/:userId : should return filtered events by date", async () => {
      const response = await request(serverUrl)
        .get("/api/event-user/list/1?dateFrom=2024-02-01&dateTo=2024-02-28")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.events).to.be.an("array").with.lengthOf(1);
    });

    it("GET /event-user/list/:userId : should return filtered events by name", async () => {
      const response = await request(serverUrl)
        .get("/api/event-user/list/1?name=Community Park Cleanup")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.events).to.be.an("array").with.lengthOf(1);
      expect(response.body.events[0].name).to.equal("Community Park Cleanup");
    });

    it("POST event-user/register : should successfully register a user for an event", async () => {
      const eventRegistration = {
        eventId: 2,
        userId: 1,
      };

      const response = await request(serverUrl)
        .post("/api/event-user/register")
        .send(eventRegistration)
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(
        "User successfully registered for the event."
      );
    });

    describe("POST /event-user/register Error Cases", () => {
      it("should return error if the user is already registered for the event", async () => {
        const eventRegistration = {
          eventId: 2,
          userId: 1,
        };

        const response = await request(serverUrl)
          .post("/api/event-user/register")
          .send(eventRegistration)
          .set("Cookie", cookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "User is already registered for this event."
        );
      });

      it("should return error if no userId", async () => {
        const eventRegistration = {
          eventId: 2,
        };

        const response = await request(serverUrl)
          .post("/api/event-user/register")
          .send(eventRegistration)
          .set("Cookie", cookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Event and User ID are required."
        );
      });
    });

    it("DEL event-user/unregister : should successfully unregister a user from an event", async () => {
      const eventUnregistration = {
        eventId: 1,
        userId: 1,
      };

      const response = await request(serverUrl)
        .delete("/api/event-user/unregister")
        .send(eventUnregistration)
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        "User successfully unregistered from the event."
      );
    });

    describe("DEL /event-user/unregister Error Cases", () => {
      it("should return error if the user is not registered for the event", async () => {
        const eventUnregistration = {
          eventId: 999,
          userId: 1,
        };

        const response = await request(serverUrl)
          .delete("/api/event-user/unregister")
          .send(eventUnregistration)
          .set("Cookie", cookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal(
          "User is not registered for this event."
        );
      });
      it("should return error if the no userId", async () => {
        const eventUnregistration = {
          eventId: 999,
        };

        const response = await request(serverUrl)
          .delete("/api/event-user/unregister")
          .send(eventUnregistration)
          .set("Cookie", cookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Event and User ID are required."
        );
      });
    });
  });
});
