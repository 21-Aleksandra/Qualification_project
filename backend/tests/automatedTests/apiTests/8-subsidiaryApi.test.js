describe("Subsidiary API Tests", () => {
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

    it("GET /api/subsidiary/list : should return 7 subsidiaries without any filters", async () => {
      const res = await request(serverUrl)
        .get("/api/subsidiary/list")
        .set("Cookie", cookies);

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(7);
    });

    it("GET /api/subsidiary/list : should return 2 subsidiaries with cities, countries, and missions filters", async () => {
      const res = await request(serverUrl)
        .get(
          "/api/subsidiary/list?cities=Riga,Kaunas&countries=Latvia,Lithuania&missions=1"
        )
        .set("Cookie", cookies);

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });

    it("GET /api/subsidiary/:id : should return subsidiary details for a valid ID", async () => {
      const res = await request(serverUrl)
        .get("/api/subsidiary/1")
        .set("Cookie", cookies);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal("EcoSolutions Riga");
    });

    describe("GET /api/subsidiary/:id Error cases", () => {
      it("should return 404 for an invalid subsidiary ID", async () => {
        const res = await request(serverUrl)
          .get("/api/subsidiary/9999")
          .set("Cookie", cookies);

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("Subsidiary with ID 9999 not found");
      });
    });

    it("GET /api/subsidiary/get/names : should return 7 subsidiary names", async () => {
      const res = await request(serverUrl)
        .get("/api/subsidiary/get/names")
        .set("Cookie", cookies);

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(7);
    });
  });

  describe("Manager Tests (manager)", () => {
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

    it(" GET /api/subsidiary/list (Manager): should return 4 subsidiaries for the manager", async () => {
      const res = await request(serverUrl)
        .get("/api/subsidiary/list?userId=2&userRoles=2")
        .set("Cookie", managerCookies);

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(4);
    });

    it("GET /api/subsidiary/get/names (Manager) : should return 4 subsidiary names for the manager", async () => {
      const res = await request(serverUrl)
        .get("/api/subsidiary/get/names?userId=2&userRoles=2")
        .set("Cookie", managerCookies);

      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(4);
    });

    it("POST /api/subsidiary/add : should successfully add a subsidiary", async () => {
      const res = await request(serverUrl)
        .post("/api/subsidiary/add")
        .set("Cookie", managerCookies)
        .send({
          managerId: 2,
          name: "New Subsidiary",
          description: "Test description",
          mainOrganizationId: 1,
          foundedAt: "2024-12-28",
          addressId: 1,
          email: "newsubsidiary@test.com",
          website: "http://newsubsidiary.com",
          staffCount: 50,
          missions: [1, 2],
        });

      expect(res.status).to.equal(201);
      expect(res.body.name).to.equal("New Subsidiary");
    });

    describe("POST /api/subsidiary/add Error Cases", () => {
      it("should return 400 error for missing required fields (name and managerId)", async () => {
        const res = await request(serverUrl)
          .post("/api/subsidiary/add")
          .set("Cookie", managerCookies)
          .send({
            description: "Test description",
            mainOrganizationId: 1,
            foundedAt: "2024-12-28",
            addressId: 1,
            email: "newsubsidiary@test.com",
            website: "http://newsubsidiary.com",
            staffCount: 50,
            missions: [1, 2],
          });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("ManagedId and name are required");
      });

      it("should return 400 error for invalid email format", async () => {
        const res = await request(serverUrl)
          .post("/api/subsidiary/add")
          .set("Cookie", managerCookies)
          .send({
            managerId: 2,
            name: "New Subsidiary",
            description: "Test description",
            mainOrganizationId: 1,
            foundedAt: "2024-12-28",
            addressId: 1,
            email: "invalid-email",
            website: "http://newsubsidiary.com",
            staffCount: 50,
            missions: [1, 2],
          });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Invalid email format");
      });
    });

    it("PUT /api/subsidiary/${subsidiaryId}/edit : should successfully edit a subsidiary", async () => {
      const subsidiaryId = 3;
      const updatedSubsidiaryData = {
        name: "Updated Subsidiary Name",
        description: "Updated description",
        email: "updated.subsidiary@company.com",
        website: "https://updatedsubsidiary.com",
        staffCount: 200,
        foundedAt: "2010-01-01",
      };

      const response = await request(serverUrl)
        .put(`/api/subsidiary/${subsidiaryId}/edit`)
        .set("Cookie", managerCookies)
        .send(updatedSubsidiaryData);

      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal(updatedSubsidiaryData.name);
      expect(response.body.email).to.equal(updatedSubsidiaryData.email);
    });

    describe("Edit Subsidiary - Error Cases", () => {
      it("should return an error if subsidiary ID is invalid", async () => {
        const invalidSubsidiaryId = 9999;
        const updatedSubsidiaryData = {
          name: "Non-Existing Subsidiary",
          email: "nonexisting@company.com",
        };

        const response = await request(serverUrl)
          .put(`/api/subsidiary/${invalidSubsidiaryId}/edit`)
          .set("Cookie", managerCookies)
          .send(updatedSubsidiaryData);

        expect(response.status).to.equal(404);
        expect(response.body.message).to.include("Subsidiary with ID");
      });

      it("should return error if user tried to edit not his/her subsidiary", async () => {
        const subsidiaryId = 4;
        const updatedSubsidiaryData = {
          name: "Updated Subsidiary Name",
          description: "Updated description",
          email: "updated.subsidiary@company.com",
          website: "https://updatedsubsidiary.com",
          staffCount: 200,
          foundedAt: "2010-01-01",
        };

        const response = await request(serverUrl)
          .put(`/api/subsidiary/${subsidiaryId}/edit`)
          .set("Cookie", managerCookies)
          .send(updatedSubsidiaryData);

        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          "You are not a manager of this subsidiary"
        );
      });

      it("should return an error if required fields are missing", async () => {
        const subsidiaryId = 2;
        const updatedSubsidiaryData = {};

        const response = await request(serverUrl)
          .put(`/api/subsidiary/${subsidiaryId}/edit`)
          .set("Cookie", managerCookies)
          .send(updatedSubsidiaryData);

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include("Name is required");
      });

      it("should return an error if the email format is invalid", async () => {
        const subsidiaryId = 7;
        const updatedSubsidiaryData = {
          name: "Test",
          email: "invalid-email-format",
        };

        const response = await request(serverUrl)
          .put(`/api/subsidiary/${subsidiaryId}/edit`)
          .set("Cookie", managerCookies)
          .send(updatedSubsidiaryData);

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include("Invalid email format");
      });
    });

    it("DEL /api/subsidiary/delete : should successfully delete a subsidiary", async () => {
      const response = await request(serverUrl)
        .delete("/api/subsidiary/delete")
        .set("Cookie", managerCookies)
        .send({ ids: [5, 6] });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.include("Successfully deleted");
    });

    describe("Delete Subsidiary - Error Cases", () => {
      it("should return an error if no subsidiary IDs are provided in the body", async () => {
        const response = await request(serverUrl)
          .delete("/api/subsidiary/delete")
          .set("Cookie", managerCookies)
          .send({});

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include(
          "A valid array of subsidiary IDs is required"
        );
      });

      it("should return an error if no subsidiaries are found to delete", async () => {
        const response = await request(serverUrl)
          .delete("/api/subsidiary/delete")
          .set("Cookie", managerCookies)
          .send({ ids: [9999] });

        expect(response.status).to.equal(404);
        expect(response.body.message).to.include(
          "No subsidiaries found with the provided IDs"
        );
      });
    });
  });
  describe("Admin tests - Change Managers", () => {
    let request, expect;
    const serverUrl = process.env.SERVER_URL || "http://localhost:7000";
    let adminCookies;

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
      adminCookies = loginResponse.headers["set-cookie"];
    });

    afterEach(async () => {
      const logoutResponse = await request(serverUrl)
        .delete("/api/auth/logout")
        .set("Cookie", adminCookies);

      expect(logoutResponse.status).to.equal(200);
    });

    it("PUT /api/subsidiary/${subsidiaryId}/change-managers : should successfully assign managers to a subsidiary", async () => {
      const subsidiaryId = 1;
      const managerIds = [2, 3];

      const response = await request(serverUrl)
        .put(`/api/subsidiary/${subsidiaryId}/change-managers`)
        .set("Cookie", adminCookies)
        .send({ managerIds });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        "Subsidiary managers updated successfully"
      );
      expect(response.body.addedManagers).to.deep.equal([3]);
    });

    it("PUT /api/subsidiary/${subsidiaryId}/change-managers : should successfully remove managers from a subsidiary", async () => {
      const subsidiaryId = 7;
      const managerIds = [2];

      const response = await request(serverUrl)
        .put(`/api/subsidiary/${subsidiaryId}/change-managers`)
        .set("Cookie", adminCookies)
        .send({ managerIds });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        "Subsidiary managers updated successfully"
      );
      expect(response.body.removedManagers).to.deep.equal([3]);
    });

    describe("Change Managers for Subsidiary - Error Cases", () => {
      it("should return an error if managerIds is missing or not an array", async () => {
        const subsidiaryId = 1;
        const invalidManagerIds = {};

        const response = await request(serverUrl)
          .put(`/api/subsidiary/${subsidiaryId}/change-managers`)
          .set("Cookie", adminCookies)
          .send({ managerIds: invalidManagerIds });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include(
          "Invalid or missing 'managerIds' parameter"
        );
      });

      it("should return an error if the subsidiary ID is invalid", async () => {
        const invalidSubsidiaryId = 9999;
        const managerIds = [2, 3];

        const response = await request(serverUrl)
          .put(`/api/subsidiary/${invalidSubsidiaryId}/change-managers`)
          .set("Cookie", adminCookies)
          .send({ managerIds });

        expect(response.status).to.equal(404);
        expect(response.body.message).to.include("Subsidiary not found");
      });

      it("should return an error if no manager IDs are provided", async () => {
        const subsidiaryId = 1;
        const response = await request(serverUrl)
          .put(`/api/subsidiary/${subsidiaryId}/change-managers`)
          .set("Cookie", adminCookies)
          .send({});

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include(
          "Invalid or missing 'managerIds' parameter"
        );
      });
    });
  });
});
