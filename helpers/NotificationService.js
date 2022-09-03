const config = require('../common/common');
const client = require('twilio')(config.twilo.TWILIO_SID, config.twilo.TWILIO_AUTH);


exports.sentMessageViaTwilio = async (msg, country_code, phone_number) => {
    try {
        await client.messages.create({
            body: msg,
            messagingServiceSid: config.twilo.TWILIO_SID,
            to: country_code + phone_number,
        })

    } catch (e) {
        throw new Error(e.message)
    }
}