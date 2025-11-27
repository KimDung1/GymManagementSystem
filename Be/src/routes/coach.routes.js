import express from "express";
import { createCoach, deleteCoach, getCoachs, updateCoach } from "../controllers/coach.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Coach:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - limitedStudent
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         phone:
 *           type: string
 *           example: "0987654321"
 *         email:
 *           type: string
 *           example: "coach@gmail.com"
 *         speciality:
 *           type: string
 *           example: "Yoga"
 *         limitedStudent:
 *           type: number
 *           example: 10
 *         status:
 *           type: string
 *           enum: ["true", "false"]
 *           example: "false"
 *       timestamps: true
 *
 *   responses:
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           example:
 *             success: false
 *             message: "Coach not found"
 *     ServerError:
 *       description: Server error
 *       content:
 *         application/json:
 *           example:
 *             success: false
 *             message: "Internal server error"
 */

/**
 * @swagger
 * tags:
 *   name: Coach
 *   description: API for managing coaches
 */

/**
 * @swagger
 * /api/coach:
 *   get:
 *     summary: Get all coaches
 *     tags: [Coach]
 *     responses:
 *       200:
 *         description: List of all coaches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coach'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", getCoachs);

/**
 * @swagger
 * /api/coach:
 *   post:
 *     summary: Create new coach
 *     tags: [Coach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: Coach created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", createCoach);

/**
 * @swagger
 * /api/coach/{id}:
 *   put:
 *     summary: Update a coach by ID
 *     tags: [Coach]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coach ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: Coach updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:id", updateCoach);

/**
 * @swagger
 * /api/coach/{id}:
 *   delete:
 *     summary: Delete coach by ID
 *     tags: [Coach]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coach deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id", deleteCoach);

export default router;
