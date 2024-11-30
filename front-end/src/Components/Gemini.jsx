import axios from "axios";
import { useState } from "react";

const Gemini = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  async function GenerateAnswer() {
    try {
      setError(""); // Clear any previous errors
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCyxN7orXehWiSHkvoo8NmmhDwxfI5C9LI",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates.length > 0 &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0
      ) {
        setAnswer(response.data.candidates[0].content.parts[0].text);
      } else {
        setAnswer(`No valid response received.Error :${error}`);
      }
    } catch (err) {
      console.error("Error generating answer:", err);
      if (err.response) {
        // Errors from the API response
        setError(
          `Error: ${err.response.status} - ${err.response.data.error.message}`
        );
      } else if (err.request) {
        // No response received
        setError("Error: No response from Gemini. Please try again later.");
      } else {
        // Other errors
        setError(`Error: ${err.message}`);
      }
    }
  }

  return (
    <div
      className="font-lexend flex-col w-full bg-gradient-to-b from-customGradient1 to-customGradient2 rounded-md p-2"
      style={{
        width: "100%", // Full width within the right section
        maxWidth: "100%", // Prevent it from exceeding the parent's width
        height: "100%", // Take the full height of the right section
        overflow: "hidden", // Prevent the outer container from expanding
      }}
    >
      <h1 className="flex font-bold text-2xl place-self-center">
        Gemini AI by Google
      </h1>
      <div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-2 mt-4 mb-2 border-4 w-full border-gray-700 hover:border-customGradient1 rounded-md bg-white hover:bg-customGradient1 transition-colors duration-300"
          style={{
            width: "100%",
            maxHeight: "150px", // Limit question box height
            overflowY: "auto", // Scroll for long questions
          }}
        ></textarea>
      </div>
      <div>
        <button
          onClick={GenerateAnswer}
          className="hover:bg-black p-2 mb-2 rounded-md border-4 hover:text-white hover:border-gray-600 bg-button text-white border-customGradient2 transition-colors duration-300"
        >
          Generate Answer
        </button>
      </div>
      <div
        className="size-full"
        style={{
          flex: "1", // Make this section take the remaining space
          maxHeight: "300px", // Limit the height of the answer container
          overflowY: "auto", // Enable scrolling for long answers
        }}
      >
        <p
          className="p-2 mt-2 mb-4 border-4 w-full border-gray-700 hover:border-customGradient1 rounded-md bg-slate-200 hover:bg-customGradient1 transition-colors duration-300"
          style={{
            maxHeight: "100%", // Use the full height of the parent container
            overflowY: "auto", // Scroll when the content overflows
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};
export default Gemini;
