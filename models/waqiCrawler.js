module.exports = function(sequelize, DataTypes) {
    return sequelize.define('waqi-crawler', {
        x : {
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
        },
        aqi : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        },
        readTime : {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
};
