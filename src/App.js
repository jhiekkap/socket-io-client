import React, { useState } from "react";
import ClientComponent from "./ClientComponent";
import Chat from './Chat'

function App() {
  const [loadClient, setLoadClient] = useState(true);
  

  return (
    <>
      {/* LOAD OR UNLOAD THE CLIENT */}
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        STOPPA CLIENTEN
      </button>
      {/* SOCKET IO CLIENT*/}
     {/*  {loadClient ? <ClientComponent /> : null} */}
      {loadClient ? <Chat /> : null}
    </>
  );
}

export default App;