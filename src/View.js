import React, { useRef, useEffect } from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001"


const View = () => {

    const imgRef = useRef()

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {
            query: {
                chatID: 'Kalle'
            }
        });
        socket.on('receive_message', (data) => {
            imgRef.current.src = data.videoStream
            //console.log(image);
        });
    }, [])

    return <div>
        <img ref={imgRef} width="400" height="300" alt="view" />
    </div>
}

export default View