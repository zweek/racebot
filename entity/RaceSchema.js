const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Race = require("../model/Race").Race; // import {Post} from "../model/Post";
const Racer = require("../model/Racer").Racer; // import {Category} from "../model/Category"


module.exports = new EntitySchema({
    name: "Race",
    target: Race,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        active: {
            type: "boolean"
        },
    },
    relations: {
        racers: {
            target: "Racer",
            type: "many-to-many",
            joinTable: true,
            cascade: true
        }
    }
});