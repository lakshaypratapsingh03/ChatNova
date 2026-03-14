import express from "express"
import { imageMessageController, textMessageController } from "../controllers/messageController.js"
import { protect } from "../middlewares/auth.js"

const messageRouter = express.Router()


// TEXT MESSAGE
messageRouter.post(
    "/text",
    protect,
    textMessageController
)

// IMAGE MESSAGE
messageRouter.post(
    "/image",
    protect,
    imageMessageController
)

export default messageRouter