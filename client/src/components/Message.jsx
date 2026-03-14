import React, { useEffect } from "react"
import { assets } from "../assets/assets"
import moment from "moment"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import Prism from "prismjs"
import toast from "react-hot-toast"
import { Copy, Pencil } from "lucide-react";

const Message = ({ message,setPrompt, index, regenerate }) => {

  useEffect(() => {
    Prism.highlightAll()
  }, [message])

  /* ---------- COPY MESSAGE ---------- */

  const copyMessage = () => {

    if (!message) return

    if (message.isImage) {
      navigator.clipboard.writeText(message.content)
    } else {
      navigator.clipboard.writeText(message.content || "")
    }

    toast.success("Copied")
  }

  /* ---------- EDIT USER MESSAGE ---------- */

  const editMessage = () => {
    if (message.role !== "user") return
    setPrompt(message.content)
    document.querySelector("textarea")?.focus()
  }

  /* ---------- REGENERATE ---------- */

 const regenerateMessage = () => {
    if (!regenerate) return
    regenerate(index)
  }


  return (
    <div>

      {/* ---------- USER MESSAGE ---------- */}

      {message.role === "user" ? (

        <div className="flex justify-end my-4 group">

          <div className="relative flex flex-col max-w-[70%] self-end bg-primary/20 dark:bg-[#57317C]/30 rounded-xl">

            {/* Message Bubble */}
            <div className="flex flex-col gap-3 p-3 px-4 bg-primary/20 dark:bg-[#57317C]/30 rounded-2xl">

              <p className="text-sm dark:text-primary break-words whitespace-pre-wrap">
                {message.content}
              </p>

              {message.image && (
                <img
                  src={message.image}
                  alt=""
                  className="max-w-xs rounded-md"
                />
              )}

              

            </div>

            {/* Hover Buttons */}
            <div className="absolute -bottom-5 right-2 flex gap-3 text-xs opacity-0 group-hover:opacity-100 transition">

              <button onClick={editMessage}>
                <Pencil size={16} />
              </button>

              <button onClick={copyMessage}>
                <Copy size={16} />
              </button>


            </div>

          </div>

        </div>


      ) : (

        /* ---------- AI MESSAGE ---------- */

        <div className="flex items-start gap-2 my-4 group">

          <img
            src={assets.logo_icon}
            className="w-4 rounded-full"
            alt=""
          />

          <div className="bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 px-4 py-2 rounded-2xl max-w-[60%] text-sm">

            {message.isImage ? (

              <img
                src={message.content}
                alt=""
                className="w-full max-w-md rounded-md"
              />

            ) : (

              <div className="text-sm dark:text-primary reset-tw">

                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {message.content || ""}
                </ReactMarkdown>

              </div>

            )}

            <div className="flex items-center gap-3 text-xs opacity-0 group-hover:opacity-100 transition duration-200">

             <button onClick={copyMessage}>
                <Copy size={16} />
              </button>

              <button
                onClick={regenerateMessage}
                className="hover:underline"
              >
                🔄 Regenerate
              </button>

              <span className="text-gray-400 dark:text-[#B1A6C0]">
                {moment(message.timestamp).fromNow()}
              </span>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Message
