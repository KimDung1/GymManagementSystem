import mongoose from "mongoose";
const coachSchema = new  mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        phone: {
            type: String,
            require: true,
        },
        email: {
            type: String,
        },
        speciality: {
            type: String,
        },
        limitedStudent: {
            type: Number,
            require: true,
        },
        status: {
            type: String,
            emum: ["true", "false"],
            default: "false",
        },
    },
    { timestamps: true }
);

const Coach = mongoose.model("Coach", coachSchema);

export default Coach;
