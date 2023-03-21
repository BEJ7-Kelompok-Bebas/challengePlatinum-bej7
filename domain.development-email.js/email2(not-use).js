// import library
const Sib = require("sib-api-v3-sdk");
require("dotenv").config({ path: ".env" });

// declare Client
defaultClient = Sib.ApiClient.instance;

// declare and authentication api-key from sendinblue
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.DB_NAME;

// create new class to use class for transaction email
const apiInstance = new Sib.TransactionalEmailsApi();
// create new class to use class for SmptEmail
const sendSmtpEmail = new Sib.SendSmtpEmail();

sendSmtpEmail.subject = "testing";
sendSmtpEmail.htmlContent =
  "<html><body><p> Hallo Kami dari BinarApps <p><a href='http://www.google.com'>silahkan konfirmasi disini </a></body></html>";
// sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = {
  name: "Binar-Apps",
  email: "ade.testing123@outlook.com",
};
sendSmtpEmail.to = [{ email: "ademaulana.nin@gmail.com" }];
// sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
// sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
// sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
// sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
// sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
  },
  function (error) {
    console.error(error);
  }
);

// kirim email sudah works
// lanjut masukan dalam register
// lanjut buat route untuk task confirm register after click link in email
