import jwt from "jsonwebtoken";

const TOKEN_KEY = process.env.TOKEN_KEY;

export const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
    req.tokenIsDecoded = true;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
};
