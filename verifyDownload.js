const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/download", (req, res) => {
    const token = req.query.token;
    const orders = JSON.parse(fs.readFileSync("data/orders.json"));

    const order = orders.find(o => o.token === token);
    if (!order) return res.send("ลิงก์ไม่ถูกต้อง");

    if(Date.now() > order.expireAt)
        return res.send("ลิงก์หมดอายุ");

    if(order.downloads >= 2)
        return res.send("ดาวน์โหลดครบจำนวนแล้ว");

    order.downloads++;
    fs.writeFileSync("data/orders.json", JSON.stringify(orders, null, 2));

    res.download(`downloads/Template-${order.orderId}.zip`);

});

module.exports = router;