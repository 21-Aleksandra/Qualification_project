"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Subsidiary",
      [
        {
          name: "EcoSolutions Riga",
          description:
            "Promoting environmental sustainability through local initiatives.",
          foundedAt: new Date(2015, 3, 20),
          addressId: 3,
          photoSetId: 1,
          mainOrganizationId: 1,
          email: "eco.solutions.riga@example.com",
          website: "https://ecosolutionsriga.lv",
          staffCount: 25,
        },
        {
          name: "Baltic Youth Education",
          description:
            "Providing educational resources to children and young adults.",
          foundedAt: new Date(2017, 6, 5),
          addressId: 4,
          photoSetId: 2,
          mainOrganizationId: 5,
          email: "info@balticyouth.edu",
          website: "https://balticyouth.edu",
          staffCount: 40,
        },
        {
          name: "MentalHealth Vilnius",
          description:
            "Raising awareness and supporting mental health initiatives.",
          foundedAt: new Date(2018, 1, 12),
          addressId: 5,
          photoSetId: 3,
          mainOrganizationId: 3,
          email: "contact@mentalhealthvilnius.lt",
          website: "https://mentalhealthvilnius.lt",
          staffCount: 15,
        },
        {
          name: "Näljaabi Tallinn",
          description:
            "Helping combat hunger through food distribution and local support.",
          foundedAt: new Date(2016, 10, 25),
          addressId: 1,
          photoSetId: 4,
          mainOrganizationId: 2,
          email: "relief@hungerestonia.ee",
          website: "https://hungerrelieftallinn.ee",
          staffCount: 35,
        },
        {
          name: "Women Empowerment Tallinn",
          description:
            "Empowering women through education and resource distribution.",
          foundedAt: new Date(2019, 8, 18),
          addressId: 4,
          photoSetId: 5,
          mainOrganizationId: 6,
          email: "power@womenestonia.ee",
          website: "https://womenpowermenttallinn.ee",
          staffCount: 20,
        },
        {
          name: "Global Disaster Relief Latvia",
          description: "Providing immediate disaster relief worldwide.",
          foundedAt: new Date(2020, 5, 10),
          addressId: 3,
          photoSetId: 6,
          mainOrganizationId: 1,
          email: "disasterrelief@latvia.org",
          website: "https://globaldisasterrelieflatvia.org",
          staffCount: 50,
        },
        {
          name: "Community Engagement Kaunas",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at blandit libero. Aenean lobortis dui risus, in tempus mi rutrum eget. Nam tortor felis, tincidunt eu consequat eu, lobortis non purus. Vivamus vel luctus urna. Morbi eleifend eu nulla vitae venenatis. Donec non mi risus. Nulla sem arcu, tempus a mauris ac, dapibus mattis mi. Cras tempus massa ac enim mattis gravida. Suspendisse dignissim ultrices felis quis aliquam. Nullam in cursus diam. Quisque quis ex ante.",
          foundedAt: new Date(2014, 2, 15),
          addressId: 6,
          photoSetId: 7,
          mainOrganizationId: 4,
          email: "contact@communityengagement.lt",
          website: "https://communityengagementkaunas.lt",
          staffCount: 30,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Subsidiary", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE subsidiary AUTO_INCREMENT = 1;"
    );
  },
};
