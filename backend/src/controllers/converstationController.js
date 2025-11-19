import Conversation from '../models/Converstation.js';
// import Message from '../models/Message.js'; 
export const createConverstation = async (req, res) => {
    try {
        const { type, name, memberIds } = req.body;
        const userId = req.user._id;

        if (
            !type ||
            (type === "group" && !name) ||
            !memberIds ||
            !Array.isArray(memberIds) ||
            memberIds.length === 0
        ) {
            return res
                .status(400)
                .json({ message: "Tên nhóm và danh sách thành viên là bắt buộc" });
        }

        let conversation;

        if (type === "direct") {
            const participantId = memberIds[0];

            conversation = await Conversation.findOne({
                type: "direct",
                "participants.userId": { $all: [userId, participantId] },
            });

            if (!conversation) {
                conversation = new Conversation({
                    type: "direct",
                    participants: [{ userId }, { userId: participantId }],
                    lastMessageAt: new Date(),
                });

                await conversation.save();
            }
        }

        if (type === "group") {
            conversation = new Conversation({
                type: "group",
                participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
                group: {
                    name,
                    createdBy: userId,
                },
                lastMessageAt: new Date(),
            });

            await conversation.save();
        }

        if (!conversation) {
            return res.status(400).json({ message: "Conversation type không hợp lệ" });
        }

        await conversation.populate([
            { path: "participants.userId", select: "displayName avatarUrl" },
            {
                path: "seenBy",
                select: "displayName avatarUrl",
            },
            { path: "lastMessage.senderId", select: "displayName avatarUrl" },
        ]);

        return res.status(201).json({ conversation });
    } catch (error) {
        console.log();
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getConverstation = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            'participants.userId': userId
        }).sort({ lastMessageAt: -1, updatedAt: -1 })
            .populate({
                path: "participants.userId",
                select: "displayName avatarUrl"
            })
            .populate({
                path: "lastMessage.senderId",
                select: "displayName avatarUrl"
            })
            .populate({
                path: "seenBy",
                select: "displayName avatarUrl"
            });
    const formatted = conversations.map((conv) => {
        const participants = (conv.participants || []).map((p) => ({
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinedAt: p.joinedAt
        }));
        return {
            ...conv.toObject(),
            unreadCounts: conv.unreadCounts || {},
            participants,
        }
    });
    return res.status(200).json({ conversations: formatted });
    } catch (error) {
        console.log("Lỗi khi lấy danh sách cuộc trò chuyện", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getMessage = async (req, res) => {
    res.send("Create converstation");
}