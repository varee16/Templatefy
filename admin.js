const { error } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.query.key !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized"});
    }
        
    const file = path.join(process.cwd(),"data","orders.json");
    const orders = JSON.parse(fs.readFileSync(file,"utf-8"));
    res.json(orders);
});

module.exports = router;