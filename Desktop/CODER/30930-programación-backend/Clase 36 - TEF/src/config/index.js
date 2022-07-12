require('dotenv').config();

const config = {
  PORT: process.env.PORT || 8080,
  GMAIL_EMAIL: process.env.GMAIL_EMAIL,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  GMAIL_NAME: process.env.GMAIL_NAME,
  MONGO_ATLAS_SRV: process.env.MONGO_ATLAS_SRV,
  DESTINATARIO_MAIL_ADMIN: process.env.DESTINATARIO_MAIL_ADMIN,
  TWILIO_CELLPHONE: process.env.TWILIO_CELLPHONE,
  DESTINATARIO_CELU_ADMIN: process.env.DESTINATARIO_CELU_ADMIN,
  TWILIO_ACCOUNT_ID: process.env.TWILIO_ACCOUNT_ID,
  TWILIO_TOKEN: process.env.TWILIO_TOKEN,
  TWILIO_WHATSAPP: process.env.TWILIO_WHATSAPP,
  RUTA_APP: process.env.RUTA_APP
};

module.exports= config
