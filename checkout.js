const express = require("express")
const Stripe = require("stripe")
const router = express.Router()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

router.post("/create-checkout", async(req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [{
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1
            }],
            success_url: `${process.env.BASE_URL}/thankyou.html`,
            cancel_url:`${process.env.BASE_URL}/cancel.html`
        })

        res.json({ url: session.url})
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
})

module.exports = router