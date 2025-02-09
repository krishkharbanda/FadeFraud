import { useState } from 'react';
import axios from 'axios';

export default function PostButton() {
    const [response, setResponse] = useState(null);
    const [input, setInput] = useState("");

    const sendData = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/data', {
                message: input
            });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendData}>Send Data to Flask</button>
            {response && <p>Response: {response}</p>}
        </div>
    );
}
