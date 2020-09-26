import React, { useState, useRef, useEffect } from 'react'
const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://infinite-mesa-94209.herokuapp.com/' : "http://127.0.0.1:4001";

const View = ({ imgRef, videoSender }) => <div>
    <img ref={imgRef} width="150" height="120" alt="view" />
    {videoSender}
</div>

export default View