// {"first_name":"Faceook",
// "last_name":"Invigilation",
// "profile_pic":"https:\/\/scontent.xx.fbcdn.net\/v\/t31.0-1\/p720x720\/10733713_10150004552801937_4553731092814901385_o.jpg?_nc_cat=1&_nc_sid=12b3be&_nc_ohc=zX6Oan9FVnIAX9uTAlM&_nc_ht=scontent.xx&_nc_tp=6&oh=2c58b93eebfde405735a1386314da561&oe=5E998EE1",
// "id":"2952509728138624"}
const logger = require('../utils/logging.js').getLogger('fb_profile_api.js');
const request = require('request');
const constants = require('../utils/constants.js');

exports.getProfile = function getProfile(psid, player) {
    request({
        "uri": "https://graph.facebook.com/" + psid,
        "qs": {"access_token": constants.FB_PAGE_TOKEN, "fields": "first_name,last_name"},
        "method": "GET",
    }, (err, res, body) => {
        if (!err) {
            player.profile = JSON.parse(body);
        } else {
            logger.error("Unable to send request: %j", JSON.stringify(err));
            player.profile = null;
        }
    });
};

exports.setProfile = function setProfile() {
    logger.info("Calling Messenger Profile API to set: %j", Object.keys(constants.PROFILE));
    request({
        "uri": "https://graph.facebook.com/me/messenger_profile",
        "qs": {"access_token": constants.FB_PAGE_TOKEN},
        "method": "POST",
        "json": constants.PROFILE
    }, (err, res, body) => {
        if (!err) {
            logger.info("Profile set result: %s", JSON.stringify(res.body));
        } else {
            logger.error("Unable to send request: %s", JSON.stringify(err));
        }
    })
};