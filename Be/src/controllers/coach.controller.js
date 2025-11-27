import Coach from "../models/coach.model.js";
import { error, success } from "../utils/response.js";

export const createCoach = async (req, res) => {
    try {
        const coach = await Coach.create(req.body);
        success(res, "Member get successfully", coach);
    } catch (err) {
        error(res, err.message);
    }
};

export const getCoachs = async (req, res) => {
    try {
        const coach = await Coach.find();
        success(res, "Member created successfully", coach);
    } catch (err) {
        error(res, err.message);
    }
};

export const updateCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        success(res, "Member updated successfully", coach);
    } catch (err) {
        error(res, err.message);
    }
};

export const deleteCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);
        success(res, "Member deleted successfully", coach);
    } catch (err) {
        error(res, err.message);
    }
};
