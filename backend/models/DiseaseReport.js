import mongoose from "mongoose";

const diseaseReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        imageUrl: {
            type: String,
            required: false, // Optional for dummy response case
        },
        diseaseName: {
            type: String,
            required: true,
        },
        confidence: {
            type: Number,
            required: true,
        },
        recommendation: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const DiseaseReport = mongoose.model("DiseaseReport", diseaseReportSchema);

export default DiseaseReport;
