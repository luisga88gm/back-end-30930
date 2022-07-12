const config= require('../config/index');
const nodemailer= require('nodemailer');
const {logger, loggeoPeticiones} = require('./logger');


class Email {
  owner;
  transporter;

  constructor() {
    this.owner = {
      name: config.GMAIL_NAME,
      address: config.GMAIL_EMAIL,
    };

    this.transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:465,
      secure:true,
      auth: {
        user: config.GMAIL_EMAIL,
        pass: config.GMAIL_PASSWORD,
      },
    });

    this.transporter.verify().then(() => logger.info('Servicio de Email listo!'));
  }

  async sendEmail(dest, subject, content) {
    const mailOptions = {
      from: this.owner,
      to: dest,
      subject,
      html: content,
    };

    const response = await this.transporter.sendMail(mailOptions);
    logger.info(`Email enviado a ${dest}`)
    return response;
  }
}

const EmailService = new Email();

module.exports=EmailService;
