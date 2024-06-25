const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Crear un nuevo cliente de WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Generar el código QR para la autenticación
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escanea este código QR con tu aplicación de WhatsApp.');
});

// Log cuando el cliente está autenticado
client.on('authenticated', () => {
  console.log('Autenticado con éxito');
});

// Log cuando el cliente está listo para usar
client.on('ready', () => {
  console.log('Cliente está listo');
});

// Manejar errores
client.on('auth_failure', (msg) => {
  console.error('Falló la autenticación:', msg);
});

client.on('disconnected', (reason) => {
  console.log('Cliente desconectado:', reason);
});

// Inicializar el cliente
client.initialize();

module.exports = client;