describe("Mission API Tests", () => {
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

    it("GET /api/mission/list : should return 7 missions for regular user", async () => {
      const response = await request(serverUrl)
        .get("/api/mission/list")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.missions).to.be.an("array").with.lengthOf(7);
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

    it("GET /api/mission/list : should return 7 missions for manager", async () => {
      const response = await request(serverUrl)
        .get("/api/mission/list")
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.missions).to.be.an("array").with.lengthOf(7);
    });

    it("POST /api/mission/add : should successfully add a new mission", async () => {
      const newMission = { name: "Protect Wildlife" };

      const response = await request(serverUrl)
        .post("/api/mission/add")
        .send(newMission)
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Mission added successfully");
      expect(response.body.mission).to.have.property("id");
      expect(response.body.mission.name).to.equal("Protect Wildlife");
    });

    describe("POST /api/mission/add Error Cases", () => {
      it("should return error for missing name", async () => {
        const response = await request(serverUrl)
          .post("/api/mission/add")
          .send({})
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Mission name is a required field."
        );
      });

      it("should return error for invalid mission name", async () => {
        const invalidName = { name: "!!Invalid Mission##" };

        const response = await request(serverUrl)
          .post("/api/mission/add")
          .send(invalidName)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Mission name must be 3-100 characters long and can only include English letters, numbers, commas, dots, and spaces."
        );
      });

      it("should return error for duplicate mission name", async () => {
        const duplicateName = { name: "Protect Wildlife" };

        const response = await request(serverUrl)
          .post("/api/mission/add")
          .send(duplicateName)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Mission with the same name already exists."
        );
      });
    });
  });
});
