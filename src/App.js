import React, { useState } from "react"; 
import Chat from './Chat'

function App() {
  const [loadClient, setLoadClient] = useState(true);

  return (
    <>
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        STOP CLIENT
      </button>
      {loadClient ? <Chat /> : null}
    </>
  );
}

export default App;