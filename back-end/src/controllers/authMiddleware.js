import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    console.error('Authorization header missing'); 
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // Attach the user information to the request
    console.log('Decoded JWT:', decoded); 
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err); 
    res.status(401).json({ message: 'Invalid token' });
  }
};
