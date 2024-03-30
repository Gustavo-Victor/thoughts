import { DataTypes } from "sequelize";
import db from "../db/conn.js"; 


export const User = db.define("User", {
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



