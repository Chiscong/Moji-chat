import Friend from '../models/friendModel.js';
import User from '../models/userModel.js';
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
                    {from,to},
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

    } catch (error) {
        console.error("Lỗi khi chấp nhận yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const declineFriendRequest = async (req, res) => {
    try {

    } catch (error) {
        console.error("Lỗi khi từ chối yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllFriends = async (req, res) => {
    try {

    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getFriendRequest = async (req, res) => {
    try {

    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu kết bạn", error);
        res.status(500).json({ message: "Internal server error" });
    }
}