import mongoose  from "mongoose";
const documentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileUrl: String,
         originalName: String,
    },
    {timestamps: true}
);

export default mongoose.model("Document", documentSchema);