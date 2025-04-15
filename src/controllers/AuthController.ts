import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {

    static createAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const { password, email } = req.body

            // Prevenir duplicados
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('El Usuario ya esta registrado')
                res.status(409).json({ error: error.message })
                return;
            }

            // Crea un usuario
            const user = new User(req.body)

            // Hash Password
            user.password = await hashPassword(password)

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa su correo para activar la cuenta')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static login = async (req: Request, res: Response): Promise<void>=> {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({ error: error.message })
                return;
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                // enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
                res.status(401).json({ error: error.message })
                return;
            }

            // Comprobar el password
            const isPasswordCorrect = await checkPassword(password, user.password);
            if(!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                res.status(401).json({ error: error.message })
                return;
            }

            res.send('Autenticado correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({ error: error.message })
                return
            }

            if(user.confirmed) {
                const error = new Error('El Usuario ya esta confirmado')
                res.status(403).json({ error: error.message })
                return;
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({ error: error.message })
                return;
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    
    static validateToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({ error: error.message })
                return
            }
            res.send('Token válido, Define tu nuevo password')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('El password se modificó correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}