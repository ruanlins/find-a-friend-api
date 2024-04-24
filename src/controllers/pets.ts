import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function getAllPets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const getAllPetParamsSchema = z.object({
    age: z.string().optional(),
    size: z.string().optional(),
    energy_level: z.string().optional(),
    environment: z.string().optional(),
  });

  const query = getAllPetParamsSchema.parse(req.query);

  try {
    const pets = await prisma.pet.findMany({ where: query });
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
}
