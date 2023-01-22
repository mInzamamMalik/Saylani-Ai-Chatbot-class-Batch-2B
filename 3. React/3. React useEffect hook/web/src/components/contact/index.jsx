
import { Button, TextField, Box, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import "./contact.css";
import { useRef, useState } from 'react';



function Contact() {

    const [myMessages, setMyMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")


    const sendMessage = (e) => {
        e.preventDefault();

        console.log("newMessage: ", newMessage);

        setMyMessages([...myMessages, newMessage])

        e.target.reset()
    }



    return <Box>

        <div className='messageWindow'>


            <div className='leftBallon messageBallon'>
                this is a text message
            </div>
            <div className='leftBallon messageBallon'>
                this is a text message
            </div>
            <div className='rightBallon messageBallon'>
                this is a text message
            </div>
            <div className='rightBallon messageBallon'>
                this is a text message
            </div>
            <div className='leftBallon messageBallon'>
                this is a text message
            </div>
            <div className='rightBallon messageBallon'>
                this is a text message
            </div>

            {myMessages.map((eachMessage, key) => {
                return <div key={key} className='leftBallon messageBallon'>
                    {eachMessage}
                </div>
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
