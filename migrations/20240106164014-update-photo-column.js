'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Cars', 'photo', {
      type: Sequelize.JSONB,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Cars', 'photo', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  }
};
