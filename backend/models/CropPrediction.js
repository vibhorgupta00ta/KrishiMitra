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
            required: false,
        },
        phosphorus: {
            type: Number,
            required: false,
        },
        potassium: {
            type: Number,
            required: false,
        },
        temperature: {
            type: Number,
            required: false,
        },
        humidity: {
            type: Number,
            required: false,
        },
        ph: {
            type: Number,
            required: false,
        },
        rainfall: {
            type: Number,
            required: false,
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
