'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Cars", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Cars", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
