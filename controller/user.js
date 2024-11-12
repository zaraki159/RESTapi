const prisma = require('../config/prisma');

exports.listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address: true
            }
        })
        res.send(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const { id, enabled } = req.body
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                enabled: enabled
            }
        })
        res.send('Updated User Status Successfully')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server change-status Error" })
    }
}

exports.changeRole = async (req, res) => {
    try {
        const { id, role } = req.body
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                role: role
            }
        })
        res.send('Updated Role User Successfully')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server change-role Error" })
    }
}

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body
        console.log(cart)
        console.log(req.user.id)
        const user = await prisma.user.findFirst({
            where: {
                id: Number(req.user.id)
            }
        })
        await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    orderByUserId: user.id
                }
            }
        })
        await prisma.cart.deleteMany({
            where: {
                orderByUserId: user.id
            }
        })
        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))
        let cartTotal = products.reduce((sum, item) =>
            sum + item.price * item.count, 0)
        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: cartTotal,
                orderByUserId: user.id
            }
        })
        console.log(newCart)
        res.send('Updated cart')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server userCard Error" })
    }
}

exports.getuserCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                orderByUserId: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        croduct: true
                    }
                }
            }
        })
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server getuserCard Error" })
    }
}

exports.deleteuserCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                orderByUserId: Number(req.user.id)
            }
        })
        if (!cart) {
            return res.status(404).json({ message: "No Cart" })
        }
        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.id
            }
        })
        const result = await prisma.cart.deleteMany({
            where: {
                orderByUserId: Number(req.user.id)
            }
        })
        res.json({
            message: "Deleted Cart Successfully",
            count: result.count
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server deleteuserCard Error" })
    }
}

exports.Address = async (req, res) => {
    try {
        const { address } = req.body
        console.log(address)
        const addressUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        })
        res.json({ message: 'address updated success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Address Error" })
    }
}

exports.saveOder = async (req, res) => {
    try {
        const userCard = await prisma.cart.findFirst({
            where: {
                orderByUser: {
                    id: Number(req.user.id)
                }
            },
            include: {
                products: true
            }
        })
        if (!userCard || userCard.products.length === 0) {
            return res.status(404).json({ message: "No Cart" })
        }
        for (var item of userCard.products) {
            console.log(item)
            const product = await prisma.product.findUnique({
                where: {
                    id: item.productId
                },
                select: {
                    quantity: true,
                    title: true
                }
            })
            if (!product || item.count > product.quantity) {
                return res.status(400).json({
                    message: `Sorry, the product ${product?.title || 'product'} out of stock `
                })
            }
        }
        const order = await prisma.order.create({
            data: {
                products: {
                    create: userCard.products.map((item) => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price
                    }))
                },
                orderByUser: {
                    connect: { id: req.user.id }
                },
                cartTotal: userCard.cartTotal
            }
        })
        const update = userCard.products.map((item) => ({
            where: {
                id: item.productId
            },
            data: {
                quantity: { decrement: item.count },
                sold: { increment: item.count }
            }
        }))
        console.log(update)

        await Promise.all(
            update.map((updated) => prisma.product.update(updated))
        )
        await prisma.cart.deleteMany({
            where: {
                orderByUserId: Number(req.user.id)
            }
        })
        res.json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server saveOder Error" })
    }
}

exports.getUser = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            // where: { orderByUserId: Number(req.user.id) },
            // include: {
            //     products: {
            //         include: {
            //             product: true
            //         }
            //     }
            // }
        })
        if (orders.length === 0) {
            return res.status(404).json({ message: "No Orders" })
        }
        console.log(orders)
        res.send(orders)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server getUser Error" })
    }
}