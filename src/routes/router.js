const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

router.get('/ships', controller.getShips);
router.get('/ships/:id', controller.getShipById);
router.post('/ships', controller.createShip);

router.get('/missions', controller.getMissions);
router.get('/missions/:id', controller.getMissionById);
router.post('/missions', controller.createMission);

module.exports = router;
