const express = require("express");
const Stripe = require("stripe");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const fs = require("fs");

const generateZip = require("./generateZip");
const sendEmail = require("./sendEmail");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/webhook", async (req, res) => {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const license = session.metadata.license;
        const email = session.customer_email;

        const orderId = `ORD-${dayjs().format("YYYYMMDD")}-${Math.floor(Math.random() * 9000)}`;

        const token = uuidv4();
        const expireAt = Date.now() + 24 * 60 * 60 * 1000;

        generateZip(orderId, license, email);

        const orders = JSON.parse(fs.readFileSync("data/orders.json"));
        orders.push({
            orderId,
            email,
            license,
            token,
            downloads: 0,
            expireAt
        });
        fs.writeFileSync("data/orders.json", JSON.stringify(orders, null, 2));

        sendEmail(email, orderId, token, license);
    }

    res.json({received: true});
});

module.exports = router;