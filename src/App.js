import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/analytics'; 

import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAIpDKN3QTpvzUjAQF2KnzuJXrSpyoNU7o",
  authDomain: "chatigma.firebaseapp.com",
  projectId: "chatigma",
  storageBucket: "chatigma.appspot.com",
  messagingSenderId: "203138923025",
  appId: "1:203138923025:web:0f439280e10e76e081cfb0",
  measurementId: "G-23SN5DB6RT"
});

const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [nickname, setNickname] = useState('');
  const [hasNickname, setHasNickname] = useState(false);

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      setHasNickname(true);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>*Chatigma*</h1>
      </header>

      <section>
        {hasNickname ? (
          <ChatRoom nickname={nickname} />
        ) : (
          <form onSubmit={handleNicknameSubmit}>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
            />
            <button type="submit">Start Chatting</button>
          </form>
        )}
      </section>
    </div>
  );
}

function ChatRoom({ nickname }) {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      nickname
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} currentUserNickname={nickname} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type your message" />
        <button type="submit" disabled={!formValue}>Send</button>
      </form>
    </>
  );
}


// function ChatRoom({ nickname }) {
//   const dummy = useRef();
//   const messagesRef = firestore.collection('messages');
//   const query = messagesRef.orderBy('createdAt').limit(50);

//   const [messages] = useCollectionData(query, { idField: 'id' });
//   const [formValue, setFormValue] = useState('');

//   const sendMessage = async (e) => {
//     e.preventDefault();

//     await messagesRef.add({
//       text: formValue,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       nickname
//     });

//     setFormValue('');
//     dummy.current.scrollIntoView({ behavior: 'smooth' });
//   }

//   return (
//     <>
//       <main>
//       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} currentUserNickname={nickname} />)}
//         <span ref={dummy}></span>
//       </main>

//       <form onSubmit={sendMessage}>
//         <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type your message" />
//         <button type="submit" disabled={!formValue}>Send</button>
//       </form>
//     </>
//   );
// }

function ChatMessage(props) {
  const { text, nickname } = props.message;
  const isSentByCurrentUser = nickname === props.currentUserNickname; 
  const messageClass = isSentByCurrentUser ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      {isSentByCurrentUser && <p>{text}</p>} {}
      {!isSentByCurrentUser && <p><strong>{nickname}: </strong>{text}</p>} {}
    </div>
  );
}




export default App;