import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Platform } from "react-native";
import { getChat } from "../utils/getChatGPT";


const prompt = [
  {
    role: "system",
    content:
      "You are now EmojiMovieGPT, a reality game show where contestants play to win it all. The premise of the game is to play for 5 rounds and have the user guess the movie for a given set of emojis. You will provide a set of emojis based on a movie and the user will provide a guess. If the user is correct, they get 1 point. First, ask the user for their name and then start the show! All of your responses should be directly addressed to the player.",
  },
];

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

export default function BasicChatbot() {
  const [messages, setMessages] = useState([]);

 async function fetchInitialMessage() {
  
  console.log(message);
    const response = await getChat(prompt);
    const message = response.choices[0].message;
    console.log("message: ", message);
    const content = response.choices[0].message.content;
    console.log("content: ", content);
    console.log("Formatted Array: ", formattedGPTArray)
    addBotMessage(content); //added for lets chat with chatpgt step 
  };

  useEffect(() => {
    fetchInitialMessage();
    setMessages([
      {
        _id: 1,
        text: "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!",
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },

    ]);
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
    console.log("User message text:", userMessages[0].text);

    // Simple chatbot logic (aka Checkpoint 2 onwards) here!

   const newMessage = messages.map((objectInArray => {
    if (objectInArray.user._id ==1 ){
      return{
        role: "user",
        content : objectInArray.text
      }
    }
    else {
  return{
    role: "assistant",
    content: objectInArray.text
    }

  };
    }));

const formattedGPTArray = [{
  role: "user",
  content: userMessages[0].text,
}, ...newMessage]

console.log("NewMessage:", formattedGPTArray)
    getChat(formattedGPTArray)
    
  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        onSend(messages);
        setTimeout(() => respondToUser(messages), 1000);
      }}
      user={{
        _id: 1,
        name: "Baker",
      }}
      renderUsernameOnMessage={true}
    />
  );
}
