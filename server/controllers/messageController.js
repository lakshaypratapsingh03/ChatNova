import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import imageKit from "../configs/imageKit.js"
import openai from "../configs/openai.js"


// Text AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits." });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        // Add user message to DB
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });

        // CALL THE API WITH CORRECT MODEL
        const {choices} = await openai.chat.completions.create({
            model: "gemini-3-flash-preview", 
            messages: [{ role: "user", content: prompt }],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage: false}

        // Send response to frontend
        res.json({ success: true, reply });

        // Save to Database 
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    } catch (error) {
        console.error("API ERROR:", error);
        
        // Handle the 429 specifically
        if (error.status === 429) {
            return res.json({ 
                success: false, 
                message: "Gemini Free Tier limit reached. Please wait 60 seconds." 
            });
        }

        res.json({ success: false, message: error.message });
    }
}

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        // Check credits
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "you don't have enough credits to use this feature" })
        }
        const { prompt, chatId, isPublished } = req.body
        // find chat
        const chat = await Chat.findOne({ userId, _id: chatId })

        // Push user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });


        // Encode the prompt
        const encodePrompt = encodeURIComponent(prompt)

        // Construct Imagekit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodePrompt}/ChatNova/${Date.now()}.png?tr=w-800,h-800`;

        // Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, {
            responseType: "arraybuffer",
            validateStatus: () => true
        })

        // If generation failed, stop here
        if (aiImageResponse.status !== 200) {
            throw new Error("Image generation failed. Please try again.")
        }

        // Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        // Upload to ImageKit Media Library
        const uploadResponse = await imageKit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "ChatNova"
        })

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }

        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}