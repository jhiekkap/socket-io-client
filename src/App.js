import React, { useState } from "react";
import ClientComponent from "./ClientComponent";
import Chat from './Chat'

function App() {
  const [loadClient, setLoadClient] = useState(true);

  return (
    <>
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        STOPPA CLIENT
      </button>
      {loadClient ? <Chat /> : null}
    </>
  );
}

export default App;