import React, { useState, useRef, useEffect } from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://fierce-beach-86051.herokuapp.com/' : "http://127.0.0.1:4001";


const View = ({ imgRef, videoSender }) => {

    // const imgRef = useRef()
    /* const [receiver, setReceiver] = useState(null)
    const [sender, setSender] = useState(null) */

    /*   useEffect(() => {
          const socket = socketIOClient(ENDPOINT, {
              query: {
                  chatID: currentUser
              }
          });
          socket.on('receive_message', (data) => {
              imgRef.current.src = data.videoStream
              setReceiver(data.receiverChatID)
              setSender(data.senderChatID)
              //console.log(image);
          });
  
          return () => socket.disconnect();
      }, [ receiver, sender]) */

    return <div>
        <img ref={imgRef} width="150" height="120" alt="view" />
        {videoSender}
    </div>
}

export default View