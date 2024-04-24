import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import createHttpError from 'http-errors';
import { compare, hash } from 'bcrypt';

export async function getLoggedUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await prisma.org.findUnique({
      where: { id: req.session.orgId },
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    author_name: z.string(),
    email: z.string().email(),
    whatsapp: z.string(),
    password: z.string().transform((value) => hash(value, 10)),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
  });

  const body = await registerBodySchema.parseAsync(req.body);

  const { name, email, whatsapp } = req.body;

  try {
    const existingName = await prisma.org.findFirst({ where: { name } });
    if (existingName) {
      throw createHttpError(400, 'Name already in use');
    }
    const existingEmail = await prisma.org.findFirst({ where: { email } });
    if (existingEmail) {
      throw createHttpError(400, 'Email already in use');
    }
    const existingWhatsapp = await prisma.org.findFirst({
      where: { whatsapp },
    });
    if (existingWhatsapp) {
      throw createHttpError(400, 'Whatsapp already in use');
    }

    const newOrg = await prisma.org.create({ data: body });

    req.session.orgId = newOrg.id;

    res.status(201).json(newOrg);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = await loginBodySchema.parseAsync(req.body);

  try {
    const org = await prisma.org.findFirst({ where: { email } });

    if (!org) {
      throw createHttpError(404, 'Org not found');
    }

    const passwordMatch = await compare(password, org.password);

    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid password');
    }

    req.session.orgId = org.id;

    res.status(200).json(org);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    req.session.destroy((error) => {
      if (error) {
        throw error;
      }
      res.status(204).end();
    });
  } catch (error) {
    next(error);
  }
}
