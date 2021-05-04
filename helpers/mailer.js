var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = {
    sendEmailVerify: (mailOptions) => transporter.sendMail(mailOptions, function(error, info){
        if (error) { 
            console.log(error)
        } else {
            console.log('A verification email has been sent to ' 
                                            + mailOptions.to 
                                            + '. It will be expire after one day. If you not get verification Email click on resend token.');
        }
    }),
    sendEmailResetPassword: (mailOptions) => transporter.sendMail(mailOptions, function(error, info){
        if (error) { 
            console.log(error)
        } else {
            console.log('A verification email has been sent to ' 
                                            + mailOptions.to 
                                            + '. It will be expire after one day. If you not get verification Email click on resend token.');
        }
    }),
}
