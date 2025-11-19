import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';
const ACCESS_TOKEN_TTL = '30m';
const REFESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'Phải đủ tất cả các trường' });
        }
        // Kiểm tra username tồn tại chưa
        const existUser = await User.findOne({ username });
        if (existUser) {
            return res.status(400).json({ message: 'Username đã tồn tại' });
        }
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo người dùng mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${lastName} ${firstName}`
        });

        res.sendStatus(204);
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}
export const signIn = async (req, res) => {
    try {
        // lấy input
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu username hoặc password' });
        }
        // lấy hashedPassword từ db
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Sai username hoặc password' });
        }
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Sai username hoặc password' });
        }
        // nếu khớp -> tạo accessToken với JWT
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        )
        // tạo refreshToken
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // tạo session mới để lưu refreshToken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFESH_TOKEN_TTL),
        });
        // trả refeshToken về client
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // cookie này không thể truy cập bằng js
            secure: true, // đảm bảo chỉ gửi qua https
            sameSite: 'none', // cho phép 2 dns riêng
            maxAge: REFESH_TOKEN_TTL,
        });
        // trả accessToken về response
        return res.status(200).json({ message: `User ${user.displayName} đã đăng nhập`, accessToken })
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}
export const signOut = async (req, res) => {
    try {
        // lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;
        if (token) {
            // xóa refeshToken từ session
            await Session.deleteOne({ refreshToken: token });
            // xóa cookie
            res.clearCookie("refreshtoken")
        }
    return res.sendStatus(204);
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}
// tạo access token mới từ refresh token
export const refreshToken = async (req , res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy refresh token' });
        }
        // so với refresh token trong db
        const session = await Session.findOne({ refreshToken: token });
        if(!session) {
            return res.status(401).json({ message: 'Refresh token không hợp lệ' });
        }
         // kiểm tra hết hạn chưa
        if(session.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Refresh token đã hết hạn' });
        }
        // tạo access token mới 
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        )
        // return 
        return res.status(200).json({ accessToken })
        
    } catch (error) {
        console.error('Lỗi khi làm mới token:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}