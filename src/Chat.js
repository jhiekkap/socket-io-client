import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

export default function Chat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])


    console.log('MESSAGES', messages)

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);

        socket.on("chat message", data => {
            setMessages(messages.concat(data));
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, []);


    const handleSendMessage = (e) => {
        e.preventDefault()
        const socket = socketIOClient(ENDPOINT);
        socket.emit('chat message', message)
        setMessages(messages.concat(message))
        setMessage('')
    }

    return (
        <div>
            <form action="" onSubmit={handleSendMessage}>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button>PUSH ME</button>
            </form>
            <ul>
                {messages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
        </div>

    );
}