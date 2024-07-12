const { Resend } = require('resend'); 
require('dotenv').config();

const resend = new Resend({
  apiKey: process.env.RESEND_API_KEY
});

const sendEmail = async (to, subject, text) => {
  const emailData = {
    from: process.env.RESEND_VERIFIED_EMAIL,
    to: to,
    subject: subject,
    text: text
  };

  try {
    const response = await resend.emails.send(emailData);
    console.log('Email response: client', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error al enviar correo 2 :', error); 
    throw new Error(`Error al enviar correo 3: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};