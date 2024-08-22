const { client } = require('../config/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');

exports.createOrder = async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'EUR',
                value: req.body.amount
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.status(201).json({ id: order.result.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.captureOrder = async (req, res) => {
    const orderID = req.params.orderID;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);

    try {
        const capture = await client.execute(request);
        res.status(200).json(capture.result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
