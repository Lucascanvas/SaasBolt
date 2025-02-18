'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Adicionar coluna activeWorkspaceId na tabela Users
      await queryInterface.addColumn('Users', 'activeWorkspaceId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Workspaces',
          key: 'id'
        }
      });
    } catch (error) {
      console.log('Coluna activeWorkspaceId já existe ou erro:', error.message);
    }

    try {
      // Adicionar coluna superAdmin na tabela Users
      await queryInterface.addColumn('Users', 'superAdmin', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });
    } catch (error) {
      console.log('Coluna superAdmin já existe ou erro:', error.message);
    }

    try {
      // Criar ENUM type se ainda não existir
      await queryInterface.sequelize.query(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_conversations_type') THEN
            CREATE TYPE "enum_conversations_type" AS ENUM ('GROUP', 'PRIVATE');
          END IF;
        END
        $$;
      `);

      // Atualizar ENUM type na tabela Conversations
      await queryInterface.changeColumn('Conversations', 'type', {
        type: Sequelize.ENUM('GROUP', 'PRIVATE'),
        allowNull: false,
        defaultValue: 'PRIVATE'
      });
    } catch (error) {
      console.log('Alteração do ENUM type ignorada ou erro:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remover coluna activeWorkspaceId da tabela Users
      await queryInterface.removeColumn('Users', 'activeWorkspaceId');
    } catch (error) {
      console.log('Erro ao remover activeWorkspaceId:', error.message);
    }

    try {
      // Remover coluna superAdmin da tabela Users
      await queryInterface.removeColumn('Users', 'superAdmin');
    } catch (error) {
      console.log('Erro ao remover superAdmin:', error.message);
    }

    try {
      // Reverter ENUM type na tabela Conversations
      await queryInterface.changeColumn('Conversations', 'type', {
        type: Sequelize.STRING,
        allowNull: true
      });

      // Remover o tipo ENUM
      await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "enum_conversations_type";
      `);
    } catch (error) {
      console.log('Erro ao reverter type em Conversations:', error.message);
    }
  }
}; 