'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Primeiro criar o workspace
      const [workspace] = await queryInterface.bulkInsert('Workspaces', [{
        name: 'Workspace Admin',
        cnpj: process.env.SUPER_ADMIN_WORKSPACE_CNPJ || '00000000000000',
        activeModules: ['chat', 'kanban', 'campaigns'],
        inviteCode: 'SUPERADMIN',
        freeMessages: 1000,
        usedMessages: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true });

      // Pegar o ID do workspace criado
      const workspaceId = workspace ? workspace.id : 1;

      // Criar o superadmin com o activeWorkspaceId correto
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Gmais2023@@', 10);
      const [user] = await queryInterface.bulkInsert('Users', [{
        email: process.env.SUPER_ADMIN_EMAIL || 'admin@bolt360.com.br',
        username: process.env.SUPER_ADMIN_USERNAME || 'SuperAdmin',
        password: hashedPassword,
        cpf: process.env.SUPER_ADMIN_CPF || '00000000000',
        gender: 'Masculino',
        superAdmin: true,
        activeWorkspaceId: workspaceId, // Usando o ID do workspace criado
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true });

      // Pegar o ID do usuário criado
      const userId = user ? user.id : 1;

      // Criar a relação UserWorkspace
      await queryInterface.bulkInsert('UserWorkspaces', [{
        userId: userId,
        workspaceId: workspaceId,
        role: 'owner',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      // Criar os módulos do workspace
      await queryInterface.bulkInsert('WorkspaceModules', [
        {
          workspaceId: workspaceId,
          moduleName: 'chat',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          workspaceId: workspaceId,
          moduleName: 'kanban',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          workspaceId: workspaceId,
          moduleName: 'campaigns',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

    } catch (error) {
      console.error('Erro ao criar super admin:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remover na ordem correta para evitar problemas com chaves estrangeiras
      await queryInterface.bulkDelete('WorkspaceModules', { workspaceId: 1 });
      await queryInterface.bulkDelete('UserWorkspaces', { userId: 1 });
      await queryInterface.bulkDelete('Users', { superAdmin: true });
      await queryInterface.bulkDelete('Workspaces', { name: 'Workspace Admin' });
    } catch (error) {
      console.error('Erro ao remover super admin:', error);
      throw error;
    }
  }
}; 