const logger = require('../utils/logging').getLogger('fb_send_api');
const request = require('request');
const constants = require('../utils/constants');

// Sends response messages via the Send API
exports.sendMessage = function sendMessage(sender_psid, message) {
    logger.info('Sending message to ' + sender_psid + ' with body: ' + JSON.stringify(message));
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "text": message
        }
    };
    // Send the HTTP request to the Messenger Platform
    sendRequest(request_body);
};

// Sends response messages via the Send API
exports.sendMessageWithButtons = function sendMessageWithButtons(sender_psid, title, message, buttons) {
    logger.debug('Sending message to %d with body: %s', sender_psid, JSON.stringify(message));
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": title,
                        "subtitle": message,
                        // "image_url": attachment_url,
                        "buttons": buttons,
                    }]
                }
            }
        }
    };
    // Send the HTTP request to the Messenger Platform
    sendRequest(request_body);
};

function sendRequest(request_body) {
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": constants.FB_PAGE_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            // logger.info('SendAPI: Request sent!');
        } else {
            logger.error("Unable to send request: %j", JSON.stringify(err));
        }
    });
}

