const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieVal = req.cookies[cookieName];

    if (!tokenCookieVal) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieVal);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}
module.exports = {
  checkForAuthenticationCookie,
};
