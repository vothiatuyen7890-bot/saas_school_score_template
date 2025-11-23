import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if(!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if(!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ token });
}