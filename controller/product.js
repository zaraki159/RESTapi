const { query } = require('express');
const prisma = require('../config/prisma');

exports.create = async (req, res) => {
    try {
        const { title, description, price, categoryId, quantity, authorId } = req.body;
        console.log(req.body);
        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                authorId: authorId || null,
                categoryId: categoryId
            },
        });
        res.send('Product created successfully');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server create Error" })
    }
}

exports.list = async (req, res) => {
    try {
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt: "asc" },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server list Error" })
    }
}
exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server list Error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { title, description, price, categoryId, quantity, authorId } = req.body;
        console.log(req.body);
        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                authorId: authorId || null,
                categoryId: categoryId
            }
            ,
        });
        res.send(product)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server update Error" })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.send('Delete product successfully')
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Delete Error" })
    }
}

exports.listBy = async (req, res) => {
    try {
        const { sort, orderBy, limit } = req.body
        console.log(req.body)
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: orderBy },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server ListBy Error" })
    }
}

const handleQuery = async (req, res, query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server handleQuery Error" })
    }
}

const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true
            }
        })
        res.send(products)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server handlePrice Error" })
    }
}

const handleCategory = async (req, res, categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))
                }
            },
            include: {
                category: true
            }
        })
        res.send(products)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server handlePrice Error" })
    }
}
exports.searchFilters = async (req, res) => {
    try {
        const { query, category, price } = req.body
        if (query) {
            console.log('query', query)
            await handleQuery(req, res, query)
        }
        if (category) {
            console.log('category', category)
            await handleCategory(req, res, category)
        }
        if (price) {
            console.log('price', price)
            await handlePrice(req, res, price
            )
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server searchFilters Error" })
    }
}

