const logging = require('../utils/logging.js');
const logger = logging.getLogger('fb_handler.js');
const constants = require('../utils/constants.js');
const MakaoCommandInterface = require('../makao/makaoCommandInterface.js');
const sendApi = require('./fb_send_api.js');
const makaoCommandInterface = new MakaoCommandInterface();

exports.handleWebhookGet = function handleWebhookGet(req, res) {
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === constants.VERIFY_TOKEN) {
            logger.info('Token verified');
            // Responds with the challenge token from the request
            res.status(200).send(challenge);
        } else {
            logger.error('Token verification failed');
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

exports.handleWebhookPost = function handleWebhookPost(req, res) {
    let body = req.body;
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            try {
                handleWebhookEvent(entry);
            } catch (e) {
                logger.error(e);
                logger.error("Error occured after this event: %s", JSON.stringify(entry));
                // sendApi.sendMessage(entry.messaging[0].sender.id, "Chatbot obraził się, obraził Ciebie (tutaj tego nie powtórzę), wyszedł z domu i nie odbiera telefonów.  ")
                sendApi.sendMessage(entry.messaging[0].sender.id, "Bot napotkał błąd. Spróbuj ponownie... za 24h :p ¯\\_(ツ)_/¯")
            } finally {
                // Returns a '200 OK' response to all requests
                res.status(200).send('EVENT_RECEIVED');
            }
        });

    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

function handleWebhookEvent(entry) {
    // Gets the body of the webhook event
    let webhook_event = entry.messaging[0];
    // Get the sender PSID
    let sender_psid = webhook_event.sender.id;
    // Check if the event is a message or postback and
    // pass the event to the appropriate handler function
    if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
    } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
    }
}

function handleMessage(sender_psid, received_message) {
    if (received_message.is_echo) {
        logger.info("Message from %d is an echo, so it was ommited", sender_psid);
    } else {
        makaoCommandInterface.handleMessage(sender_psid, received_message.text);
    }
}

function handlePostback(sender_psid, received_postback) {
    logger.info('Received postback! User ' + sender_psid + ' ,message ' + JSON.stringify(received_postback));
    if (received_postback.payload === constants.GET_STARTED_PAYLOAD) {
        makaoCommandInterface.handleMessage(sender_psid, "Rozpocznij");
    }
}
