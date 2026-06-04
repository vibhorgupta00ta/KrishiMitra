import mongoose from "mongoose";

const cropPredictionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        nitrogen: {
            type: Number,
            required: true,
        },
        phosphorus: {
            type: Number,
            required: true,
        },
        potassium: {
            type: Number,
            required: true,
        },
        temperature: {
            type: Number,
            required: true,
        },
        humidity: {
            type: Number,
            required: true,
        },
        ph: {
            type: Number,
            required: true,
        },
        rainfall: {
            type: Number,
            required: true,
        },
        predictedCrop: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const CropPrediction = mongoose.model("CropPrediction", cropPredictionSchema);

export default CropPrediction;
