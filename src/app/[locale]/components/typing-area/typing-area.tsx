import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

const TypingArea = () => {
  // const { text, typedText, setTypedText } = useTextStore((state) => ({
  //   text: state.text,
  //   typedText: state.typedText,
  //   setTypedText: state.setTypedText,
  // }));

  const { cpm, wpm, updatedTypingSpeed, resetTyping, decreaseCPM, typedCharacters } = useTypingStore();
  const { text, setText, typedText, setTypedText } = useTextStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  const [visibleContent, setVisibleContent] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [totalTypedLength, setTotalTypedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [lastTypedTime, setLastTypedTime] = useState<number | null>(null);

  // const MAX_VISIBLE_CHARS = 250;
  // const debouncedUpdateTypingSpeed = useCallback(debounce(() => updatedTypingSpeed(), 200), []);

  useEffect(() => {
    // setVisibleContent(text.content.slice(0, MAX_VISIBLE_CHARS));
    setVisibleContent(text.contents[currentIndex]);
  }, [text]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastTyping = lastTypedTime ? (currentTime - lastTypedTime) / 1000 : 0;

      if (!isTyping && timeSinceLastTyping > 1) {
        // 타이핑이 없고, 1초 이상이 지나면 CPM 감소
        decreaseCPM();
      }
    }, 1000); // 1초마다 체크

    return () => clearInterval(interval);
  }, [isTyping, lastTypedTime, decreaseCPM]);


  useEffect(() => {
    console.log("typedCharacters", typedCharacters)
  }, [typedCharacters ]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  
    setIsTyping(true);
    setLastTypedTime(Date.now());
    const userInput = e.target.value;
    const newlyTypedChars = userInput.length - typedText.length;

    setTypedText(userInput);
  
    if (newlyTypedChars > 0) {
      updatedTypingSpeed(newlyTypedChars); // 여기서 추가된 문자 수만큼 업데이트
    }
  
    if (userInput.length > visibleContent.length) {
      // const nextStartIndex = totalTypedLength + userInput.length;
      // const nextEndIndex = nextStartIndex + MAX_VISIBLE_CHARS;
      
      // let nextVisibleContent = text.content.slice(nextStartIndex, nextEndIndex);
  
      // if (nextVisibleContent.charAt(0) === " ") {
      //   nextVisibleContent = nextVisibleContent.trimStart();
      // }
  
      setTypedText("");
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        setVisibleContent(text.contents[nextIndex]);
        return nextIndex;
      });
      // setVisibleContent(text.contents[currentIndex]);
      // setTotalTypedLength(nextStartIndex);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
