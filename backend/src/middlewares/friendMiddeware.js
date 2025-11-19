import Conversation from "../models/Converstation.js";
import Friend from "../models/Friend.js";

const pair = (a , b) => (a < b ? [a,b] : [b,a]);
export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null;
        const memberIds = req.body?.memberIds ?? [];
        if(!recipientId && memberIds.length === 0){ 
            return res.status(400).json({ message: "recipientId and memberId is required" });
        }
        if (recipientId){
            const [userA, userB] = pair(me, recipientId);
            const isFriend = await Friend.findOne({ userA, userB });
            if (!isFriend) {
                return res.status(403).json({ message: "Bạn chỉ có thể gửi tin nhắn cho bạn bè của mình" });
            }
            return next();
        }
        // chat nhom
        const friendChecks = memberIds.map(async (memberId) => {
            const [userA, userB] = pair(me, memberId);
            const isFriend = await Friend.findOne({ userA, userB });
            return isFriend ? null : memberId;
        
        });
        const results = await Promise.all(friendChecks);
        const nonFriends = results.filter(Boolean);
        if (nonFriends.length > 0) {
            return res.status(403).json({ message: "Bạn chỉ có thể gửi tin nhắn cho bạn bè của mình", nonFriends });
        }
        next();
    } catch (error) {
        console.log("Lỗi xảy ra khi check friendship" , error);
        return res.status(500).json({ message: "Internal server error" });
    }
}