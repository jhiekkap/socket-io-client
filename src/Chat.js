import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Grid } from '@material-ui/core';
import Stream from './Stream'
import View from './View'

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://fierce-beach-86051.herokuapp.com/' : "http://127.0.0.1:4001";
const emoijiStyles = {
    cursor: 'pointer',
    marginRight: '2%'
}
const EMOIJIS = {
    heart: '❤️️',
    happy: '😊',
    sad: '☹️'
}

const users = ['Jari', 'Sampsa', 'Kasperi', 'Janina']



export default function Chat() {
    const [content, setContent] = useState('')
    const [messages, setMessages] = useState([])
    const [currentUser, setCurrentUser] = useState(users[0])
    const [receiver, setReceiver] = useState(users[1])
    const [recipients, setRecipients] = useState('')
    const [file, setFile] = useState(null)
    const [purity, setPurity] = useState(50)
    const [overtones, setOvertones] = useState(50)
    const [sendingEmoiji, setSendingEmoiji] = useState(false)
    const [showEmoiji, setShowEmoiji] = useState('')
    const [videoStream, setVideoStream] = useState('')
    const [videoSender, setVideoSender] = useState('')

    const imgRef = useRef()

    const emoijiStyles = {
        cursor: 'pointer',
        marginRight: '2%',
        fontSize: sendingEmoiji && '20px'
    }


    //console.log('MESSAGES', messages)
    console.log('CURRENT USER: ', currentUser)
    // console.log('RECEIVER: ', receiver)
    console.log('RECIPIENTS: ', recipients)

    useEffect(() => {

        console.log('USE EFFECT')
        /* const random = parseInt(Math.random() * 2)
        console.log('Random', random)
        const chatID = random === 0 ? 'a' : 'b'
        console.log('chatId', chatID)
        setReceiver(random === 1 ? 'a' : 'b')
        setCurrentUser(chatID)
 */
        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID: currentUser
            }
        });

        socket.on("receive_message", (data) => {
            //console.log('NEW MESSAGE', data)
            if (data.content) {
                setMessages(prevState => prevState.concat(data.senderChatID + '=> ' + data.receiverChatID + ': ' + data.content));
            } else if (data.emoiji) {
                setSendingEmoiji(true)
                setShowEmoiji(data.emoiji)
                setTimeout(() => {
                    setSendingEmoiji(false)
                    setShowEmoiji('')
                }, 2000)
            } else if (data.videoStream) {
                //setVideoStream(data.videoStream)
                imgRef.current.src = data.videoStream
                if (videoSender !== data.senderChatID) {
                    setVideoSender(data.senderChatID)
                }
            }
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, [currentUser, receiver]);


    const handleSendMessage = (e) => {
        e.preventDefault()
        const socket = socketIOClient(ENDPOINT);
        socket.emit('send_message', {
            receiverChatID: receiver,
            senderChatID: currentUser,
            content,
            recipients,
        })
        setMessages(prevState => prevState.concat(currentUser + '=> ' + receiver + ': ' + content));
        setContent('')
    }

    const handleSendEmoiji = (emoiji) => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('send_message', {
            receiverChatID: receiver,
            senderChatID: currentUser,
            recipients,
            emoiji
        })
    }

    return (
        <div style={{ padding: '5%' }}>
            <Grid container spacing={3}>
                <Grid item md={6}>
                    <Stream currentUser={currentUser} receiver={receiver} />
                    <form onSubmit={handleSendMessage}>
                        <div >
                            <div>
                                LÄHETTÄJÄ
                            </div>
                            <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
                                {users.map((user, i) => <option key={i}>{user}</option>)}
                            </select>
                        </div>
                        <br />
                        <div>
                            <div>
                                VASTAANOTTAJA
                            </div>
                            <select value={receiver} onChange={(e) => setReceiver(e.target.value)}>
                                {users.map((user, i) => <option key={i}>{user}</option>)}
                            </select>
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
                                <button type='submit' disabled={!currentUser}>PUSH ME</button>
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
                </Grid>
                <Grid item md={6}>
                    <View imgRef={imgRef} videoSender={videoSender} />
                </Grid>
            </Grid>
        </div>

    );
}