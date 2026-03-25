
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import openai from "../configs/openai.js"



// Text AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt, mode } = req.body;

      
        let finalPrompt = prompt;

        if (mode === "quiz") {
            finalPrompt = `Create 5 MCQ quiz questions with answers on: ${prompt}`;
        }

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits." });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) return res.json({ success: false, message: "Chat not found" });

        // Add user message to DB
        chat.messages.push({ role: "user", content: finalPrompt, timestamp: Date.now() });

        await new Promise(resolve => setTimeout(resolve, 1500));

        // CALL THE API WITH CORRECT MODEL
        const { choices } = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "system",
                    content: `You are ChatNova - AI Study Assistant.

                    Rules:
                    - Only answer study-related questions (education, coding, science, etc.)
                    - If question is not study-related → say "I only help with study-related questions."
                    - If asked "who are you" → say "I am ChatNova - Your AI Study Assistant
                      
                         How can I help you today?"
                    
                    - If asked "what are you made of" → say:
                      
                    "I am built using MERN Stack:
                       
                    - Frontend: HTML, JavaScript, Tailwind CSS, React.js
                    - Backend: Node.js, Express.js, MongoDB"
                    
                    - Explain topics in simple language like a teacher
                    - Be short, clear, and helpful `
                },
                {
                    role: "user",
                    content: finalPrompt
                }
            ]
        });

        const reply = { ...choices[0].message, timestamp: Date.now()}

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

