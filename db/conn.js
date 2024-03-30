import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

// const { DATABASE, USER, PASSWORD, HOST, DIALECT } = process.env;
const { PGSTRING } = process.env; 
const sequelize = new Sequelize( PGSTRING, { dialect: "postgres" }); 


// try {
//     sequelize.authenticate();
//     console.log("Successfully connected.");
// } catch (error) {
//     console.log("Connection failure.");
//     console.log(error);
// }

export default sequelize; 