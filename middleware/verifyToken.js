import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) res.status(403).json("Invalid Token!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You aren't yet authenticated!!");
  }
};

const verifyTokenandAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
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
