import React, { useEffect, useState } from "react"
import { assets } from "../assets/assets"
import moment from "moment"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import Prism from "prismjs"
import toast from "react-hot-toast"
import { Copy, Pencil, Send,  } from "lucide-react";

const Message = ({ message, setPrompt, }) => {
  const [editing, setEditing] = useState(false)
  const [editedText, setEditedText] = useState(message.content)

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




  return (
    <div>

      {/* ---------- USER MESSAGE ---------- */}

      {message.role === "user" ? (

        <div className="flex justify-end my-4 group">

          <div className="relative flex flex-col max-w-[70%] self-end bg-primary/20 dark:bg-[#57317C]/30 rounded-xl">

            {/* Message Bubble */}
            <div className="flex flex-col gap-3 p-3 px-4 bg-primary/20 dark:bg-[#57317C]/30 rounded-2xl">

              {editing ? (

                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="text-sm w-full bg-transparent outline-none resize-none dark:text-primary"
                />

              ) : (

                <p className="text-sm dark:text-primary break-words whitespace-pre-wrap">
                  {message.content}
                </p>

              )}

              {message.image && (
                <img
                  src={message.image}
                  alt=""
                  className="max-w-xs rounded-md"
                />
              )}
   {editing && (
              <div className="flex gap-2 mt-2 text-xs">
                <button
                  onClick={() => {
                    message.content = editedText
                    setEditing(false)
                  }}
                  className="text-green-500"
                >
                  <Send size={15} />
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="text-red-500"
                >
                  Cancel
                </button>
              </div>
            )}


            </div>
           

            {/* Hover Buttons */}
            <div className="absolute -bottom-5 right-2 flex gap-3 text-xs opacity-0 group-hover:opacity-100 transition">

             <button onClick={copyMessage}>
                <Copy size={16} />
              </button>

               <button
                onClick={() => setEditing(true)}
                className="hover:underline"
              >
              <Pencil size={16}/> 
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
