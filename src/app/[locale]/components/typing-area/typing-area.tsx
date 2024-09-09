import { FileContentArray, TextItem } from "@/app/libs/types";
import { useTextStore } from "@/store/use-text-store";
import { useEffect, useRef } from "react";

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

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setTypedText(userInput); // 유저 입력 업데이트
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

          return (
            <span key={index} className={color}>
              {char}
            </span>
          );
        })}

        {/* 남은 부분 */}
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
    {/* 타이핑할 공간과 보여줄 공간을 같은 공간으로 처리 */}
    <div className="bg-black p-4 rounded-lg w-full h-[200px] overflow-hidden font-mono text-lg text-left leading-relaxed">
      <div>{renderText()}</div>
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleTyping}
        className="opacity-0 absolute inset-0"
        autoFocus
      />
      <div className="absolute bottom-2 right-2 h-6 w-1 bg-white animate-pulse" />
    </div>
  </div>
  );
}

export default TypingArea;