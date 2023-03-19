
import { Button, TextField, Box, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import "./contact.css";
import { useRef, useState, useEffect } from 'react';
import axios from "axios";


function Contact() {

    const [myMessages, setMyMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")


    const scrollToBottom = () => {
        let messageWindow = document.querySelector('#messageWindow')
        messageWindow.scrollTo(0, messageWindow.scrollHeight);
    }

    useEffect(() => {
        scrollToBottom();
    }, [myMessages])

    const sendMessage = async (e) => {
        e.preventDefault();

        console.log("newMessage: ", newMessage);

        setMyMessages((prev) => {
            return [...prev, { text: newMessage, from: "user" }]
        })

        let response = await axios.post('http://localhost:5001/message', {
            query: newMessage
        })

        setMyMessages((prev) => {
            return [...prev, {
                text: response?.data?.message?.text,
                from: "bot"
            }]
        })



        e.target.reset()
    }


    return <Box>

        <div id="messageWindow" className='messageWindow'>

            {myMessages.map((eachMessage, key) => {
                if (eachMessage.from === "bot") {
                    return <div key={key} className='leftBallon messageBallon'>
                        <div>
                            <b>{eachMessage.from}:</b> <span>{eachMessage.text}</span>
                        </div>
                    </div>
                } else {
                    return <div key={key} className='rightBallon messageBallon'>
                        <div>
                            <b>{eachMessage.from}:</b> <span>{eachMessage.text}</span>
                        </div>
                    </div>
                }
            })}
        </div>



        <form onSubmit={sendMessage}>

            <Box sx={{ position: 'fixed', bottom: 0, width: "100%", display: 'flex' }}>
                <TextField onChange={(e) => { setNewMessage(e.target.value) }} sx={{ width: "85%" }} id="outlined-basic" placeholder='type a new message' variant="outlined" />
                <Box>
                    <IconButton aria-label="send" size="large" type='submit'>
                        <Send fontSize="inherit" />
                    </IconButton>
                </Box>
            </Box>
        </form >
    </Box>
}
export default Contact
