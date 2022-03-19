const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "masud7827@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me you how you get along with the app`,
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "masud7827@gmail.com",
    subject: "Please provide feedback!",
    text: `Sorry to hear that you are cancelling your account, ${name}. Is there anything we could have done to serve better?`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
