import { Request, Response, NextFunction } from 'express';
import { Petshop } from '../models/petshop';
import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      petshop?: Petshop;
    }
  }
}

const prisma = new PrismaClient();

export async function checkExistsUserAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { cnpj } = req.headers;

  if (!cnpj || typeof cnpj !== 'string') {
    res.status(400).json({ error: 'CNPJ é obrigatório e deve ser uma string' });
    return;
  }

  try {
    const petshop = await prisma.petshop.findFirst({
      where: { cnpj },
      include: {
        pets: true,
      },
    });

    if (!petshop) {
      res.status(404).json({ error: 'Petshop não encontrado' });
      return;
    }

    req.petshop = petshop;
    next();
  } catch (error) {
    console.error('Erro ao verificar petshop:', error);
    res.status(500).json({ error: 'Erro ao verificar petshop' });
  }
}
