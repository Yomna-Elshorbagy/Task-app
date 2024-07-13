import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let [key, token] = req.headers.token.split(" ");
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token", err });

    req.user = decoded;
    next();
  });
};
