const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  // console.log(`Request of activate in the middleware:\n${req.body}`);

  try {

    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error();
    }

    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      throw new Error();
    }

    req.user = userData;
    next();

  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' })
  }

}