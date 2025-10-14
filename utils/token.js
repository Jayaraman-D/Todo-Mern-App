// token.js

import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    try {

        const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '15d' });
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('jwt', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? 'None' :'Lax',
            secure: isProduction,
            path:'/',
        })

    } catch (error) {
        console.log(`Error occured in genereate token: ${error.message}`)
        res.status(500).json({ error: "Internal server error" })
    }
}

export default generateToken