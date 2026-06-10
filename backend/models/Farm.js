import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        farmSize: {
            type: Number,
            required: [true, "Please add farm size in acres"],
        },
        soilType: {
            type: String,
            required: [true, "Please add soil type"],
        },
        state: {
            type: String,
            required: [true, "Please add the state"],
        },
        district: {
            type: String,
            required: [true, "Please add the district"],
        },
        plantedCrops: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Farm = mongoose.model("Farm", farmSchema);

export default Farm;
