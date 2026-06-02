import User from "../models/User.js";
export const authMe = async(req, res) =>{
    try {
        const user = req.user;// lấy từ authMiddleware
        return res.status(200).json({user});
    } catch (error) {
        console.error('Lỗi khi gọi authMe :', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}
export const searchUserByUsername = async(req, res) => {
    try {
        const { username } = req.query;
        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Thiếu username' });
        }
        const user = await User.findOne({ username }).select('_id username displayName avatarUrl');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm user by username :', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}