import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Grid } from '@material-ui/core';
import Stream from './Stream'
import View from './View'

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://infinite-mesa-94209.herokuapp.com/' : "http://127.0.0.1:4001";
const EMOJIStyles = {
    cursor: 'pointer',
    marginRight: '2%'
}
const EMOJIS = {
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
    const [sendingEmoji, setSendingEmoji] = useState(false)
    const [showEmoji, setShowEmoji] = useState('') 
    const [videoSender, setVideoSender] = useState('')

    const imgRef = useRef()

    const EMOJIStyles = {
        cursor: 'pointer',
        marginRight: '2%',
        fontSize: sendingEmoji && '20px'
    }   

    useEffect(() => {   
        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID: currentUser
            }
        });

        socket.on("receive_message", (data) => { 
            if (data.content) {
                setMessages(prevState => prevState.concat(data.senderChatID + '=> ' + data.receiverChatID + ': ' + data.content));
            } else if (data.emoji) {
                setSendingEmoji(true)
                setShowEmoji(data.emoji)
                setTimeout(() => {
                    setSendingEmoji(false)
                    setShowEmoji('')
                }, 2000)
            } else if (data.videoStream) { 
                imgRef.current.src = data.videoStream
                if (videoSender !== data.senderChatID) {
                    setVideoSender(data.senderChatID)
                }
            }
        });  

        return () => socket.disconnect(); 
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

    const handleSendEmoji = (emoji) => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('send_message', {
            receiverChatID: receiver,
            senderChatID: currentUser,
            recipients,
            emoji
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
                                SENDER
                            </div>
                            <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
                                {users.map((user, i) => <option key={i}>{user}</option>)}
                            </select>
                        </div>
                        <br />
                        <div>
                            <div>
                                RECEIVER
                            </div>
                            <select value={receiver} onChange={(e) => setReceiver(e.target.value)}>
                                {users.map((user, i) => <option key={i}>{user}</option>)}
                            </select>
                        </div>
                        <br />
                        <div>
                            <div>
                                MESSAGE
                            </div>
                            <input
                                type='text'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div>
                                <br />
                                <button type='submit' disabled={!currentUser}>SEND</button>
                            </div>
                            <br />
                            <div>
                                <input
                                    type='checkbox'
                                    checked={recipients !== 'ALL'}
                                    onChange={() => setRecipients(recipients !== 'ALL' ? 'ALL' : '')}
                                    name='recipients'
                                />
                                <label>PRIVATE</label>
                                <input
                                    type='checkbox'
                                    checked={recipients === 'ALL'}
                                    onChange={() => setRecipients(recipients === 'ALL' ? '' : 'ALL')}
                                    name='recipients'
                                />
                                <label>ALL</label>
                            </div>
                        </div>
                    </form>
                    <br />
                    <div>
                        <span onClick={() => handleSendEmoji('heart')} style={EMOJIStyles}>{EMOJIS['heart']}️</span>
                        <span onClick={() => handleSendEmoji('happy')} style={EMOJIStyles}>{EMOJIS['happy']}</span>
                        <span onClick={() => handleSendEmoji('sad')} style={EMOJIStyles}>{EMOJIS['sad']}</span>
                    </div>
                    <div>
                        <ul>
                            {messages.map((msg, i) => <li key={i}>{msg}</li>)}
                        </ul>
                    </div>
                    {showEmoji && <div style={{ position: 'fixed', top: '50px', right: '50px', fontSize: '300px' }}>
                        {EMOJIS[showEmoji]}
                    </div>}
                </Grid>
                <Grid item md={6} style={{ display: videoSender ? 'block' : 'none' }}>
                    <View imgRef={imgRef} videoSender={videoSender} />
                </Grid>
            </Grid>
        </div> 
    );
}