// authController.js

import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import generateToken from '../utils/token.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    try {

        const { email, password, name } = req.body

        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegExp.test(email)) {
            return res.status(400).json({ error: "Invalid email " })
        }

        const existEmail = await User.findOne({ email })

        if (existEmail) {
            return res.status(400).json({ error: "email is already exist" })
        }

        if (password.length < 6 || !password) {
            return res.status(400).json({ error: 'Password must have minimum 6 character' })
        }

        if (name.trim() === '' || !name) {
            return res.status(400).json({ error: 'Username is mandatory' })
        }

        const hassedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            password: hassedPassword,
            name
        })

        if (newUser) {
            await newUser.save()
            generateToken(newUser._id, res)
            res.status(201).json(newUser)
        }


    } catch (error) {
        console.log(`Error occured in signup controller: ${error.message}`)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!password || !email) {
            return res.status(400).json({ error: "Both Email and Password are required" })
        }

        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegExp.test(email)) {
            return res.status(400).json({ error: " Invalid Email format" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: " Email does not exist" })
        }



        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Password does not match" })
        }
        else {
            generateToken(user._id, res)
            res.status(200).json({ message: "Login Successful" })
        }


    } catch (error) {
        console.log(`Error occured in login controller: ${error.message}`)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const logout = async (req, res) => {
    try {

        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({ message: "Logout Successful.." })

    } catch (error) {
        console.log(`Error occured in login controller: ${error.message}`)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getMe = async (req, res) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');

        res.status(200).json(user)

    } catch (error) {
        console.log(`Error occured in getMe controller: ${error.message}`)
        res.status(500).json({ error: 'Internal server error' })
    }
}