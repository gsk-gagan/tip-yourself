module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        homeaddress: {
            type: DataTypes.STRING
        },
        officeaddress: {
            type: DataTypes.STRING
        },
        avgmnthspending: {
            type: DataTypes.INTEGER
        },
        mintip: {
            type: DataTypes.FLOAT
        },
        maxtip: {
            type: DataTypes.FLOAT
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [7,100]
            }
        },
        authtoken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tokenvalidtill: {
            type: DataTypes.DATE
        }
    });
};

