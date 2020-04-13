const Pool = require('pg').Pool
const logger = require('../utils/logging').getLogger('db');
const constants = require('../utils/constants');

const pool = new Pool({
    user: constants.DB_USER,
    host: constants.DB_HOST,
    database: constants.DB_NAME,
    password: constants.DB_PASSWORD,
    port: constants.DB_PORT,
});
exports.pool = pool;