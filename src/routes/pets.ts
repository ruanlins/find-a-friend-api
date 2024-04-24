import express from 'express';
import * as petsController from '../controllers/pets';

export const router = express.Router();

router.get('/', petsController.getAllPets);
router.post('/register', petsController.registerPet);
