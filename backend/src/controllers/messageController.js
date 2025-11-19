import Conversation from '../models/Converstation.js';
import Message from '../models/Message.js';
import {updateConverstationAfterCreateMessage} from '../utils/messageHelper.js';
export const sendDirectMessage = async (req, res) => {
    try {
        const {recipientId, content, converstationId} = req.body;
        const senderId = req.user._id;
        let conversation;
        if(!content) {
            return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
        }
        if(converstationId) {
            conversation = await Conversation.findById(converstationId);
        }
        if(!conversation) {
            conversation = new Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId , joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            })
        }
        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
        })

        updateConverstationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();
        res.status(201).json({ message: "Tin nhắn đã được gửi thành công", data: message });
    } catch (error) {
        console.log("Lỗi khi gửi tin nhắn trực tiếp",error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const sendGroupMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.user._id;
        const conversation = await req.conversation;

        if (!content) {
            return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
        }
        const message = await Message.create({
            conversationId,
            senderId,
            content,
        });
        updateConverstationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();
        res.status(201).json({ message: "Tin nhắn đã được gửi thành công", data: message });
    } catch (error) {
        console.log("Lỗi khi gửi tin nhắn nhóm", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
