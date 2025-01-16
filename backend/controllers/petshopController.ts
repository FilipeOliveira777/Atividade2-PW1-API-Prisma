import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateCNPJ } from '../utils/validateCNPJ';
import { PrismaClient } from '@prisma/client';
import { validateName } from '../utils/validateName';

const prisma = new PrismaClient();

export async function createPetshop(req: Request, res: Response): Promise<void> {
  const { name, cnpj } = req.body;

  if (!validateCNPJ(cnpj)) {
    res.status(400).json({ error: 'CNPJ inválido. Use o formato XX.XXX.XXX/0001-XX.' });
    return;
  }
  if (!validateName(name)) {
    res.status(400).json({ error: 'Nome inválido.' });
    return;
  }
  
  try {
    const existingPetshop = await prisma.petshop.findFirst({
      where: { cnpj }
    });

    if (existingPetshop) {
      res.status(400).json({ error: 'Já existe um petshop com esse CNPJ.' });
      return;
    }

    const petshop = await prisma.petshop.create({
      data: { name, cnpj },
    });

    res.status(201).json(petshop);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o petshop.' });
  }
}



export async function getPets(req: Request, res: Response): Promise<void> {
  const petshopId = req.petshop?.id;

  if (!petshopId) {
    res.status(404).json({ error: 'Petshop não encontrado.' });
    return;
  }

  try {
    const pets = await prisma.pet.findMany({
      where: { petshopId },
    });

    res.status(200).json(pets);
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ error: 'Erro ao buscar pets do Petshop.' });
  }
}


export async function addPet(req: Request, res: Response): Promise<void> {
  const { name, type, description, deadline_vaccination } = req.body;
  const petshopId = req.petshop?.id;

  if (!petshopId) {
    res.status(404).json({ error: 'Petshop não encontrado.' });
    return;
  }

  try {
    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        description,
        vaccinated: false,
        deadline_vaccination: new Date(deadline_vaccination),
        created_at: new Date(),
        petshopId,  
      },
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar o pet.' });
  }
}



export async function updatePet(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, type, description, deadline_vaccination } = req.body;
  const petshopId = req.petshop?.id;

  if (!petshopId) {
    res.status(404).json({ error: 'Petshop não encontrado.' });
    return;
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet || pet.petshopId !== petshopId) {
      res.status(404).json({ error: 'Pet não encontrado ou não pertence a este petshop.' });
      return;
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        name: name || pet.name,
        type: type || pet.type,
        description: description || pet.description,
        deadline_vaccination: deadline_vaccination ? new Date(deadline_vaccination) : pet.deadline_vaccination,
      },
    });

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ error: 'Erro ao atualizar o pet.' });
  }
}


export async function markAsVaccinated(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const petshopId = req.petshop?.id;

  if (!petshopId) {
    res.status(404).json({ error: 'Petshop não encontrado.' });
    return;
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet || pet.petshopId !== petshopId) {
      res.status(404).json({ error: 'Pet não encontrado ou não pertence a este petshop.' });
      return;
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: { vaccinated: true },
    });

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error('Erro ao marcar pet como vacinado:', error);
    res.status(500).json({ error: 'Erro ao marcar o pet como vacinado.' });
  }
}


export async function deletePet(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const petshopId = req.petshop?.id;

  if (!petshopId) {
    res.status(404).json({ error: 'Petshop não encontrado.' });
    return;
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet || pet.petshopId !== petshopId) {
      res.status(404).json({ error: 'Pet não encontrado ou não pertence a este petshop.' });
      return;
    }

    await prisma.pet.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Pet deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ error: 'Erro ao deletar o pet.' });
  }
}


