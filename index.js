const logging = require('./utils/logging.js');
const logger = logging.getLogger('index.js');
const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const fbHandler = require('./api/fb_handler.js');
const profileApi = require('./api/fb_profile_api.js');
const constants = require('./utils/constants.js');
const Makao = require('./makao/makao.js');
const makao = new Makao();
const db = require('./db/db').pool;

app.get('/', (req, res) => {
   logger.info('Sending status!');
    res.send(makao.status())
});

app.get('/privacy-policy', (req, res) => {
    res.send(constants.PRIVACY_POLICY);
});

app.post('/webhook', fbHandler.handleWebhookPost);

app.get('/webhook', fbHandler.handleWebhookGet);

app.get('/makao', (req, res) => {
    logger.info("Somebody requested makao!!");
    res.send("ok");
});

app.get('/makao/panic', (req, res) => {
    logger.info("Shutdown all games");
    makao.shutdown();
    res.send("ok");
});

// Get PORT and start the server
// const server = http.createServer(app).listen(8080,  function () {
const server = http.createServer(app).listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, function () {
    logger.info(`===================================`);
    logger.info(`.------..------..------..------..------.`);
    logger.info(`|M.--. ||A.--. ||K.--. ||A.--. ||O.--. |`);
    logger.info(`| (\\/) || (\\/) || :/\\: || (\\/) || :/\\: |`);
    logger.info(`| :\\/: || :\\/: || :\\/: || :\\/: || :\\/: |`);
    logger.info(`| '--'M|| '--'A|| '--'K|| '--'A|| '--'O|`);
    logger.info(`\`------'\`------'\`------'\`------'\`------'`);
    logger.info(`===================================`);
    logger.info(`Listening on port ${process.env.ALWAYSDATA_HTTPD_PORT}`);
    // profileApi.setProfile();
    db.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        logger.info("found user: %s", JSON.stringify(results.rows));
    })
});
