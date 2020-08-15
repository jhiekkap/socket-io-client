import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

export default function Chat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])


    //console.log('MESSAGES', messages)

    useEffect(() => {

        console.log('USE EFFECT')
        const socket = socketIOClient(ENDPOINT);

        socket.on("chat message", data => {
            console.log('DATA, messages', data, messages)
            setMessages(prevState => prevState.concat(data));
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, []);


    const handleSendMessage = (e) => {
        e.preventDefault()
        const socket = socketIOClient(ENDPOINT);
        socket.emit('chat message', message) 
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