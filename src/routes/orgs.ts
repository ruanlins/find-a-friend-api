import express from 'express';
import * as orgsController from '../controllers/orgs';

export const router = express.Router();

router.get('/', orgsController.getLoggedUser);
router.post('/register', orgsController.register);
router.post('/login', orgsController.login);
router.post('/logout', orgsController.logout);
