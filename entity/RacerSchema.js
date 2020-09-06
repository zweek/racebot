const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Racer = require("../model/Racer").Racer; // import {Post} from "../model/Post";


module.exports = new EntitySchema({
    name: "Racer",
    target: Racer,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        time: {
            type: "int"
        },
        discorduser: {
            type: "blob"
        }
    },
});