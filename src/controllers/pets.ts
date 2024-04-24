import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getAllPets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pets = await prisma.pet.findMany();
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
}
