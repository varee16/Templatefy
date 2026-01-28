const express = require("express");
const path = require("path")
const fs = require("fs");
const { error } = require("console");

const app = express();

app.use(express.json())

app.use(require("./webhook"));
app.use(require("./verifyDownload"));
app.use(require("./admin"));


app.get("/",(req,res) => {
    res.send("Templatefy system is running 🚀");
});

//==== Admin Page =====
// app.get("/admin", ( req, res) => {
//     if(req.query.key !== process.env.ADMIN_SECRET) {
//         return res.status(401).send("Unauthorized")
//     }

//     res.sendFile(path.join(__dirname, "admin.html"))
// })

//==== API: List Orders ===
app.get("/api/orders", ( req, res) => {
    if(req.query.key !== process.env.ADMIN_SECRET) {
        return res.status(401).json({error: "Unauthorized"})
    }

    const ordersPath = path.join(__dirname,"../data/orders.json")
    const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"))

    res.json(orders)
}) 
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
console.log("Server running on port", PORT));