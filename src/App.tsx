import { Calendar } from './components/Calendar';
import React, { useState } from 'react';
import ApiKeyPopup from './components/ApiKeyPopup';

function App() {

  const [apiKey, setApiKey] = localStorage.getItem("api_key") ? useState(localStorage.getItem("api_key")) : useState("");

  /* Set a new API key value */
  const apiKeyfromPopup = (popupData: any) => {
    setApiKey(popupData);
  }

  return (
    <div>
      {(apiKey === "") ?
        (<ApiKeyPopup apiKeyfromPopup={apiKeyfromPopup} />) :
        (<Calendar apiKey={apiKey} />
        )}

    </div>
  )
}

export default App;
