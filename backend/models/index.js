import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

import UserModel from './user.js';
import MessageModel from './message.js';
import ConversationModel from './conversation.js';
import ConversationParticipantsModel from './conversationParticipants.js';
import WorkspaceModel from './workspace.js';
import UserWorkspaceModel from './UserWorkspace2.js';
import WorkspaceModuleModel from './workspaceModule.js';
import InstanceModel from './instance.js';
import CampaignModel from './campaign.js';
import MessageCampaignModel from './messageCampaign.js';
import RecipientModel from './recipient.js';
import MessageHistoryModel from './messageHistory.js';
import PasswordResetTokenModel from './passwordResetToken.js';
import SgaCredentialsModel from './sgaCredentials.js';

const models = {
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

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize };
export default models;
