import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot() {

  

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const [open, setOpen] = useState(false);

  const [subject, setSubject] = useState("Science");

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);


  

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);



  useEffect(() => {

    loadChats();

  }, [subject]);


  const loadChats = async () => {

    try {

      const res = await axios.get(
  `http://localhost:8081/api/chat/history/${subject}`
);

      const formattedMessages = [];

      res.data.forEach((chat) => {

        
        formattedMessages.push({
          sender: "user",
          text: chat.userMessage,
        });

     
        formattedMessages.push({
          sender: "bot",
          text: chat.botReply,
        });

      });

      setMessages(formattedMessages);

    } catch (error) {

      console.error(
        "LOAD CHAT ERROR:",
        error
      );
    }
  };


  

  const sendMessage = async () => {

    if (!input.trim()) return;

    const currentInput = input;

   
    const userMessage = {

      sender: "user",

      text: currentInput,

    };

   
    setMessages((prev) => [

      ...prev,

      userMessage,

    ]);

    setInput("");

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:8081/api/chat",
        {
          message: currentInput,
          subject: subject,
        }
      );

      
      const botMessage = {

        sender: "bot",

        text: res.data.reply,

      };

      setMessages((prev) => [

        ...prev,

        botMessage,

      ]);

    } catch (error) {

      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      setMessages((prev) => [

        ...prev,

        {
          sender: "bot",
          text:
            "Error: Unable to get response",
        },

      ]);

    } finally {

      setLoading(false);

    }
  };




  const clearChat = async () => {

    const confirmClear = window.confirm(
      `Clear all ${subject} chats?`
    );

    if (!confirmClear) return;

    try {

     await axios.delete(
  `http://localhost:8081/api/chat/clear/${subject}`
);

      setMessages([]);

    } catch (error) {

      console.error(
        "CLEAR CHAT ERROR:",
        error
      );
    }
  };




  return (

    <div className="chatbot-widget">

      

      {open && (

        <div className="chatbot-container">


          {/* HEADER */}

          <div className="chatbot-header">

            <span>
              OL Mastery Assistant
            </span>

            <div className="chatbot-actions">

              <button
                className="clear-btn"
                onClick={clearChat}
              >
                Clear
              </button>

              <button
                className="close-btn"
                onClick={() => setOpen(false)}
              >
                ×
              </button>

            </div>

          </div>


          

          <div className="subject-selector">

            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
            >

              <option value="Science">
                Science
              </option>

              <option value="Mathematics">
                Mathematics
              </option>

              <option value="ICT">
                ICT
              </option>

              <option value="English">
                English
              </option>

              <option value="History">
                History
              </option>

              <option value="General">
                General
              </option>

            </select>

          </div>


       

          <div className="chatbot-messages">

            {messages.length === 0 ? (

              <div className="empty-chat">

                No chats available for this subject.

              </div>

            ) : (

              messages.map((m, i) => (

                <div
                  key={i}
                  className={
                    m.sender === "user"
                      ? "user-msg"
                      : "bot-msg"
                  }
                >

                  {m.text}

                </div>

              ))
            )}


            {/* LOADING */}

            {loading && (

              <div className="bot-msg">

                Typing...

              </div>

            )}


            <div ref={messagesEndRef} />

          </div>


          {/* INPUT AREA */}

          <div className="chatbot-input">

            <input
              type="text"
              value={input}
              placeholder={`Ask ${subject} questions...`}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
            />

            <button onClick={sendMessage}>

              Send

            </button>

          </div>

        </div>
      )}



      {!open && (

        <button
          className="chatbot-open-btn"
          onClick={() => setOpen(true)}
        >

          💬

        </button>

      )}

    </div>
  );
}