const logging = require('./utils/logging');
const logger = logging.getLogger('index');
const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const fbHandler = require('./api/fb_handler');
const profileApi = require('./api/fb_profile_api');
const constants = require('./utils/constants');
const Makao = require('./makao/makao');
const makao = new Makao();
const db = require('./db/db').pool;
const basicAuth = require('express-basic-auth');
const router1 = express.Router();
const router2 = express.Router();

let adminUsers = [];
adminUsers[constants.ADMIN_USERNAME] = constants.ADMIN_PASSWORD;

let adminAuth = basicAuth({
    "users": adminUsers
});

router2.get('/', (req, res) => {
   logger.info('Sending status!');
    res.send(makao.status())
});

router1.get('/privacy-policy', (req, res) => {
    res.send(constants.PRIVACY_POLICY);
});

router1.post('/webhook', fbHandler.handleWebhookPost);

router1.get('/webhook', fbHandler.handleWebhookGet);

router2.get('/makao', (req, res) => {
    logger.info("Somebody requested makao!!");
    res.send("ok");
});

router2.get('/profile', (req, res) => {
    logger.info("Somebody requested profile!!");
    profileApi.setProfile();
    res.send("ok");
});

router2.get('/panic', (req, res) => {
    logger.info("Shutdown all games");
    makao.shutdown();
    res.send("ok");
});

app.use('/', router1);
app.use('/makao', adminAuth, router2);

const server = http.createServer(app).listen(constants.HOST_PORT, constants.HOST_IP, function () {
    printBanner();
    logger.info(`Listening on port ${constants.HOST_PORT}`);
    // if(constants.DB_HOST !== undefined) {
    //     db.query('SELECT * FROM users', (error, results) => {
    //         if (error) {
    //             throw error
    //         }
    //         logger.info("found user: %s", JSON.stringify(results.rows));
    //     });
    // }
    // process.stdin.resume();
    // process.on('SIGTERM', () => {
    //     logger.warn('Received SIGTERM.');
    // });
});

function printBanner(){
    logger.info(`===================================`);
    logger.info(`.------..------..------..------..------.`);
    logger.info(`|M.--. ||A.--. ||K.--. ||A.--. ||O.--. |`);
    logger.info(`| (\\/) || (\\/) || :/\\: || (\\/) || :/\\: |`);
    logger.info(`| :\\/: || :\\/: || :\\/: || :\\/: || :\\/: |`);
    logger.info(`| '--'M|| '--'A|| '--'K|| '--'A|| '--'O|`);
    logger.info(`\`------'\`------'\`------'\`------'\`------'`);
    logger.info(`===================================`);
}
