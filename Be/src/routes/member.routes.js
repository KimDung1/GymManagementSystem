import express from "express";
import { createMember, deleteMember, getMembers, updateMember } from "../controllers/member.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - expiredDate
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn B"
 *         phone:
 *           type: string
 *           example: "0912345678"
 *         status:
 *           type: string
 *           enum: ["true", "false"]
 *           example: "false"
 *         package:
 *           type: string
 *           example: "Gói tập 1 tháng"
 *         expiredDate:
 *           type: string
 *           example: "2025-12-31"
 *       timestamps: true
 *
 *   responses:
 *     NotFound:
 *       description: Member not found
 *       content:
 *         application/json:
 *           example:
 *             success: false
 *             message: "Member not found"
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
 *   name: Member
 *   description: API for managing gym members
 */

/**
 * @swagger
 * /api/member:
 *   get:
 *     summary: Get all members
 *     tags: [Member]
 *     responses:
 *       200:
 *         description: List of all members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", getMembers);

/**
 * @swagger
 * /api/member:
 *   post:
 *     summary: Create new member
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", createMember);

/**
 * @swagger
 * /api/member/{id}:
 *   put:
 *     summary: Update a member by ID
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:id", updateMember);

/**
 * @swagger
 * /api/member/{id}:
 *   delete:
 *     summary: Delete member by ID
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id", deleteMember);

export default router;
