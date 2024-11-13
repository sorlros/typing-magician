import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect, useRef, useState } from "react";

const TypingArea = () => {
  const { updatedTypingSpeed, resetTyping, decreaseCPM, addCorrectCharacters, correctCharacters, typedCharacters, accuracy } = useTypingStore();
  const { text, typedText, setTypedText } = useTextStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);
  const [visibleContent, setVisibleContent] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [lastTypedTime, setLastTypedTime] = useState<number | null>(null);

  // 타이핑할 텍스트 설정
  useEffect(() => {
    setVisibleContent(text.contents[currentIndex]);
  }, [text, currentIndex]);

  // 타이핑 속도 감소 관리
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastTyping = lastTypedTime ? (currentTime - lastTypedTime) / 1000 : 0;

      if (!isTyping && timeSinceLastTyping > 1) {
        decreaseCPM();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTyping, lastTypedTime, decreaseCPM]);

  // 타이핑 상태 관리
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    setLastTypedTime(Date.now());
    setTypedText(e.target.value);
  };

  // typedText가 변경될 때마다 문자 비교 및 상태 업데이트
  useEffect(() => {
    if (typedText.length > 0) {
      const newlyTypedChar = typedText[typedText.length - 1];
      const targetChar = visibleContent[typedText.length - 1];

      if (newlyTypedChar === targetChar) {
        updatedTypingSpeed(1);  // 타이핑 속도 및 정확도 업데이트
        addCorrectCharacters(); // 올바르게 입력한 문자 수 업데이트
      } else {
        // 틀린 글자 애니메이션 처리
        setShakingIndex(typedText.length - 1);
        setTimeout(() => setShakingIndex(null), 500);
      }
    }

    // 다음 문장으로 넘어가기
    if (typedText.length >= visibleContent.length) {
      setTypedText("");
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        setVisibleContent(text.contents[nextIndex] || ""); // 다음 내용 설정
        return nextIndex;
      });
    }
  }, [typedText, visibleContent, updatedTypingSpeed, addCorrectCharacters]);

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
        <div className="text-white">{accuracy} %</div>
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
