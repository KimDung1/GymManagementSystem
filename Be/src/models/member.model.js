import mongoose from "mongoose";
const memberSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        phone: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            emum: ["true", "false"],
            default: "false",
        },
        package: {
            type: String,
        },
        expiredDate: {
            type: String,
            require: true,
        },
    },
    { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
