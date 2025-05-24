import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://18.116.89.113:8000/hello";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
  console.log("API_URL:", API_URL);  // Debugging line

  fetch(`${API_URL}/hello`)
    .then(res => res.json())
    .then(data => {
      console.log("Fetch response:", data);  // Debugging line
      setMessage(data.message);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      setMessage("Error contacting backend");
    });
}, []);


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
    </div>
  );
}
console.log("API_URL:", API_URL);


export default App;

