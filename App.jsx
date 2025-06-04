import React, { useEffect, useState } from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getRandomWord, getFarewellText } from "./utils";

export default function AssemblyEndgame() {
  //State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetter, setGuessedLetter] = useState([]);

  //Derived values
  const numGuessesLeft = languages.length - 1;
  const wrongGuessedCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));
  const isGameLost = wrongGuessedCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetter[guessedLetter.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  //Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  function addGuessedLetter(letter) {
    setGuessedLetter((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetter.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWorng = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWorng,
    });
    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={guessedLetter.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter}
      </button>
    );
  });

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessedCount;

    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const className = clsx("chip", isLanguageLost && "lost");

    return (
      <span className={className} key={lang.name} style={styles}>
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord
    .split("")
    .map((letter, index) => (
      <span key={index}>{guessedLetter.includes(letter) ? letter : ""}</span>
    ));

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });
  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessedCount - 1].name)}
        </p>
      );
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly 😟 </p>
        </>
      );
    } else {
      null;
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `correct! The letter ${lastGuessedLetter} is in the word`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
          You have {numGuessesLeft} attempts left.
        </p>

        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetter.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      {isGameOver && <button className="newGameButton">New Game</button>}
    </main>
  );
}
