import { Router } from 'express'
import auth from '../../middleware/auth.js'
import { addAddressController, deleteAddresscontroller, getAddressController, updateAddressController } from '../../controllers/address/address.controller.js'

const addressRouter = Router()

/**
 * @swagger
 * /api/address/create:
 *   post:
 *     summary: Add address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Address added
 */
addressRouter.post('/create',auth,addAddressController)
addressRouter.get("/get",auth,getAddressController)
addressRouter.put('/update',auth,updateAddressController)
addressRouter.delete("/disable",auth,deleteAddresscontroller)

export default addressRouter

