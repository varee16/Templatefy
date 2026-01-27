const nodemailer = require("nodemailer");

module.exports = function sendEmail(email, token, license) {
    const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 587,
        auth: {
            user: "resend",
            pass: process.env.RESEND_API_KEY
        }
    });

    transporter.sendMail({
        from: "Templatefy <no-reply@templatefy>",
        to: email,
        subject: `Your Download - Order ${orderId}`,
        html: `
        <p>ขอบคุณที่สั่งซื้อจาก <b>Templatefy</b></p>
        <p>License: ${license}</p>
        <a href="https://your-app.onrender.com/download?token=${token}">
        ดาวน์โหลดไฟล์
        </a>
        <p>ลิงก์หมดอายุ 24 ชม. / ดาวน์โหลดได้ 2 ครั้ง</p>
        `
    });
};