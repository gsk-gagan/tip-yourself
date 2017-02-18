module.exports = function(sequelize, DataTypes) {
    return sequelize.define('india-spend-crawler', {
        imei : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        lat : {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: -1.0
        },
        lng : {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: -1.0
        }
    });
};