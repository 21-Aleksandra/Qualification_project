describe("Address API Tests", () => {
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

    it("GET /api/address/list-event : should return event addresses with length 4", async () => {
      const response = await request(serverUrl)
        .get("/api/address/list-event")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.lengthOf(4);
    });

    it("GET /api/address/list-subsidiary : should return subsidiary addresses with length 5", async () => {
      const response = await request(serverUrl)
        .get("/api/address/list-subsidiary")
        .set("Cookie", cookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.lengthOf(5);
    });
  });

  describe("Manager Address Tests (nova.blaze)", () => {
    let managerCookies;

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

    it("GET /api/address/list-event : should return event addresses with length 2", async () => {
      const response = await request(serverUrl)
        .get("/api/address/list-event")
        .query({ userId: 2, userRoles: "2" })
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.lengthOf(2);
    });

    it("GET /api/address/list-subsidiary : should return subsidiary addresses with length 4", async () => {
      const response = await request(serverUrl)
        .get("/api/address/list-subsidiary")
        .query({ userId: 2, userRoles: "2" })
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.lengthOf(4);
    });

    it("GET /api/address/list-all : should return all addresses with length 6", async () => {
      const response = await request(serverUrl)
        .get("/api/address/list-all")
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.lengthOf(6);
    });

    it("POST /api/address/add : should successfully add a new address", async () => {
      const newAddress = {
        country: "USA",
        city: "New York",
        street: "5th Avenue",
        lat: 40.748817,
        lng: -73.985428,
      };

      const response = await request(serverUrl)
        .post("/api/address/add")
        .send(newAddress)
        .set("Cookie", managerCookies)
        .set("Accept", "application/json");

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Address added successfully");
      expect(response.body.addressId).to.not.be.null;
    });

    describe("POST /api/address/add Error Cases", () => {
      it("should return error if country is missing", async () => {
        const missingCountry = {
          city: "New York",
          street: "5th Avenue",
          lat: 40.748817,
          lng: -73.985428,
        };

        const response = await request(serverUrl)
          .post("/api/address/add")
          .send(missingCountry)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Country, city, and street are required fields."
        );
      });

      it("should return error if city is missing", async () => {
        const missingCity = {
          country: "USA",
          street: "5th Avenue",
          lat: 40.748817,
          lng: -73.985428,
        };

        const response = await request(serverUrl)
          .post("/api/address/add")
          .send(missingCity)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Country, city, and street are required fields."
        );
      });

      it("should return error if street is missing", async () => {
        const missingStreet = {
          country: "USA",
          city: "New York",
          lat: 40.748817,
          lng: -73.985428,
        };

        const response = await request(serverUrl)
          .post("/api/address/add")
          .send(missingStreet)
          .set("Cookie", managerCookies)
          .set("Accept", "application/json");

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Country, city, and street are required fields."
        );
      });
    });
  });
});
