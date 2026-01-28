const express = require("express");
const Stripe = require("stripe");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path")

const generateZip = require("./generateZip");
const sendEmail = require("./sendEmail");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/webhook",
    express.raw({ type: "application/json"}),
    (req, res) => {
        const sig = req.headers["stripe-signature"]

        let event
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            )
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`)
        }


    //จ่ายเงินสำเร็จ
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const license = session.metadata.license;
        const email = session.customer_email;

        const orderId = `ORD-${dayjs().format("YYYYMMDD")}-${Math.floor(Math.random() * 9000)}`;

        const token = uuidv4();
        

        generateZip(orderId, license, email);

        const ordersPath = path.join(__dirname,"data","orders-json")
        const orders = fs.existsSync(ordersPath)
        ? JSON.parse(fs.readFileSync(ordersPath))
        : []

        const now = Date.now()
        const expireAt = now + Number(process.env.DOWNLOAD_EXPIRE_HOURS) * 60 * 60 * 1000

        orders.push({
            orderId: "ORD-" + now,
            email: session.customer_details.email,
            license: "personal",
            downloadCount: 0,
            downloadLimit: 2,
            expireAt
        });
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

        sendEmail(email, orderId, token, license);
    }

    res.json({received: true});
   }
)

module.exports = router;