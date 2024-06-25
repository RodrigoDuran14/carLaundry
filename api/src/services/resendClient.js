const {Resend} = require('resend'); // Asegúrate de que 'resend' esté correctamente instalado y requerido.
require('dotenv').config();

const resend = new Resend({
  apiKey: process.env.RESEND_API_KEY // Reemplaza 'tu-api-key' con tu clave de API real.
});

const sendEmail = async (to, subject, text) => {
  const emailData = {
    from: process.env.RESEND_VERIFIED_EMAIL, // Reemplaza con tu dirección de correo.
    to: to,
    subject: subject,
    text: text
  };

  try {
    const response = await resend.emails.send(emailData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al enviar correo: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};