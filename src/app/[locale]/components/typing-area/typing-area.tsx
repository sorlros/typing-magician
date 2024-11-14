import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect, useRef, useState } from "react";

const TypingArea = () => {
  const { updatedTypingSpeed, resetTyping, decreaseCPM, addCorrectCharacters, accuracy } = useTypingStore();
  const { text, typedText, setTypedText } = useTextStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleContent, setVisibleContent] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  // 현재 타이핑할 텍스트 설정
  useEffect(() => {
    setVisibleContent(text.contents[currentIndex]);
  }, [text, currentIndex]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    // 수정할 점
    // 한글 입력시 자소별로 문자를 구분해 틀린경우 빨간색으로 표현할 것
    // 자소 별로 맞게 입력하고 있을때는 정상 색상 표현
    
    // 커서가 이동했을 때 이전 문자를 확인하는 로직
    if (newText.length > typedText.length) {
      const prevCharIndex = newText.length - 2; // 바로 이전 문자 인덱스
      const prevCharTyped = newText[prevCharIndex];
      const prevCharCorrect = visibleContent[prevCharIndex];

      if (prevCharTyped === prevCharCorrect) {
        addCorrectCharacters();
        updatedTypingSpeed(1);
      } else {
        setShakingIndex(prevCharIndex); // 틀린 문자에 애니메이션 효과
        setTimeout(() => setShakingIndex(null), 200);
      }
    }

    setTypedText(newText);

    // 다음 문장으로 넘어가기
    if (newText.length >= visibleContent.length) {
      setTypedText("");
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        setVisibleContent(text.contents[nextIndex] || "");
        return nextIndex;
      });
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
