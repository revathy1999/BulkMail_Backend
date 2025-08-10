const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();
app.use(cors());
app.use(express.json());
// install nodemailer
const nodemailer = require("nodemailer");

mongoose.connect("mongodb+srv://rev:123@cluster0.o7w8rhz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("Connected to DB")
)
.catch(()=>console.log("Failed to connect DB")
)
// create model and schema 
// created db name passkey inside we created collection called bulkmail so we need to target that
const credential=mongoose.model("credential",{},"bulkmail")






app.post("/sendmail", function (req, res) {
  var msg = req.body.msg;
  var emaillist = req.body.emaillist;
 credential.find().then((data)=>{
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  service: "gmail",
  auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
});
 new Promise(async function (resolve, reject) {
    try {
      for (var i = 0; i < emaillist.length; i++) {
        await transporter.sendMail({
          from: "revathykarunakaran99@gmail.com",
          to: emaillist[i],
          subject: "Message from bulk mail",
          text: msg,
        });
        console.log("Email sent to: " + emaillist[i]);
      }
      resolve("Success");
    } catch (error) {
      console.log("Error");
      reject("Failed to send");
    }
  })
    .then(() => res.send(true))
    .catch(() => res.send(false));
}
)
.catch(()=>console.log("failed to fetch"))
});
const PORT= process.env.PORT || 5000;
app.listen(PORT, function (req, res) {
  console.log(`Server started on port ${PORT}..`);
});
