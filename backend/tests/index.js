const fs = require("fs");
const path = require("path");
const Mocha = require("mocha");

const mocha = new Mocha();
const testDir = path.join(__dirname, "automatedTests");

// Helper function to sort files numerically
const getSortedTestFiles = (directory) => {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".test.js")) // Filter only .test.js files
    .sort((a, b) => {
      // Extract numeric prefixes and sort numerically
      const numA = parseInt(a.split("-")[0], 10);
      const numB = parseInt(b.split("-")[0], 10);
      return numA - numB;
    });
};

// Add database-related tests first
getSortedTestFiles(path.join(testDir, "databaseTests")).forEach((file) => {
  mocha.addFile(path.join(testDir, "databaseTests", file));
});

// Add API tests after database tests
getSortedTestFiles(path.join(testDir, "apiTests")).forEach((file) => {
  mocha.addFile(path.join(testDir, "apiTests", file));
});

mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});
