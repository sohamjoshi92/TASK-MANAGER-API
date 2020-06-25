const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'sohamjoshi92@gmail.com',
        subject : 'Welcome to the Task App',
        text : `Welcome to the Task App, ${name}.`
    })
}

const sendDeletionEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'sohamjoshi92@gmail.com',
        subject : 'Thank you for using the Task App !',
        text : `It was great having you with us, ${name}. Do provide your valuable feedback`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeletionEmail
}

// sendWelcomeEmail('16bit103@nirmauni.ac.in','Soham')