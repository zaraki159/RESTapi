const prisma = require("../config/prisma")

exports.changeOrder = async (req, res) => {
    try {
        const { orderId, oderStatus } = req.body
        console.log(orderId, oderStatus)
        const orderUpdate = await prisma.order.updateMany({
            where: {
                id: orderId
            },
            data: {
                oderStatus: oderStatus
            }
        })
        res.json(orderUpdate)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server changeOrder Error' })
    }
}
exports.getOrderAdmin = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                orderByUser: {
                    select: {
                        id: true,
                        email: true,
                        address: true
                    }
                }
            }
        })
        res.json(orders)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server getOrderAdmin Error' })
    }
}