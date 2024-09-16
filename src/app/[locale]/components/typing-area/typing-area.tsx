import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect, useRef, useState } from "react";

const TypingArea = () => {
  const { text, typedText, setTypedText } = useTextStore((state) => ({
    text: state.text,
    typedText: state.typedText,
    setTypedText: state.setTypedText,
  }));

  const { cpm, wpm, updatedTypingSpeed, resetTyping } = useTypingStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  const [visibleContent, setVisibleContent] = useState("");
  const [totalTypedLength, setTotalTypedLength] = useState(0);

  const MAX_VISIBLE_CHARS = 250;

  useEffect(() => {
    setVisibleContent(text.content.slice(0, MAX_VISIBLE_CHARS));
  }, [text]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setTypedText(userInput);
    updatedTypingSpeed(userInput.length + totalTypedLength);
    
    if (userInput.length > visibleContent.length) {
      const nextStartIndex = totalTypedLength + userInput.length;
      const nextEndIndex = nextStartIndex + MAX_VISIBLE_CHARS;
      
      let nextVisibleContent = text.content.slice(nextStartIndex, nextEndIndex);

      // 첫 문자가 공백이면 공백을 제거
      if (nextVisibleContent.charAt(0) === " ") {
        nextVisibleContent = nextVisibleContent.trimStart();
      }

      setTypedText("");
      setVisibleContent(nextVisibleContent);
      setTotalTypedLength(nextStartIndex);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    console.log("wpm", wpm);
    console.log("cpm", cpm);
  }, [wpm, cpm])

  const renderText = () => {
    return (
      <>
        {typedText.split("").map((char, index) => {
          const correctChar = visibleContent[index];
          const isCorrect = char === correctChar;
          const color = isCorrect ? "text-white" : "text-red-500";
          const isShaking = shakingIndex === index ? "shake" : "";

          return (
            <span key={index} className={`${color} ${isShaking}`}>
              {char}
            </span>
          );
        })}

        <span className="text-white animate-blink border-r-2" />

        {visibleContent.slice(typedText.length).split("").map((char, index) => (
          <span key={index} className="text-gray-400">
            {char}
          </span>
        ))}
      </>
    );
  };
  
  return (
    <div>
      <div className="flex w-full h-[50px] items-center">
        asd
      </div>
      <div className="bg-black p-4 rounded-lg w-full h-[210px] overflow-hidden font-mono text-lg text-left leading-relaxed px-4 py-6">
        <div>{renderText()}</div>
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleTyping}
          className="opacity-0 absolute inset-0"
          autoFocus
        />
      </div>
    </div>
  );
};

export default TypingArea;
