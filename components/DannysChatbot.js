import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { add, set } from "react-native-reanimated";
import QUESTIONS from '../QUESTIONS.json';
const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "Dannys Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}





export default function App() {
  const [messages, setMessages] = useState([]);
  const [triviaMode, setTrviaMode] = useState(false);
  const [currentIndex,setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!"
      );
      setQuestions(shuffleArray(QUESTIONS));
    }
  }, []);

  const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      // console.log("PREVIOUS MESSAGES:", previousMessages);
      // console.log("NEW MESSAGE:", newMessages);
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    if(triviaMode === false){
      if (userMessages[0].text.toLowerCase() === "yes") {
        addBotMessage(questions[currentIndex].question);
        setTrviaMode(true);
      } 
      else{
      addBotMessage("SAY 'yes' to Start");
        }
      }

    if(triviaMode === true){
      if(currentIndex >= questions.length - 1){
        addBotMessage("Congratulations! You've completed the trivia game!");
        setTrviaMode(false);
      return;
      }

      if (userMessages[0].text.toLowerCase() === questions[currentIndex].answer) {
        addBotMessage("Correct! Next question: " )
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex) 
        addBotMessage(questions[nextIndex].question);
        console.log("Current Index:", currentIndex);
    }
      else{
        addBotMessage("Incorrect! The answer is: " + questions[currentIndex].answer);
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex) 
        addBotMessage(questions[nextIndex].question);
        console.log("Current Index:", currentIndex);
    }
  }

  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        onSend(messages);
        // Wait a sec before responding
        setTimeout(() => respondToUser(messages), 1000);
      }}
      user={{
        _id: 1,
        name: "Chilla",
      }}
      renderUsernameOnMessage={true}
    />
  );
}

// Workaround to hide an unnessary warning about defaultProps
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};