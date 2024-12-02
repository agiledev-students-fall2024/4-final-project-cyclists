authMiddleware.js
import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
 const token = req.header('Authorization');
  if (!token) {
   return res.status(401).json({ message: 'Access denied, token missing!' });
 }


 try {
   const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
   req.user = decoded;
   next();
 } catch (err) {
   res.status(401).json({ message: 'Invalid token' });
 }
};
