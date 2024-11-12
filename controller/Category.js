const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

exports.create = async (req, res) => {
    try {
        const { name } = req.body
        const category = await prisma.category.create({
            data: {
                name: name
            }
        })
        res.send('Updata Category')
    } catch (err) {
        console.log(err);
        res.status(500).send('Category failed to be created')
    }
}

exports.read = async (req, res) => {
    try {
        const category = await prisma.category.findMany()
        res.send(category)
    } catch (err) {
        console.log(err);
        res.status(500).send('Read failed to be read')
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const category = await prisma.category.delete({
            where: {
                id: Number(id)
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err);
        res.status(500).send('Delete failed to be deleted')
    }
}