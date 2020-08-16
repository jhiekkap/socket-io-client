import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://young-dawn-64939.herokuapp.com/' : "http://127.0.0.1:4001";

export default function Chat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [sender, setSender] = useState('')
    const [receiver, setReceiver] = useState('')
    const [recipients, setRecipients] = useState('')



    //console.log('MESSAGES', messages)
    //console.log('SENDER: ', sender)
    // console.log('RECEIVER: ', receiver)
    console.log('RECIPIENTS: ', recipients)

    useEffect(() => {

        console.log('USE EFFECT')
        /* const random = parseInt(Math.random() * 2)
        console.log('Random', random)
        const chatID = random === 0 ? 'a' : 'b'
        console.log('chatId', chatID)
        setReceiver(random === 1 ? 'a' : 'b')
        setSender(chatID)
 */
        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID: sender
            }
        });

        socket.on("receive_message", (data) => {
            console.log('NEW MESSAGE', data)
            setMessages(prevState => prevState.concat(data.senderChatID + ': ' + data.content));
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, [sender, receiver]);


    const handleSendMessage = (e) => {
        e.preventDefault()
        const socket = socketIOClient(ENDPOINT);
        socket.emit('send_message', {
            receiverChatID: receiver,
            senderChatID: sender,
            content: message,
            recipients,
        })
        if (recipients !== 'ALL') {
            setMessages(prevState => prevState.concat(sender + ': ' + message));
        }
        setMessage('')
    }

    return (
        <div style={{ padding: '5%' }}>
            <form onSubmit={handleSendMessage}>
                <div >
                    <div>
                        LÄHETTÄJÄ
                    </div>
                    <input
                        type='text'
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <div>
                        VASTAANOTTAJA
                    </div>
                    <input
                        type='text'
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <div>
                        VIESTI
                    </div>
                    <input
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div>
                        <br />
                        <button type='submit'>PUSH ME</button>
                    </div>
                    <br />
                    {message && <div>
                        <input
                            type='checkbox'
                            checked={recipients !== 'ALL'}
                            onChange={() => setRecipients(recipients !== 'ALL' ? 'ALL' : '')}
                            name='recipients'
                        />
                        <label>YKSITYINEN</label>
                        <input
                            type='checkbox'
                            checked={recipients === 'ALL'}
                            onChange={() => setRecipients(recipients === 'ALL' ? '' : 'ALL')}
                            name='recipients'
                        />
                        <label>KAIKKI</label>
                    </div>}
                </div>

            </form>
            <br />
            <ul>
                {messages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
        </div>

    );
}