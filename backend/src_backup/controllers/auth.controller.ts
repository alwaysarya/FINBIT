import { Request, Response } from 'express';

// Dummy user for now (Baad mein Database aayega)
const users = [
  { id: 'usr_1', email: 'admin@finbit.com', password: 'password123', name: 'Aryan Thakur' }
];

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'error', message: 'Email and password are required' });
      return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }

    // TODO: Generate JWT Token (Standard 8: Security)
    const token = 'temp-jwt-token-xyz';

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
