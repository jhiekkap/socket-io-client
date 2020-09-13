import React, { useRef, useEffect } from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

const Stream = ({ currentUser }) => {

    const canvasRef = useRef();
    const videoRef = useRef()

    useEffect(() => {
        canvasRef.current.width = 180
        canvasRef.current.height = 150;
        const context = canvasRef.current.getContext('2d');
        console.log('CANVASREF', canvasRef)
        console.log('CONTEX', context)
        context.width = canvasRef.current.width;
        context.height = canvasRef.current.height;

        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID: currentUser
            }
        });

        function logger(msg) {
            console.log(msg);
        }

        function loadCamera(videoStream) {
            try {
                videoRef.current.srcObject = videoStream;
            }

            catch (error) {
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
                receiverChatID: 'Kalle',
                videoStream: canvasRef.current.toDataURL('image/webp')
            });
        }

        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false
            }, loadCamera, loadFail);
        }

        setInterval(function () {
            Draw(videoRef.current, context);
        }, 0.1);
    }, [currentUser])

    return <div>
        <video ref={videoRef} src="" width='180' height='150' autoPlay={true}></video>
        <canvas ref={canvasRef} style={{ display: "none" }} ></canvas>
    </div>
}

export default Stream