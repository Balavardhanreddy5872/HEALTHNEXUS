import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout2 from '../../components/Layout/Layout2';
import AdminMenu from '../../components/Layout/AdminMenu';

const UserIcon = () => <i className="fa fa-user" style={{ marginRight: '5px' }}></i>;
const EmailIcon = () =><i className="fa-regular fa-envelope" style={{ marginRight: '5px' }}></i>;
const MessageIcon = () => <i className="fa-regular fa-message" style={{marginRight:'5px'}}></i>

const Chat = () => { 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Fetch messages when the component mounts
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('https://healthnexus.onrender.com/api/blog/mymsg');
            setMessages(response.data.messages); // Assuming messages are in response.data.messages
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        try {
            console.log(newMessage);
            // Send the new message to all users
            await axios.post('https://healthnexus.onrender.com/api/blog/message', { message: newMessage });
            // Clear the new message input
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    

    return (
        <Layout2>
            <div className='container-fluid p-3'>
                <div className="row" style={{flexDirection:"row-reverse"}}>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <br/>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {messages.map(message => (
                                <div key={message._id} style={{ border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ padding: '20px' }}>
                                        <div>
                                            <UserIcon /> : <b>{message.sender.name}</b> <br/>
                                            <EmailIcon/> : <b>{message.sender.email}</b>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <MessageIcon/>
                                            <p>{message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Type your message here"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                style={{background:"#6b76ff",borderRadius:"15px"}}
                            ></textarea>
                            <button className='btn btn-success' style={{margin:"15px"}} onClick={handleSendMessage}>Send Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout2>
    );
};

export default Chat;
