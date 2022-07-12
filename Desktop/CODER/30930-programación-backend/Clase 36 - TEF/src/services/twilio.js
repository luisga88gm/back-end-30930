const Config=require('../config/index');
const twilio=require('twilio');
const {logger,  loggeoPeticiones} = require('./logger');


class Twilio {
  twilio;

  constructor() {
    this.twilio = twilio(Config.TWILIO_ACCOUNT_ID, Config.TWILIO_TOKEN);
  }

  async sendWhatsAppMessage(celuDestino, mensaje) {
    const params = {
      body: mensaje,
      from: `whatsapp:${Config.TWILIO_WHATSAPP}`,
      to: `whatsapp:${celuDestino}`,
    };

    const response = await this.twilio.messages.create(params);
    logger.info(`Mensaje de Whatsapp enviado a ${celuDestino}`)
    return response;
  }

  async sendSMSMessage(celudestino, mensaje) {
    const params = {
      body: mensaje,
      from: Config.TWILIO_CELLPHONE,
      to: celudestino,
    };
    const response = await this.twilio.messages.create(params);
    logger.info(`Mensaje SMS enviado a ${celudestino}`)
    return response;
  }
}

const TwilioService = new Twilio();

module.exports=TwilioService;