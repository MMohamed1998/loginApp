import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  let token = req.header("token");
jwt.verify(token,process.env.JWT_KEY,
    async (err, decoded) => {
      if (err) {
        res.json({ message: "Invalid token" });
      } else {
        req.userId = decoded.id;
        next();
      }
    }
  );
};
