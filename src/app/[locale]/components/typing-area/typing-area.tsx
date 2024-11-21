import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect, useRef, useState } from "react";
import decomposeKorean from "./decompose-korean";

const TypingArea = () => {
  const { updatedTypingSpeed, resetTyping, decreaseCPM, addCorrectCharacters, accuracy } = useTypingStore();
  const { text, typedText, decomposedText, setTypedText, setDecomposedText } = useTextStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleContent, setVisibleContent] = useState<string>("");

  const [decomposedTyped, setDecomposedTyped] = useState<string[][]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  // 현재 타이핑할 텍스트 설정
  useEffect(() => {
    const currentText = text.contents[currentIndex];
    setVisibleContent(currentText);

    const decomposed = currentText.split("").map(decomposeKorean);
    console.log("분리된 컨텐츠", decomposed);
    setDecomposedText(decomposed)
  }, [text, currentIndex]);


  // 입력 한 문자 자소별, 입력 할 문자 자소별 비교하기
  const isPartiallyEqual = (typedArray: string[][], correctArray: string[][]): boolean => {
    if (typedArray.length > correctArray.length) {
      return false;
    }
  
    return typedArray.every((typedChar, index) => {
      const correctChar = correctArray[index];

      return typedChar.every((char, charIndex) => char === correctChar[charIndex]);
    });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    const decomposedNewText = newText.split("").map(decomposeKorean);
    setDecomposedTyped(decomposedNewText);
    
    const lastIndex = decomposedNewText.length - 1;

    if (lastIndex >= 0) {
      const lastTypedChar = decomposedNewText[lastIndex];
      const lastCorrectChar = decomposedText[lastIndex];
  
      // 현재 입력된 자소가 목표 자소의 일부와 일치하는지 확인
      const isPartialMatch = lastTypedChar.every(
        (char, index) => char === lastCorrectChar[index]
      );

      // 완전히 일치했는지 확인
      const isFullMatch =
        lastTypedChar.length === lastCorrectChar.length &&
        lastTypedChar.every((char, index) => char === lastCorrectChar[index]);

      if (isFullMatch) {
        // 완전 일치
        // console.log("완전 일치");
        addCorrectCharacters();
        updatedTypingSpeed(1);
      } else if (isPartialMatch) {
        // 부분 일치
        // 아무 동작도 하지 않음
        void 0;
      } else {
        // 불일치
        // console.log("불일치");
        setShakingIndex(lastIndex); // 틀린 자소에 애니메이션 효과
        setTimeout(() => setShakingIndex(null), 150);
      }
    } 

    setTypedText(newText);

    /// 정확도 로직 개선하기

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
    const decomposedTyped = typedText.split("").map(decomposeKorean);
    const decomposedContent = decomposedText;

    const decomposedContentMap = decomposedContent.map((correctCharArray, index) => {
      const typedCharArray = decomposedTyped[index] || [];
      const isCorrect = isPartiallyEqual([typedCharArray], [correctCharArray]);

      const color = isCorrect ? "text-white" : "text-red-500";
      const isShaking = shakingIndex === index ? "shake" : "";

      return {
        displayedChar: typedText[index],
        color,
        isShaking,
      };
    })

    return (
      <>
        {decomposedContentMap.map(({ displayedChar, color, isShaking }, index) => (
          <span key={index} className={`${color} ${isShaking}`}>
            {displayedChar}
          </span>
        ))}

        {/* {typedText.split("").map((char, index) => {
          const correctChar = visibleContent[index];
          const isCorrect = char === correctChar;
          const color = isCorrect ? "text-white" : "text-red-500";
          const isShaking = shakingIndex === index ? "shake" : "";

          return (
            <span key={index} className={`${color} ${isShaking}`}>
              {char}
            </span>
          );
        })} */}

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
