import Chat from '../models/Chat.js';


// API controller for creating a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id

        const chatData = {
            userId,
            message: [],
            name: "New Chat",
            userName: req.user.name,

        }
        await Chat.create(chatData)
        res.json({ success: true, message: "Chat created successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API Controller for getting all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        // query includes sort by updatedAt descending
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        
        res.json({ success: true, chats })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API Controller for deleting a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id
        const {chatId} = req.body
        
        // remove the document matching chatId and userId
        await Chat.deleteOne({ _id: chatId, userId })
        
        res.json({ success: true, message: "chat Deleted" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
