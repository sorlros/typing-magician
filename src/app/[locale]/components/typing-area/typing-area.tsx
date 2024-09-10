import { FileContentArray, TextItem } from "@/app/libs/types";
import { useTextStore } from "@/store/use-text-store";
import { useEffect, useRef, useState } from "react";
import { decomposeHangul } from "./decompose-hangul";

interface TypingAreaProps {
  text: TextItem;
}

const TypingArea = () => {
  const { text, typedText, setTypedText } = useTextStore((state) => ({
    text: state.text,
    typedText: state.typedText,
    setTypedText: state.setTypedText,
  }));

  const inputRef = useRef<HTMLInputElement>(null);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  const isSpecialCharacter = (char: string) => {
    // 정규 표현식을 사용하여 알파벳, 숫자, 한글 외의 문자를 확인
    return !/^[a-zA-Z0-9가-힣\s]$/.test(char);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setTypedText(userInput);

    const lastIndex = userInput.length - 1;
    const currentChar = userInput[lastIndex];
    console.log("currentChar", currentChar);
    const correctChar = text.content[lastIndex];
    console.log("correctChar", correctChar);

    // const decompCurrentChar = decomposeHangul(currentChar);
    // const decompCorrectChar = decomposeHangul(correctChar);

    // const isIncorrect = !decompCorrectChar.includes(decompCurrentChar[0]);

    // if (isIncorrect) {
    //   setShakingIndex(lastIndex);
    //   setTimeout(() => setShakingIndex(null), 400); // 애니메이션 후 흔들리는 상태 해제
    // }

  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // 컴포넌트 로드 시 자동으로 포커스
    }
  }, []);

  const renderText = () => {
    return (
      <>
        {/* 유저가 입력한 부분 */}
        {typedText.split("").map((char, index) => {
          const correctChar = text.content[index]; // 올바른 텍스트와 비교
          const isCorrect = char === correctChar;
          const color = isCorrect ? "text-white" : "text-red-500"; // 올바르면 흰색, 틀리면 빨간색
          const isShaking = shakingIndex === index ? "shake" : "";

          return (
            <span key={index} className={`${color} ${isShaking}`}>
              {char}
            </span>
          );
        })}

        {/* 남은 부분 */}
        <span className="text-white animate-blink border-r-2" />

        {text.content.slice(typedText.length).split("").map((char, index) => (
          <span key={index} className="text-gray-400">
            {char}
          </span>
        ))}     
      </>
    );
  };
  
  return (
    <div>
      <div className="bg-black p-4 rounded-lg w-full h-[200px] overflow-hidden font-mono text-lg text-left leading-relaxed"
      >
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
}

export default TypingArea;

