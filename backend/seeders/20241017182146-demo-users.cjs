'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    return queryInterface.bulkInsert('Users', [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
        cpf: '12345678901',
        gender: 'Masculino',
        profilePicture: 'https://avatar.iran.liara.run/public/boy?username=user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
        cpf: '23456789012',
        gender: 'Feminino',
        profilePicture: 'https://avatar.iran.liara.run/public/girl?username=user2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};