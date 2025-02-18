import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const UserWorkspace = sequelize.define('UserWorkspace', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        workspaceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Workspaces',
                key: 'id'
            }
        },
        role: {
            type: DataTypes.ENUM('owner', 'admin', 'user'),
            allowNull: false,
            defaultValue: 'user'
        }
    }, {
        tableName: 'UserWorkspaces',
        timestamps: true
    });

    return UserWorkspace;
}; 