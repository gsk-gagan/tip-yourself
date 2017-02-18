module.exports = function(sequelize, DataTypes) {
    return sequelize.define('source', {
        sourcecode : {
            type: DataTypes.STRING,     //This is used to vaguely-uniquely identify the source. For India Spend we will have imei
            allowNull: false,
            unique: true
        },
        sourcetype : {
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