const express = require('express')
const router = express.Router()
const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Prisma } = require('@prisma/client')

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password);
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" })
        }
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {
            return res.status(400).json({ message: 'Email already' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })
        res.send('Registers successfully')
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Sever  Register Errors" })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user || !user.enabled) {
            return res.status(400).json({ message: 'User not enabled or no found' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Password  Invalid' })
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: 'Server Error' })
            }
            res.json({ payload, token })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Sever Login Error" })
    }

}

exports.currentUser = async (req, res) => {
    try {
        res.send('hello currentUser controller')
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Sever cerrentUser Error" })
    }
}
