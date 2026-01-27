const express = require("express");
const app = express();

app.use(express.json())

app.use(require("./webhook"));
app.use(require("./verifyDownload"));
app.use(require("./admin"));

app.get("/",(req,res) => {
    res.send("Templatefy system is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
console.log("Server running on port", PORT));