import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization ?? req.headers.token;
  const match = typeof header === "string" && /^Bearer ([^\s]+)$/i.exec(header);
  if (!match) return res.status(401).json("Authentication required");

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(403).json("Invalid token");
  }

  next();
};

const verifyTokenandAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === (req.params.id ?? req.params.userId) || req.user.isAdmin) {
      next();
      // if user Id = params id or if user is certified as an admin, continue
    } else {
      res.status(403).json("You aren't authorized to do that");
    }
  });
};

const verifyTokenandAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
      // if user Id = params id or if user is certified as an admin, continue
    } else {
      res.status(403).json("You aren't authorized to do that");
    }
  });
};

export { verifyToken, verifyTokenandAuthorization, verifyTokenandAdmin };
