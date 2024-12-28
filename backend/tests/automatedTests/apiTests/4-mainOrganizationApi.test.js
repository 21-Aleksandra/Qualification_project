describe("Main Organization API Tests", () => {
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

    it("GET /api/main-organization/list : should return 6 organizations for regular user", async () => {
      const response = await request(serverUrl)
        .get("/api/main-organization/list")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.organizations).to.be.an("array").with.lengthOf(6);
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

    it("GET /api/main-organization/list : should return 4 organizations with filters for manager", async () => {
      const response = await request(serverUrl)
        .get("/api/main-organization/list")
        .query({ userId: 2, userRoles: "2" })
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.organizations).to.be.an("array").with.lengthOf(4);
    });

    it("POST /api/main-organization/add Error Cases", async () => {
      const newOrganization = { name: "Volunteer Heroes" };

      const response = await request(serverUrl)
        .post("/api/main-organization/add")
        .send(newOrganization)
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(
        "Main organization added successfully"
      );
      expect(response.body.organization).to.have.property("id");
      expect(response.body.organization.name).to.equal("Volunteer Heroes");
    });

    describe("POST /api/main-organization/add : should return errors for invalid inputs", () => {
      it("should return error for missing name", async () => {
        const response = await request(serverUrl)
          .post("/api/main-organization/add")
          .send({})
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Name is a required field.");
      });

      it("should return error when name exceeds maximum length", async () => {
        const longName = { name: "A".repeat(256) };

        const response = await request(serverUrl)
          .post("/api/main-organization/add")
          .send(longName)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Organization name exceeds the maximum length of 255 characters."
        );
      });

      it("should return error for duplicate organization name", async () => {
        const duplicateName = { name: "Eesti Vabatahtlikud" };

        const response = await request(serverUrl)
          .post("/api/main-organization/add")
          .send(duplicateName)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Main Organization with the same name already exists."
        );
      });
    });
  });
});
