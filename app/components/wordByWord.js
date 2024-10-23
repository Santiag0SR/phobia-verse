import {useState, useEffect} from "react";

// WordByWord component for smooth fade-in effect for each word
const WordbyWord = ({text, delay = 500}) => {
  const [visibleWords, setVisibleWords] = useState([]); // State to store the visible words
  const words = text.split(" "); // Split the text into an array of words

  useEffect(() => {
    let currentWordIndex = 0;

    const revealNextWord = () => {
      // Add the current word to the visible words
      setVisibleWords((prev) => [...prev, words[currentWordIndex]]);
      currentWordIndex++;

      // If we still have more words to show, call the next one
      if (currentWordIndex < words.length) {
        setTimeout(revealNextWord, delay); // Delay before showing the next word
      }
    };

    if (words.length > 0) {
      revealNextWord(); // Start the process
    }

    // Clean up in case the component unmounts
    return () => {
      currentWordIndex = words.length; // Prevent continuing after unmount
    };
  }, [words, delay]);

  return (
    <p className="text-white">
      {visibleWords.map((word, index) => (
        <span key={index} className="fade-in">
          {word}{" "}
        </span>
      ))}
    </p>
  );
};

export default WordbyWord;
