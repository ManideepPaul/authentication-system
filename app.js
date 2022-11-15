// import * as dotenv from 'dotenv'
// dotenv.config()

import express from "express";
import User from './model/user.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Connect from './config/database.js';
Connect()

import auth from "./middleware/auth.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("<h1>Hello from the auth system - LCO</h1>")
})


app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!(firstname && lastname && email && password)) {
            res.status(400).send('All feilds are required')
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(401).send("User already exist")
        }

        const myEncPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: myEncPassword,
        })

        // Token creation
        const token = jwt.sign(
            {
                user_id: user._id
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '2h'
            }
        )

        user.token = token
        // You can choose to update it on DB

        user.password = undefined;

        // Send token or send just success yes and redirect - choice
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) res.status(400).send("Field is missing")

        const user = await User.findOne({ email })

        if (!user) res.status(400).send("Email is not registered")

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id },
                process.env.SECRET_KEY,
                { expiresIn: "2h" }
            )
            user.token = token;
            user.password = undefined;
            // res.status(200).json(user)

            // If you want to use cookies
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true, // This will make sure cookies can only accessed by backendserver only
            }

            res.status(200).cookie('token', token, options)
        }

        res.send(400).send("email or password is incorrect")

    } catch (error) {
        console.log(error)
    }
})

app.get("/dashboard", auth, (req, res) => {
    res.status(200).send("Welcome to secret information")
})
export default app;