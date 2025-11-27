    import Member from "../models/member.model.js";
    import { error, success } from "../utils/response.js";

    export const createMember = async (req, res) => {
        try {
            const member = await Member.create(req.body);
            success(res, "Member get successfully", member);
        } catch (err) {
            error(res, err.message);
        }
    };

    export const getMembers = async (req, res) => {
        try {
            const member = await Member.find();
            success(res, "Member created successfully", member);
        } catch (err) {
            error(res, err.message);
        }
    };

    export const updateMember = async (req, res) => {
        try {
            const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
            success(res, "Member updated successfully", member);
        } catch (err) {
            error(res, err.message);
        }
    };

    export const deleteMember = async (req, res) => {
        try {
            const member = await Member.findByIdAndDelete(req.params.id);
            success(res, "Member deleted successfully", member);
        } catch (err) {
            error(res, err.message);
        }
    };
