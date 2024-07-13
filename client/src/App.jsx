import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000',{
  withCredentials: true,
});
function App() {
  const [message, setMessage] = useState('')  ;
  const [room,setRoom]=useState('');
  const [socketID,setSocketID]=useState('');
  const [messages,setMessages]=useState([]);
  const [roomName,setRoomName]=useState('');
  
  console.log(messages);

  const handleSent = (e) => {
    e.preventDefault();
    socket.emit('message', {message,room});
    setMessage('');  // Clear the input field after sending the message
  };
  const handleJoinRoom=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName);
    setRoomName('')
  }
  useEffect(() => {
    socket.on('connect', () => {
      setSocketID(socket.id);
      console.log('connected', socket.id);
    });
    socket.on('welcome', (s) => {
      console.log(s);
    });
    socket.on('message-receive', (s) => {
      setMessages((messages)=>[...messages,s])
      console.log(s);
    });

    // Cleanup function to avoid memory leaks
    return () => {
      socket.off('connect');
      socket.off('welcome');
      socket.off('message-receive');
    };
  }, []);

  return (
    <>
    {socketID}
    <form onSubmit={handleJoinRoom}>
      <input type='text' placeholder='enter room name ' value={roomName} onChange={(e)=>{setRoomName(e.target.value)}} />
      <button type='submit'>Join</button>
    </form>
      <form onSubmit={handleSent}>
        <input
          type="text"
          name='message'
          placeholder='Enter your message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
         <input
          type="text"
          name='room'
          placeholder='Enter your room'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      {
        messages.map((m,i)=>{
          return <div key={i}>{m}</div>
        })
      }
    </>
  );
}

export default App;
