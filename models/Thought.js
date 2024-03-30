import { DataTypes } from "sequelize";
import { User } from "./User.js";
import db from "../db/conn.js"; 


export const Thought = db.define("Thought", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


Thought.belongsTo(User); 
User.hasMany(Thought);
