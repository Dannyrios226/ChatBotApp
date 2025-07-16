import React, { useState, useCallback, useEffect, useRef } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "Chanhos Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

export default function ChanhoChatBot() {
  const [messages, setMessages] = useState([]);
  const qandaBank = [
    {
      question: "Name three things AREN'T Jackie Chan",
      answer: "toothpick, toothpaste, Jackie Chan",
    },
    {
      question: "Who wrote The Raven (And its NOT Jackie Chan)",
      answer: "Edgar Allen Poe",
    },
    {
      question: "Who is the CEO of Snapchat (And its NOT Jackie Chan)",
      answer: "Evan Spiegel",
    },
  ];

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!"
      );
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

  const qIndRef = useRef(0);

  const cycleThroughQuestions = () => {
    const returnQ = qandaBank[qIndRef.current]["question"];
    return returnQ;
  };

  const hangManBank = [
    "Jackie Chan",
    "Yao Ming",
    "Bruce Lee",
    "Donnie Yen",
    "Andrew Yang",
  ];
  const hangManBlankRef = useRef("");
  const currWordRef = useRef('');
  const currWordListRef = useRef([]);

  const initHangman = () => {
    const re = new RegExp("[a-zA-Z]", "g");
    currWordRef.current = (
      hangManBank[Math.floor(Math.random() * (hangManBank.length - 1))]
    );
    console.log(currWordRef.current);

    hangManBlankRef.current = currWordRef.current.replaceAll(re, "_");
    hangManBlankRef.current = hangManBlankRef.current.split("");
    currWordListRef.current = (currWordRef.current.split(""));
  };

  const hangmanGame = (reset, userInput) => {
    console.log(hangManBlankRef.current);
    if (reset) {
      hangManBlankRef.current = "";
      currWordRef.current = "";
      return "type yes to play again";
      startRef.current = false;
    } else { //if not reset
      if (userInput.length > 1) {
        if (userInput == currWordRef.current.toLowerCase()){
          return "Correct!"
        }
        else {
          return "Bad guess"
        }
      }
      
      //If the user put one word
      const tempRe = new RegExp(`.*${userInput}.*`);
      const letterRe = new RegExp(`.*[a-zA-Z].*`);
      if (currWordRef.current.toLowerCase().match(tempRe)) {
        //Iterate through blanks, replace with guessed letter if right
        hangManBlankRef.current.forEach((element, index) => {
          if ((currWordListRef.current[index].toLowerCase() == userInput) && (hangManBlankRef.current[index] == "_")) {
            console.log('matched', userInput);
            hangManBlankRef.current[index] = currWordListRef.current[index];
          }
          else {
            hangManBlankRef.current[index] = (element == " " ? " " : (!element.match(letterRe) ?  "_" : hangManBlankRef.current[index]));
          }
        });
        return hangManBlankRef.current;
      }

      else{
        return "incorrect";
      }
    }
  };

  const startRef = useRef(false);

  const respondToUser = (userMessages) => {
    console.log("Recent user msg:", userMessages[0].text);
    //If ueser didnt say yes, keep asking for it
    if (!startRef.current) {
      if (userMessages[0].text.toLowerCase() != "yes") {
        addBotMessage("Please say yes to start");
      } else {
        addBotMessage("Here we go!");
        // addBotMessage(cycleThroughQuestions());
        initHangman();
        addBotMessage("Here is your word: ");
        addBotMessage(hangManBlankRef.current);
        startRef.current = true;
      }
    }

    //When the user says yes and starts the game, progress through hangman game
    else {
      if (userMessages[0].text.toLowerCase() != 'reset'){
        addBotMessage(hangmanGame(false, userMessages[0].text.toLowerCase()));
      }

      else{
        addBotMessage(hangmanGame(true, ''));
      }
      
    }

    //When the user says yes and starts the game, cycle through questions
    // else {
    //   if (
    //     userMessages[0].text.toLowerCase() ==
    //     qandaBank[qIndRef.current]["answer"].toLowerCase()
    //   ) {
    //     addBotMessage("Correct!");
    //     qIndRef.current += 1;
    //     if (qIndRef.current > qandaBank.length) {
    //       qIndRef.current = 0;
    //     }
    //     console.log(qIndRef.current);
    //     addBotMessage(cycleThroughQuestions());
    //   } else {
    //     addBotMessage("So close!");
    //   }
    // }
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