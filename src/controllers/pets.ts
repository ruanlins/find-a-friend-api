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

export async function registerPet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const registerPetParamsSchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.string(),
    size: z.string(),
    energy_level: z.string(),
    environment: z.string(),
  });

  const { name, age, size, energy_level, environment, about } =
    registerPetParamsSchema.parse(req.body);

  try {
    const pet = await prisma.pet.create({
      data: {
        name,
        age,
        size,
        energy_level,
        environment,
        about,
        org_id: req.session.orgId!,
      },
    });
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
}
