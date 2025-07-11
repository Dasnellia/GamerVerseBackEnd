import { Request, Response, NextFunction } from 'express';

export const validarCambioContrasena = (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        res.status(400).json({
            error: 'La nueva contraseña es obligatoria.'
        });
        return; 
    }

    const tieneMayuscula = /[A-Z]/.test(newPassword);
    const tieneMinuscula = /[a-z]/.test(newPassword);
    const tieneNumero = /[0-9]/.test(newPassword);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < 8) {
        res.status(400).json({
            error: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }
    if (!tieneMayuscula) {
        res.status(400).json({
            error: 'La contraseña debe contener al menos una letra mayúscula.'
        });
        return;
    }
    if (!tieneMinuscula) {
        res.status(400).json({
            error: 'La contraseña debe contener al menos una letra minúscula.'
        });
        return;
    }
    if (!tieneNumero) {
        res.status(400).json({
            error: 'La contraseña debe contener al menos un número.'
        });
        return;
    }
    if (!tieneCaracterEspecial) {
        res.status(400).json({
            error: 'La contraseña debe contener al menos un carácter especial (por ejemplo: !@#$%^&*).'
        });
        return;
    }

    next();
};