const crypto = require('crypto');
const hashService = require('../services/hash-service');

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH;
const twilio = require('twilio')(smsSid, smsAuthToken, {
  lazyLoading: true,
})

class OtpSevice {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    try{
      await twilio.messages.create({
        to: `+91${phone}`,
        from: process.env.SMS_FROM_NUMBER,
        body: `Your coderhouse OTP is: ${otp}`
      })
    } catch (err) {
      console.log(err);
    } finally {
      return "success";
    }
  }

  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return computedHash === hashedOtp;
  }
}

module.exports = new OtpSevice();