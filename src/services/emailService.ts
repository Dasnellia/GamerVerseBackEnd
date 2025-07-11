import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_ENVIO,
    pass: process.env.PASSWORD_CORREO
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error al conectar con Gmail:', error);
  } else {
    console.log('📬 Servidor Gmail listo para enviar correos');
  }
});

export const enviarCorreoVerificacion = async (correoDestino: string, token: string) => {
  const urlVerificacion = `http://localhost:5173/ConfirmarContrasena?token=${token}`;

  const mailOptions = {
    from: `"GameVerse" <${process.env.CORREO_ENVIO}>`,
    to: correoDestino,
    subject: 'Confirma tu cuenta en GameVerse 🎮',
    html: `
      <h2>¡Bienvenido a GameVerse!</h2>
      <p>Gracias por registrarte. Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
      <a href="${urlVerificacion}" style="background-color:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Confirmar mi cuenta</a>
      <p>O usa este código: <strong>${token}</strong></p>
      <small>Si no te registraste, puedes ignorar este mensaje.</small>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const enviarCorreoCompra = async (correoDestino: string, juegos: any[]) => {
  const claves = juegos.map(juego => `<p><strong>${juego.nombre}</strong>: ${juego.clave}</p>`).join('');

  const mailOptions = {
    from: `"GameVerse" <${process.env.CORREO_ENVIO}>`,
    to: correoDestino,
    subject: 'Tu compra de juegos en GameVerse 🎮',
    html: `
      <h2>Gracias por tu compra en GameVerse</h2>
      <p>A continuación, te enviamos las claves de los juegos que adquiriste:</p>
      ${claves}
      <small>Si no realizaste esta compra, por favor contacta con nosotros.</small>
    `
  };

  await transporter.sendMail(mailOptions);
};