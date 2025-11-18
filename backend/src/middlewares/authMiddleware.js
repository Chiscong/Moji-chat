import jwt from "jsonwebtoken"
import User from "../models/User.js"

// authorization xác minh user là ai 
export const protectedRoute = (req, res, next) => {
    try {
        // lấy token từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Không có token' });
        // xác nhận token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
            // tìm user 
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy user' });
            }
            // trả user về trong req
            req.user = user;
            next();
        });

    } catch (error) {
        console.error('Lỗi khi xác minh JWT trong middleware :', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}