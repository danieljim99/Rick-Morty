import request from "request"
import yargs from "yargs"

const endPoint = "https://rickandmortyapi.com/api/character/?";

const view = (error, response) => {
    (response.body.results).forEach((elem) => {
        console.log(`Name: ${elem.name}\nStatus: ${elem.status}\nSpecies: ${elem.species}\nGender: ${elem.gender}\nOrigin: ${elem.origin.name}\nLocation: ${elem.location.name}\n\n`);
    });
    if(response.body.info.next != ""){
        console.log(`\nGoing to page: ${response.body.info.next}\n`);
        request({url: response.body.info.next, json: true}, view);
    }
};

const list = (error, response) => {
    (response.body.results).forEach((elem) => {
        console.log(`${elem.name}`);
    });
    if(response.body.info.next != ""){
        console.log(`\nGoing to page: ${response.body.info.next}\n`);
        request({url: response.body.info.next, json: true}, list);
    };
};

yargs.command({
    command: "list",
    describe: "List characters depending of the parameters",
    builder: {
        search: {
            describe: "Search all characters with that name",
            demandOption: false,
            type: "string",
        },
        status: {
            describe: "Search characters by status",
            demandOption: false,
            type: "string",
        },
    },
    handler: (args) => {
        let url = endPoint;
        if(args.search !== undefined){
            url = `${url}name=${args.search}&`;
        };
        if(args.status !== undefined){
            url = `${url}status=${args.status}`;
        };
        request({url: url, json: true}, list);
    },
});

yargs.command({
    command: "view",
    describe: "Search a character by name",
    builder: {
        name: {
            describe: "The name of the character",
            demandOption: true,
            type: "string",
        },
    },
    handler: (args) => {
        request({url: `${endPoint}name=${args.name}`, json: true}, view);
    },
});

yargs.parse();