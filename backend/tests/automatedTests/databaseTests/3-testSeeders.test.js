const { execSync } = require("child_process");

describe("Sequelize Seeder Test", () => {
  it("should seed all seeds, undo all seeds, and seed all again", async function () {
    this.timeout(25000);

    const { expect } = await import("chai");

    try {
      execSync("npx sequelize-cli db:seed:all");
      execSync("npx sequelize-cli db:seed:undo:all");
      execSync("npx sequelize-cli db:seed:all");
      expect(true).to.be.true;
    } catch (error) {
      throw new Error("Seeding process failed: " + error.message);
    }
  });
});
