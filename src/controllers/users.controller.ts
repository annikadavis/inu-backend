import { Router, Response, Request } from 'express'
import User from '../models/user.model'
import ResetToken from '../models/resetToken.model'
import validator from "validator"
import { nanoid } from "nanoid"
import './../helpers/extensions'

export default class UsersController{

    private path = '/users'
    public router = Router()

    constructor() {
        this.router.post(`${this.path}/login`, this.login)
        this.router.post(`${this.path}/create`, this.create)
        this.router.post(`${this.path}/reset-password`, this.resetPassword)
        this.router.post(`${this.path}/fogot-password`, this.fogotPassword)
    }

    public async login(req: Request, res: Response) {

        const { email, password } = req.body

        // Validation
        if (!email || !password) {
            res
              .status(400)
              .json({ error: "One of the required information is missing" })
            return
        }
        else if (!validator.isEmail(email)) {
            res
              .status(400)
              .json({ error: "Please Enter correct email address" })
            return
        }

        // Check if user exists
        const user = await User.findOne({ where: { email, password }})

        if(!user) {
            res
              .status(401)
              .json({ error: "No such user with the provided email and password combination in database" })
            return
        }

        // Send response
        res
          .status(200)
          .json(user)
    }

    public async create(req: Request, res: Response) {

        const { name, email, password } = req.body

        // Validation
        if (!name || !email || !password) {
            res
              .status(400)
              .json({ error: "One of the required information is missing" })
            return
        }
        else if (!validator.isEmail(email)) {
            res
              .status(400)
              .json({ error: "Please Enter correct email address" })
            return
        }

        // Check if user exists
        let user = await User.findOne({ where: { email }})

        if(!user) {
            res
              .status(409)
              .json({ error: `User with email address: ${email} already exists` })
            return
        } else {
            // Create new user
            user = await User.create({ name, email, password })
        }

        // Send response
        res
          .status(201)
          .json({ id: user.id })
    }

    public async resetPassword(req: Request, res: Response) {

        const { newPassword, resetToken, repeatPassword } = req.body

        // Validation
        if (!resetToken || !newPassword || !repeatPassword) {
            res
              .status(400)
              .json({ error: "One of the required information is missing" })
            return
        }

        if (newPassword !== repeatPassword) {
            res
              .status(400)
              .json({ error: "Passwords don't match" })
            return
        }

        // Find token in db
        const token = await ResetToken.findOne({ where: { token: resetToken }})

        if (!token) {
            res
              .status(401)
              .json({ error: "invalid password reset token" })
            return
        }

        await User.update({ password: newPassword }, { where: { email: token.email }})
        await ResetToken.destroy({ where: { id: token.id }})

        res
          .status(200)
          .json({ message: "your password has been reset" });
    }

    public async fogotPassword(req: Request, res: Response) {

        const { email, name } = req.body

        // Validation
        if (!email || !name) {
            res
              .status(400)
              .json({ error: "One of the required information is missing" })
            return
        }
        if (!validator.isEmail(email)) {
            res
              .status(400)
              .json({ error: "Please Enter correct email address" })
            return
        }

        // Check if user exists
        const user = await User.findOne({ where: { email }})

        if(!user) {
            res
              .status(409)
              .json({ error: `User with email address: ${email} doesn't exist` })
            return
        }

        // Generate token
        const token: string = nanoid();
        await ResetToken.create({ email: user.email, token})

       // Prepare email

        // //  This link should go to a front-end which has a form,
        // // and it should send the reset token along with the new password to /user/reset-password as seen below on line 179.
        // // NOTE: when you are on browser (front-end) you can get the query param using this:
        // // const urlParams = new URLSearchParams(window.location.search);
        // // const resetToken = urlParams.get('token');
        // const frontEndURL = process.env.FRONT_END_URL // I put localhost:3000 because thats the default address for a react app.
        // const resetLink = `${frontEndURL}/user/reset-password?token=${token}`;

        // const message = {
        //     to: email, // where to send
        //     from: "automailsenderrobot@gmail.com", // this is a new email I created, not something magic. I just named it like this.
        //     subject: "password reset link for INU HEALTH",
        //     html: `<p>Your password reset link: <a href="${resetLink}">${resetLink}</a> </p>`,
        // };

        // // Send email using sendgrid.
        // await mail.send(message);

        // Send response
        res.status(200).json({token})
    }
}