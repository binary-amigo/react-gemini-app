import React from "react";

const App = () => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);

  const surpriseOptions = [
    "Who won the latest Novel Peace Prize?",
    "How many countries are there in the world?",
    "What is the capital of France?",
    "What is the population of India?",
    "What is the currency of Japan?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const getResponse = async (query) => {
    if (!value) {
      setError("Please enter a query");
      return;
    }
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: chatHistory, message: value }),
      };

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{text: value}],
        },
        {
          role: "model",
          parts: [{text: data}],
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise me
        </button>
      </p>
      <div className="input-container">
        <input
          type="text"
          value={value}
          placeholder="When is Diwali?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse} onKeyDown={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((item, index) => (
          <div key={index}>
            <p className="answer">
              {item.role} : {item.parts[0].text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
