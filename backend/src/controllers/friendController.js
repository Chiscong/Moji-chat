import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message } = req.body;
        const from = req.user._id;
        // Kiếm tra không gửi yêu cầu kết bạn cho chính mình
        if (from === to) {
            return res.status(400).json({ message: "Bạn không thể gửi yêu cầu kết bạn cho chính mình" });
        }
        // Kiểm tra người nhận có tồn tại không
        const userExists = await User.exists({ _id: to });
        if (!userExists) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        // Kiểm tra đã là bạn bè chưa
        let userA = from.toString();
        let userB = to.toString();
        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }
        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from },
                ]
            })
        ]);
        if (alreadyFriends) {
            return res.status(400).json({ message: "Bạn đã là bạn bè" });
        }
        if (existingRequest) {
            return res.status(400).json({ message: "Đã có yêu cầu kết bạn tồn tại giữa hai người dùng" });
        }
        const request = await FriendRequest.create({ from, to, message });
        res.status(201).json({ message: "Đã gửi yêu cầu kết bạn", request });
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const acceptFriend = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;
        // Kiểm tra yêu cầu kết bạn có tồn tại không
        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Yêu cầu kết bạn không tồn tại" });
        }
        // Kiểm tra người dùng có quyền chấp nhận yêu cầu này không
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền chấp nhận yêu cầu này" });
        }
        // Tạo mối quan hệ bạn bè
        const friend = await Friend.create({ userA: request.from, userB: request.to });
        // Xóa yêu cầu kết bạn sau khi đã chấp nhận
        await FriendRequest.findByIdAndDelete(requestId);
        const from = await User.findById(request.from).select("_id displayName avatarUrl").lean();
        res.status(200).json({ 
            message: "Đã chấp nhận yêu cầu kết bạn",
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl
            }
            });
    } catch (error) {
        console.error("Lỗi khi chấp nhận yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;
        // Kiểm tra yêu cầu kết bạn có tồn tại không
        const request = await FriendRequest.findById(requestId);
        if(!request) {
            return res.status(404).json({ message: "Không tìm thấy lời mời kết bạn " });
        }
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền từ chối yêu cầu này" });
        }
        await FriendRequest.findByIdAndDelete(requestId);
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi từ chối yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const friendship = await Friend.find({
            $or: [
                { userA: userId },
                { userB: userId },
            ]
        })
        .populate("userA", "_id displayName avatarUrl")
        .populate("userB", "_id displayName avatarUrl")
        .lean();
        ;
        if (!friendship.length) {
            return  res.status(200).json({ friends: [] });
        }
        const friends = friendship.map((f) => {
            f.userA._id.toString() === userId.toString() ? f.userB : f.userA;
         })
         return res.status(200).json({ friends });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const populateFields = '_id username displayName avatarUrl';
        const [sent , received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate("to", populateFields).lean(),
            FriendRequest.find({ to: userId }).populate("from", populateFields).lean()
        ])
        res.status(200).json({ sent, received });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}