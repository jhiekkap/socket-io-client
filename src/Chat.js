import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://young-dawn-64939.herokuapp.com/' : "http://127.0.0.1:4001";
const emoijiStyles = {
    cursor: 'pointer',
    marginRight: '2%'
}
const EMOIJIS = {
    heart: '❤️️',
    happy: '😊',
    sad: '☹️'
}



export default function Chat() {
    const [content, setContent] = useState('')
    const [messages, setMessages] = useState([])
    const [sender, setSender] = useState('')
    const [receiver, setReceiver] = useState('')
    const [recipients, setRecipients] = useState('')
    const [file, setFile] = useState(null)
    const [purity, setPurity] = useState(50)
    const [overtones, setOvertones] = useState(50)
    const [sendingEmoiji, setSendingEmoiji] = useState(false)
    const [showEmoiji, setShowEmoiji] = useState('')

    const emoijiStyles = {
        cursor: 'pointer',
        marginRight: '2%',
        fontSize: sendingEmoiji && '20px'
    }


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
            if (data.content) {
                setMessages(prevState => prevState.concat(data.senderChatID + ': ' + data.content));
            } else if (data.emoiji) {
                setSendingEmoiji(true)
                setShowEmoiji(data.emoiji)
                setTimeout(() => {
                    setSendingEmoiji(false)
                    setShowEmoiji('')
                }, 2000)
            }
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
            content,
            recipients,
        })
        if (recipients !== 'ALL') {
            setMessages(prevState => prevState.concat(sender + ': ' + content));
        }
        setContent('')
    }

    const handleSendEmoiji = (emoiji) => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('send_message', {
            receiverChatID: receiver,
            senderChatID: sender,
            recipients,
            emoiji
        })
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
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div>
                        <br />
                        <button type='submit' disabled={!sender}>PUSH ME</button>
                    </div>
                    <br />
                    <div>
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
                    </div>
                </div>
            </form>
            <br />
            <div>
                <span onClick={() => handleSendEmoiji('heart')} style={emoijiStyles}> ❤️️ </span>
                <span onClick={() => handleSendEmoiji('happy')} style={emoijiStyles}> 😊 </span>
                <span onClick={() => handleSendEmoiji('sad')} style={emoijiStyles}> ☹️ </span>
            </div>
            <div>
                <ul>
                    {messages.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
            </div>
            {showEmoiji && <div style={{ position: 'fixed', top: '50px', right: '50px', fontSize: '300px' }}>
                {EMOIJIS[showEmoiji]}
            </div>}
        </div>

    );
}