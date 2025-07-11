import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Host de Gmail
    port: 587, // Puerto estándar para TLS
    secure: false, // Usar TLS, por lo que es false para 587 (true para 465 SSL)
    auth: {
        user: process.env.CORREO_ENVIO,
        pass: process.env.PASSWORD_CORREO 
    },
    tls: {
        rejectUnauthorized: false
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
    const urlVerificacion = `${process.env.CLIENT_URL}/ConfirmarContrasena?token=${token}`;

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

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de verificación enviado a ${correoDestino}`);
    } catch (error) {
        console.error(`Error al enviar correo de verificación a ${correoDestino}:`, error);
        throw new Error('Error al enviar el correo de verificación.');
    }
};

// Función para enviar el correo de restablecimiento de contraseña.
export const enviarCorreoRestablecimientoContrasena = async (toEmail: string, resetToken: string) => {
    const resetLink = `${process.env.CLIENT_URL}/RecuperarContrasena?token=${resetToken}`;

    try {
        await transporter.sendMail({
            from: `"GameVerse" <${process.env.CORREO_ENVIO}>`,
            to: toEmail,
            subject: 'Solicitud de Restablecimiento de Contraseña - GameVerse', 
            html: `
                <p>Estimado usuario,</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta de GameVerse.</p>
                <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
                <p><a href="${resetLink}">Restablecer mi Contraseña</a></p>
                <p>Este enlace es válido por 1 hora. Si no lo usas en este tiempo, deberás solicitar uno nuevo.</p>
                <p>Si usted no solicitó este restablecimiento, por favor ignore este correo electrónico y su contraseña actual permanecerá sin cambios.</p>
                <p>Gracias,</p>
                <p>El equipo de GameVerse</p>
            `,
        });
        console.log(`Correo de restablecimiento enviado a ${toEmail}`);
    } catch (error) {
        console.error(`Error al enviar correo de restablecimiento a ${toEmail}:`, error); 
        throw new Error('Error al enviar el correo de restablecimiento.');
    }
};