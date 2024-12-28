describe("Sequelize Connection Test", () => {
  it("should connect to the database successfully", async () => {
    const sequelize = require("../../../config/db");
    const { expect } = await import("chai");
    try {
      await sequelize.authenticate();
      expect(true).to.be.true;
    } catch (error) {
      throw new Error("Unable to connect to the database: " + error.message);
    } finally {
      await sequelize.close();
    }
  });
});
