const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.query.key !== process.env.ADMIN_SECRET)
        return res.send("Unauthorized");

    const orders = JSON.parse(fs.readFileSync("data/orders.json"));
    res.json(orders);
});

module.exports = router;