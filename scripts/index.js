#!/usr/bin/env node

const { readFile } = require('fs').promises;
const express = require('express');
const app = express();
const ip = require("ip"); 

port    = process.argv[2] || 5000
topic   = process.argv[3] || "/uav_1/ual/set_velocity"
apppath = process.argv[4] || __dirname + "../app/"

console.log(port)
console.log(topic)
console.log(apppath)


// fetch() request callbacks

app.get("/host", (req, res) =>  {
    res.send(ip.address());
}) 

app.get("/topic", (req, res) => { 
    res.send(topic);
}) 


// Server website up 

app.use(express.static(apppath));

app.get('/', async (request, response) => {
    response.send( await readFile("index.html", 'utf8'));
});

app.listen(process.env.PORT || port, () => {
    console.log(`NODE: App available on http://localhost:${port}`)
});





