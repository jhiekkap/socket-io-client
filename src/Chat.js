import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://young-dawn-64939.herokuapp.com/' : "http://127.0.0.1:4001";

export default function Chat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [sender, setSender] = useState('')
    const [receiver, setReceiver] = useState('')



    //console.log('MESSAGES', messages)
    //console.log('SENDER: ', sender)
    // console.log('RECEIVER: ', receiver)

    useEffect(() => {

        console.log('USE EFFECT')
        const random = parseInt(Math.random() * 2)
        console.log('Random', random)
        const chatID = random === 0 ? 'a' : 'b'
        console.log('chatId', chatID)
        setReceiver(random === 1 ? 'a' : 'b')
        setSender(chatID)
 
        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID
            }
        });

        socket.on("receive_message", (data) => {
            console.log('NEW MESSAGE', data)
            setMessages(prevState => prevState.concat(data.senderChatID + ': ' + data.content));
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, []);


    const handleSendMessage = () => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('send_message', {
            content: message,
            receiverChatID: receiver,
            senderChatID: sender
        })
        setMessages(prevState => prevState.concat(sender + ': ' + message));
        setMessage('')
    }

    return (
        <div>
            <div>
                LÄHETTÄJÄ
                <input
                    type='text'
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                />
            </div>
            <div>
                VASTAANOTTAJA
                <input
                    type='text'
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                />
            </div>
          VIESTI
            <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <div>
                <button type='button' onClick={handleSendMessage}>PUSH ME</button>
            </div>
            <ul>
                {messages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
        </div>

    );
}