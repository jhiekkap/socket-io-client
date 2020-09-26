import React, { useState, useRef, useEffect } from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://infinite-mesa-94209.herokuapp.com/' : "http://127.0.0.1:4001";


const Stream = ({ currentUser, receiver }) => {

    const canvasRef = useRef();
    const videoRef = useRef()
    const [loggings, setLoggings] = useState([])
    const [showStream, setShowStream] = useState(false)

    const handleStream = () => {
        setShowStream(true)
    }

    function hasGetUserMedia() {
        return !!(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia);
    }

    useEffect(() => {
        canvasRef.current.width = 180
        canvasRef.current.height = 150;
        const context = canvasRef.current.getContext('2d');
        context.width = canvasRef.current.width;
        context.height = canvasRef.current.height;

        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID: currentUser
            }
        });

        function logger(msg) {
            console.log(msg);
            setLoggings(loggings => loggings.concat(msg))
        }

        if (hasGetUserMedia()) {
            logger('getUserMedia is ok')
        } else {
            logger('getUserMedia is not supported by your browser');
        }

        function loadCamera(videoStream) {
            try {
                videoRef.current.srcObject = videoStream;
            } catch (error) {
                videoRef.current.src = URL.createObjectURL(videoStream);
            }
            logger("Camera connected");
        }

        function loadFail() {
            logger("Camera not connected");
        }

        function Draw(video, context) {
            context.drawImage(video, 0, 0, context.width, context.height);
            socket.emit('send_message', {
                senderChatID: currentUser,
                receiverChatID: receiver,
                videoStream: canvasRef.current.toDataURL('image/webp')
            });
        }

        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                loadCamera(stream)
            } catch (error) {
                loadFail()
                logger(error)
            }
        }
        initCamera()
        setInterval(() => Draw(videoRef.current, context), 0.1);

        return () => socket.disconnect();
    }, [currentUser, receiver])


    return <div>
        {!showStream && <button onClick={handleStream}>STREAM</button>}
        <div style={{ display: showStream ? 'block' : 'none' }}>
            <video ref={videoRef} src="" width='180' height='150' autoPlay></video>
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} ></canvas>
        <ul>{loggings.map((logging, i) => <li key={i}>{logging}</li>)}</ul>
    </div>
}

export default Stream