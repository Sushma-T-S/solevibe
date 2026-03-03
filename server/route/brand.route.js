import express from 'express'
import { createBrand, getBrand, updateBrand, deleteBrand } from '../controllers/brand.controller.js'

const router = express.Router()

// Made brand routes public for testing - remove auth middleware
router.post('/add-brand', createBrand)
router.get('/get', getBrand)
router.put('/update', updateBrand)
router.delete('/delete', deleteBrand)

export default router
