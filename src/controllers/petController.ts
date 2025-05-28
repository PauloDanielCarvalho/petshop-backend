import { Request, Response } from 'express';
import prisma from '../prisma';


export const createPet = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;
  const { name, species, breed, age } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age,
        userId
      }
    });
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error creating pet' });
  }
};
export const getAllPets = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;

  try {
    const pets = await prisma.pet.findMany({
      where: { userId }
    });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pets' });
  }
};

export const getPetById = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    const pet = await prisma.pet.findFirst({
      where: {
        id: id,
        userId
      }
    });

    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pet' });
  }
};
