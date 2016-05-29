#!/usr/bin/env node

const logger = require('winston');
logger.level = "debug";

const HOST_PREFIX = process.env.HOST_PREFIX || "http://api.stutzthings.com";

var Hapi = require("hapi");
var server = new Hapi.Server();

server.connection({port: 3000});

//DEVICE REGISTRATION ENDPOINT
server.route({
  method: "POST",
  path: "/v1/{account_id}/{device_name}",
  handler: function(req, reply) {
    logger.debug("Registering new device instance");
    logger.debug("account_password="+ req.payload.account_password + "; custom_name=" + req.payload.custom_name);
    //FIXME fake for now. implement!
    //TODO use https://github.com/krakenjs/swaggerize-hapi in the future

    const username = req.params.account_id;
    const password = req.payload.account_password;
    const custom_name = req.payload.custom_name;

    if(username=="test" && password=="test") {
      const randomId = Math.floor((Math.random() * 999999) + 1);
      const deviceInstance = {
        id: randomId,
        access_token: {client_id:randomId, scopes: ["i:"+randomId+":wr"]},
        mqtt: {
          host: "mqtt.stutzthings.com",
          port: 1883,
          ssl: false,
          base_topic: "resources/"+ req.params.account_id +"/"+ req.params.device_name +"/" + randomId
        },
        ota: {
          enabled: true,
          host: "ota.stutzthings.com",
          port: 80,
          path: "/ota/tracker",
          ssl: false,
        }
      };
      reply(deviceInstance)
        .code(201)
        .header("Location", HOST_PREFIX = "/resources/" + req.params.account_id + "/" + req.params.device_name + "/" + randomId);

    } else {
      reply({message:"Invalid username/password"}).code(401);
    }
  }
});

server.route({
  method: "*",
  path: "/{p*}",
  handler: function (req, reply) {
    return reply({message:"Resource not found"}).code(404);
  }
});

server.start(function(){ // boots your server
  console.log("stutzthings-registration started on port 3000");
});

module.exports = server;
