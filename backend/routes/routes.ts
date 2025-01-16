import { Router } from 'express';
import { createPetshop, getPets, addPet, updatePet, markAsVaccinated, deletePet } from '../controllers/petshopController';
import { checkExistsUserAccount } from '../middlewares/checkExistsUserAccount';

const router = Router();

router.post('/petshops', createPetshop);
router.get('/pets', checkExistsUserAccount, getPets);
router.post('/pets', checkExistsUserAccount, addPet);
router.put('/pets/:id', checkExistsUserAccount, updatePet);
router.patch('/pets/:id/vaccinated', checkExistsUserAccount, markAsVaccinated);
router.delete('/pets/:id', checkExistsUserAccount, deletePet);

export default router;
