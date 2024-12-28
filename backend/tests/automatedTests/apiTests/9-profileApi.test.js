describe("Profile API Tests", () => {
  let request, expect;
  const serverUrl = process.env.SERVER_URL || "http://localhost:7000";
  let lunaCookies;

  before(async () => {
    ({ expect } = await import("chai"));
    const supertest = await import("supertest");
    request = supertest.default;
  });

  beforeEach(async () => {
    const loginResponse = await request(serverUrl)
      .post("/api/auth/login")
      .send({
        email: "luna.stardust@cosmicmail.com",
        password: "Starlight123!",
      })
      .set("Accept", "application/json");

    expect(loginResponse.status).to.equal(200);
    lunaCookies = loginResponse.headers["set-cookie"];
  });

  afterEach(async () => {
    const logoutResponse = await request(serverUrl)
      .delete("/api/auth/logout")
      .set("Cookie", lunaCookies);

    expect(logoutResponse.status).to.equal(200);
  });

  describe("Change Name API", () => {
    it("PUT /api/profile/change-name : should successfully change the user's name", async () => {
      const userId = 1;
      const newName = "LunaStardust";

      const response = await request(serverUrl)
        .put("/api/profile/change-name")
        .set("Cookie", lunaCookies)
        .send({ userId, name: newName });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Username updated successfully.");
    });

    describe("Change Name Error Scenarios", () => {
      it("should return an error if userId is invalid or unauthorized", async () => {
        const invalidUserId = 999;
        const newName = "Luna Stardust";

        const response = await request(serverUrl)
          .put("/api/profile/change-name")
          .set("Cookie", lunaCookies)
          .send({ userId: invalidUserId, name: newName });

        expect(response.status).to.equal(403);
        expect(response.body.message).to.include(
          "Unauthorized or invalid user ID."
        );
      });

      it("should return an error if name is empty", async () => {
        const userId = 1;
        const invalidName = "";

        const response = await request(serverUrl)
          .put("/api/profile/change-name")
          .set("Cookie", lunaCookies)
          .send({ userId, name: invalidName });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include("Name cannot be empty.");
      });
    });
  });

  describe("Send Email Request API", () => {
    it("POST /api/profile/send-email-request : should successfully send an email request to admin", async function () {
      this.timeout(5000);

      const userId = 1;
      const requestDetails = "Request for account modification.";

      const response = await request(serverUrl)
        .post("/api/profile/send-email-request")
        .set("Cookie", lunaCookies)
        .send({ userId, requestDetails });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.include(
        "Request sent to admin successfully."
      );
    });

    describe("Send Email Request Error Scenarios", () => {
      it("should return an error if request details are empty", async () => {
        const userId = 1;
        const requestDetails = "";

        const response = await request(serverUrl)
          .post("/api/profile/send-email-request")
          .set("Cookie", lunaCookies)
          .send({ userId, requestDetails });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.include(
          "Request details cannot be empty."
        );
      });

      it("should return an error if userId is invalid or unauthorized", async () => {
        const invalidUserId = 999;
        const requestDetails = "Request for account modification.";

        const response = await request(serverUrl)
          .post("/api/profile/send-email-request")
          .set("Cookie", lunaCookies)
          .send({ userId: invalidUserId, requestDetails });

        expect(response.status).to.equal(403);
        expect(response.body.message).to.include(
          "Unauthorized or invalid user ID."
        );
      });
    });
  });

  describe("Change Password Error Scenarios", () => {
    it("should return an error if old or new password is missing", async () => {
      const userId = 1;
      const newPassword = "LunaNew123!";

      const response = await request(serverUrl)
        .put("/api/profile/change-password")
        .set("Cookie", lunaCookies)
        .send({ userId, newPassword });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.include(
        "Both old and new passwords are required."
      );
    });

    it("should return an error if userId is invalid or unauthorized", async () => {
      const invalidUserId = 999;
      const oldPassword = "Luna123!";
      const newPassword = "LunaNew123!";

      const response = await request(serverUrl)
        .put("/api/profile/change-password")
        .set("Cookie", lunaCookies)
        .send({ userId: invalidUserId, oldPassword, newPassword });

      expect(response.status).to.equal(403);
      expect(response.body.message).to.include(
        "Unauthorized or invalid user ID."
      );
    });
  });

  describe("Change Password API", () => {
    it("PUT /api/profile/change-password : should successfully change the user's password", async function () {
      this.timeout(5000);
      const userId = 1;
      const oldPassword = "Starlight123!";
      const newPassword = "LunaNewPassword123!";

      const response = await request(serverUrl)
        .put("/api/profile/change-password")
        .set("Cookie", lunaCookies)
        .send({ userId, oldPassword, newPassword });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.include(
        "Password updated successfully."
      );

      const loginResponse = await request(serverUrl)
        .post("/api/auth/login")
        .send({
          email: "luna.stardust@cosmicmail.com",
          password: newPassword,
        })
        .set("Accept", "application/json");

      expect(loginResponse.status).to.equal(200);
      lunaCookies = loginResponse.headers["set-cookie"];
    });
  });
});
