const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: "aliaminidrees@gmail.com",
        pass: "stpceezonedlkmsu",
    },
    tls: {
        rejectUnauthorized: false
    }
});
function info(text, subject, userEmail, html) {
    try {
        transporter.sendMail({
            from: 'aliaminidrees@gmail.com',
            to: userEmail,
            subject: subject, 
            text: text,
            html: html
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

module.exports = info

