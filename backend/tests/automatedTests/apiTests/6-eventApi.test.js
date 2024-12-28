describe("Event API Tests", () => {
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
      cookies = loginResponse.headers["set-cookie"];
    });

    afterEach(async () => {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", cookies);

      expect(logoutResponse.status).to.equal(200);
    });

    it("GET /event/list : should return 6 events without filters", async () => {
      const res = await request(serverUrl)
        .get("/api/event/list")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").with.lengthOf(6);

      it("GET /event/list : should return 1 event with specific filters (countries: Latvia, subsidiaryIds: 7,1)", async () => {
        const res = await request(serverUrl)
          .get("/api/event/list?countries=Latvia&subsidiaryIds=7,1")
          .set("Cookie", cookies)
          .set("Accept", "application/json");

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(1);

        const event = res.body[0];
        expect(event).to.have.property("id").that.equals(1);
        expect(event.name).to.equal("Community Park Cleanup");
        expect(event.Address.country).to.equal("Latvia");
        expect(event.Subsidiary.name).to.equal("EcoSolutions Riga");
      });
    });

    it("GET /event/:id : should return the event with id 2", async () => {
      const res = await request(serverUrl)
        .get("/api/event/2")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("id").that.equals(2);
      expect(res.body.name).to.equal("Soup Kitchen Helpers");
    });

    it("GET /event/get/names : should return a full list of event names without filters for a regular user", async () => {
      const response = await request(serverUrl)
        .get("/api/event/get/names")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").that.is.not.empty;

      response.body.forEach((event) => {
        expect(event).to.be.an("object");
        expect(event).to.have.property("id").that.is.a("number");
        expect(event).to.have.property("name").that.is.a("string");
      });
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
      managerCookies = loginResponse.headers["set-cookie"];
    });

    afterEach(async () => {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", managerCookies);

      expect(logoutResponse.status).to.equal(200);
    });

    it("GET /event/list : should return 2 events for the manager with filters", async () => {
      const res = await request(serverUrl)
        .get("/api/event/list?userId=2&userRoles=2")
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").with.lengthOf(3);
    });

    it("GET /event/:id : should return the event with id 2 for the manager", async () => {
      const res = await request(serverUrl)
        .get("/api/event/2?userId=2&userRoles[]=2")
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("id").that.equals(2);
      expect(res.body.name).to.equal("Soup Kitchen Helpers");
    });

    describe("GET /event/:id : Error cases", () => {
      it("should return a 403 error when manager tries to access event with id 5", async () => {
        const res = await request(serverUrl)
          .get("/api/event/5?userId=2&userRoles[]=2")
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal(
          "You are not allowed to access this event"
        );
      });
    });

    it("POST /event/add : should successfully add a new event", async () => {
      const newEvent = {
        managerId: "2",
        name: "New Community Event",
        description: "This is a description for a new community event.",
        typeId: "1",
        dateFrom: "2024-02-01T00:00:00Z",
        dateTo: "2024-02-02T00:00:00Z",
        publishOn: "2024-01-01T00:00:00Z",
        applicationDeadline: "2024-01-15T00:00:00Z",
        addressId: "1",
        subsidiaryId: "1",
        maxPeopleAllowed: "10",
      };

      const response = await request(serverUrl)
        .post("/api/event/add")
        .send(newEvent)
        .set("Cookie", managerCookies)
        .set("Accept", "multipart/form-data");

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("id");
      expect(response.body.name).to.equal("New Community Event");
      expect(response.body.authorId).to.equal("2");
    });

    describe("POST /event/add Error Cases", () => {
      it("should return error for missing managerId", async () => {
        const eventWithoutManagerId = {
          name: "Event Without ManagerId",
          description: "This event should fail due to missing managerId.",
          typeId: "1",
          dateFrom: "2024-02-01T00:00:00Z",
          dateTo: "2024-02-02T00:00:00Z",
        };

        const response = await request(serverUrl)
          .post("/api/event/add")
          .send(eventWithoutManagerId)
          .set("Cookie", managerCookies)
          .set("Accept", "multipart/form-data");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "ManagedId and name are required"
        );
      });

      it("should return error for missing name", async () => {
        const eventWithoutName = {
          managerId: "2",
          description: "This event should fail due to missing name.",
          typeId: "1",
          dateFrom: "2024-02-01T00:00:00Z",
          dateTo: "2024-02-02T00:00:00Z",
        };

        const response = await request(serverUrl)
          .post("/api/event/add")
          .send(eventWithoutName)
          .set("Cookie", managerCookies)
          .set("Accept", "multipart/form-data");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "ManagedId and name are required"
        );
      });

      it("should return error for missing both managerId and name", async () => {
        const eventWithNoManagerIdOrName = {
          description:
            "This event should fail due to missing managerId and name.",
          typeId: "1",
          dateFrom: "2024-02-01T00:00:00Z",
          dateTo: "2024-02-02T00:00:00Z",
        };

        const response = await request(serverUrl)
          .post("/api/event/add")
          .send(eventWithNoManagerIdOrName)
          .set("Cookie", managerCookies)
          .set("Accept", "multipart/form-data");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "ManagedId and name are required"
        );
      });
    });

    it("PUT /event/:id/edit : should successfully edit an event", async () => {
      const updatedEventData = {
        name: "Updated Event Name",
        description: "Updated description for the event",
        dateFrom: "2024-03-01T00:00:00Z",
        dateTo: "2024-03-02T00:00:00Z",
      };

      const response = await request(serverUrl)
        .put("/api/event/2/edit")
        .send(updatedEventData)
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("id").that.equals(2);
      expect(response.body.name).to.equal("Updated Event Name");
    });

    describe("PUT /event/:id/edit Error Cases", () => {
      it("should return error when trying to edit without name", async () => {
        const invalidData = {
          description: "This edit should fail",
        };

        const response = await request(serverUrl)
          .put("/api/event/2/edit")
          .send(invalidData)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Name is required");
      });

      it("should return error when user tried to edit not his/her event", async () => {
        const updatedEventData = {
          name: "Updated Event Name",
          description: "Updated description for the event",
          dateFrom: "2024-03-01T00:00:00Z",
          dateTo: "2024-03-02T00:00:00Z",
        };

        const response = await request(serverUrl)
          .put("/api/event/5/edit")
          .send(updatedEventData)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal(
          "You are not allowed to edit this object"
        );
      });
    });

    it("DELETE /event/delete : should successfully delete events", async function () {
      this.timeout(5000);
      const response = await request(serverUrl)
        .delete("/api/event/delete")
        .send({ ids: [3, 4] })
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Successfully deleted 2 events");
    });
    describe("DELETE /event/delete Error Cases", () => {
      it("should return error when no IDs are provided", async () => {
        const response = await request(serverUrl)
          .delete("/api/event/delete")
          .send({ ids: [] })
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "A valid array of event IDs is required"
        );
      });
    });

    it("should return a list of 4 event names for a manager with userId and userRoles filters", async () => {
      const response = await request(serverUrl)
        .get("/api/event/get/names?userId=2&userRoles=2")
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").that.has.lengthOf(3);

      response.body.forEach((event) => {
        expect(event).to.be.an("object");
        expect(event).to.have.property("id").that.is.a("number");
        expect(event).to.have.property("name").that.is.a("string");
      });
    });
  });
});
