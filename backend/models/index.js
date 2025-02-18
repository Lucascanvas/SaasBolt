import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

import UserModel from './User.js';
import MessageModel from './message.js';
import ConversationModel from './conversation.js';
import ConversationParticipantsModel from './conversationParticipants.js';
import WorkspaceModel from './Workspace.js';
import UserWorkspaceModel from './UserWorkspace.js';
import WorkspaceModuleModel from './workspaceModule.js';
import InstanceModel from './instance.js';
import CampaignModel from './campaign.js';
import MessageCampaignModel from './messageCampaign.js';
import RecipientModel from './recipient.js';
import MessageHistoryModel from './messageHistory.js';
import PasswordResetTokenModel from './passwordResetToken.js';
import SgaCredentialsModel from './sgaCredentials.js';

const db = {
  sequelize,
  Sequelize,
  User: UserModel(sequelize),
  Message: MessageModel(sequelize),
  Conversation: ConversationModel(sequelize),
  ConversationParticipants: ConversationParticipantsModel(sequelize),
  Workspace: WorkspaceModel(sequelize),
  UserWorkspace: UserWorkspaceModel(sequelize),
  WorkspaceModule: WorkspaceModuleModel(sequelize),
  Instance: InstanceModel(sequelize),
  Campaign: CampaignModel(sequelize),
  MessageCampaign: MessageCampaignModel(sequelize),
  Recipient: RecipientModel(sequelize),
  MessageHistory: MessageHistoryModel(sequelize),
  PasswordResetToken: PasswordResetTokenModel(sequelize),
  SgaCredentials: SgaCredentialsModel(sequelize)
};

// Chama o método associate de cada modelo
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
