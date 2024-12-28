const { execSync } = require("child_process");

describe("Sequelize Migrations Test", () => {
  it("should migrate all migrations, undo all, and migrate all again", async function () {
    this.timeout(25000);

    const { expect } = await import("chai");

    try {
      execSync("npx sequelize-cli db:migrate");
      execSync("npx sequelize-cli db:migrate:undo:all");
      execSync("npx sequelize-cli db:migrate");
      expect(true).to.be.true;
    } catch (error) {
      throw new Error("Migration process failed: " + error.message);
    }
  });
});
