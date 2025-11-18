import mongoose from "mongoose";
const FriendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        maxlength: 300,
    }
},
    {
        timestamps: true,
    })
FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true });
FriendRequestSchema.index({ from: 1 });
FriendRequestSchema.index({ to: 1 });
const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);
export default FriendRequest;