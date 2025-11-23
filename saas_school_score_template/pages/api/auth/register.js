import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
}