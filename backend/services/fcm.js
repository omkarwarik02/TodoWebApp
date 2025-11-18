const admin = require("../config/firebaseAdmin");

async function sendToken(token,{title,body,data={}}){
    const message = {
        token,
        notification:{title,body},
        data,
    };
    const res = await admin.messaging().send(message);
  console.log("✅ FCM sent:", res);
  return res;
}

module.exports = {sendToken};