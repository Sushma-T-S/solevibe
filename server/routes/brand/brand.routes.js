import express from 'express'
import { createBrand, getBrand, updateBrand, deleteBrand } from '../../controllers/brand/brand.controller.js'

const router = express.Router()

// Made brand routes public for testing - remove auth middleware
/**
 * @swagger
 * /api/brand/create:
 *   post:
 *     summary: Create new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Bad request or duplicate
 */
router.post('/create', createBrand)
/**
 * @swagger
 * /api/brand/get:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brands fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get('/get', getBrand)
/**
 * @swagger
 * /api/brand/update:
 *   put:
 *     summary: Update existing brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Brand updated
 *       404:
 *         description: Brand not found
 */
router.put('/update', updateBrand)
/**
 * @swagger
 * /api/brand/delete:
 *   delete:
 *     summary: Delete brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Brand deleted
 *       404:
 *         description: Brand not found
 */
router.delete('/delete', deleteBrand)

export default router

