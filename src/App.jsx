import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://18.116.89.113:8000";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios.get(`${API_URL}/hello`)
      .then(response => setMessage(response.data.message))
      .catch(() => setMessage("Error contacting backend"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;

