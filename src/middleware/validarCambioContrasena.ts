// src/middlewares/validarCambioContrasena.ts

import { Request, Response, NextFunction } from 'express';

export const validarCambioContrasena = (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        // CORRECCIÓN: Llamas a res.status().json() y luego usas 'return;'
        res.status(400).json({
            error: 'La nueva contraseña es obligatoria.'
        });
        return; // Sale de la función después de enviar la respuesta
    }

    const tieneMayuscula = /[A-Z]/.test(newPassword);
    const tieneMinuscula = /[a-z]/.test(newPassword);
    const tieneNumero = /[0-9]/.test(newPassword);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < 8) {
        // CORRECCIÓN: Llamas a res.status().json() y luego usas 'return;'
        res.status(400).json({
            error: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }
    if (!tieneMayuscula) {
        // CORRECCIÓN: Llamas a res.status().json() y luego usas 'return;'
        res.status(400).json({
            error: 'La contraseña debe contener al menos una letra mayúscula.'
        });
        return;
    }
    if (!tieneMinuscula) {
        // CORRECCIÓN: Llamas a res.status().json() y luego usas 'return;'
        res.status(400).json({
            error: 'La contraseña debe contener al menos una letra minúscula.'
        });
        return;
    }
    if (!tieneNumero) {
        // CORRECCIÓN: Llamas a res.status().json() y luego usas 'return;'
        res.status(400).json({
            error: 'La contraseña debe contener al menos un número.'
        });
        return;
    }
    if (!tieneCaracterEspecial) {
        // CORRECCIÓN: Llamas a res.status().json() y luego usas 'return;'
        res.status(400).json({
            error: 'La contraseña debe contener al menos un carácter especial (por ejemplo: !@#$%^&*).'
        });
        return;
    }

    // Si todas las validaciones pasan, se llama a la siguiente función middleware o al controlador
    next();
};