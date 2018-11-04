const API_AI_TOKEN = 'd3de28511e974c0c94cc52fd8535ae4b';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAACyVSOGFHEBAC7HhKNHgPyQ9WBlWjXhgQzbSn5WzNTQVJd5JMZA1I6HTGiLTl7SZBRryHFM2cpjqprjxf8j5yd35La1uwcuPS2vGJVDdqZBNgsieWNJSgruR3RlPCOYyjjwgPqQ1Q1ifd1tFEx9hAa7ZCiCVKp1zO4ZAax1kPwZDZD';
const request = require('request');
const oof = require("axios");
let nut = "";

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
 });
};

function setNut(val) {
    nut = val;
}

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, { sessionId: 'crowdbotics_bot' });
    const weggiesURL = 'https://api.wegmans.io/products/search?query=' + message + '&api-version=2018-10-18&subscription-key=a12ce7d680664c7d97017f45412bbc47';

    let nutt;

    oof.get(weggiesURL)

        .then(function (response) {
            oof.get('https://api.wegmans.io' + response['data']['results'][0]['_links'][0]["href"] + '&subscription-key=a12ce7d680664c7d97017f45412bbc47')

                .then(function (reply) {
                    apiaiSession.on('response', (response) => {
                        const result = response.result.fulfillment.speech;
                        var returnStr = '';

                        for (var i in reply['data']['nutrients']) {
                            returnStr = returnStr + JSON.stringify(reply['data']['nutrients'][i]['type']) + ": " + JSON.stringify(reply['data']['nutrients'][i]['quantity']) + '\n';
                        }
                        console.log(returnStr);
                        sendTextMessage(senderId, returnStr);
                    });
                    apiaiSession.on('error', error => console.log(error));
                    apiaiSession.end();
                })

                .catch(function (error) {
                    console.log(error)
                });
        })

        .catch(function (error) {
            console.log(error);
        });

    //apiaiSession.on('response', (response) => {
    //    const result = response.result.fulfillment.speech;
    //    
    //    sendTextMessage(senderId, nut);
    //});
    //apiaiSession.on('error', error => console.log(error));
    //apiaiSession.end();
};