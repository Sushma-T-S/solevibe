import express from 'express';
import {
    getAllDeliveryBoys,
    createDeliveryBoy,
    updateDeliveryBoy,
    deleteDeliveryBoy,
    toggleDeliveryBoyStatus,
    resetDeliveryBoyPassword
} from '../controllers/deliveryBoy.controller.js';

const router = express.Router();

router.get('/get', getAllDeliveryBoys);
router.post('/create', createDeliveryBoy);
router.put('/update', updateDeliveryBoy);
router.delete('/delete', deleteDeliveryBoy);
router.put('/toggle-status', toggleDeliveryBoyStatus);
router.put('/reset-password', resetDeliveryBoyPassword);

export default router;
