import { CHATGPT_KEY } from "@env";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", `Bearer ${CHATGPT_KEY}`);
export const getChat = async (messages) => {
  const raw = JSON.stringify({
    model: "gpt-4.1-nano",
    messages: messages,
    temperature: 1,
    top_p: 1,
    n: 1,
    stream: false,
    max_tokens: 250,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );

  return await response.json();
};