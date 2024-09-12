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

  const [visibleContent, setVisibleContent] = useState("");

  const MAX_VISIBLE_CHARS = 50;

  // const abc = text.content.slice(50, 200);
  // console.log("abc", abc)

  useEffect(() => {
    setVisibleContent(text.content.slice(0, MAX_VISIBLE_CHARS));
  }, [text])

  // useEffect(() => {
  //   if (typedText.length - 1 > visibleContent.length) {
  //     const nextStartIndex = typedText.length;
  //     const nextEndIndex = nextStartIndex + MAX_VISIBLE_CHARS;
  //     setVisibleContent(text.content.slice(nextStartIndex, nextEndIndex));
  //   }
  // }, [typedText, visibleContent, text.content]);


  const isSpecialCharacter = (char: string) => {
    // 정규 표현식을 사용하여 알파벳, 숫자, 한글 외의 문자를 확인
    return !/^[a-zA-Z0-9가-힣\s]$/.test(char);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setTypedText(userInput);

    const lastIndex = userInput.length - 1;
    const currentChar = userInput[lastIndex];
    // console.log("currentChar", currentChar);
    const correctChar = text.content[lastIndex];
    // console.log("correctChar", correctChar);
    console.log(typedText.length, MAX_VISIBLE_CHARS, "typedText.length")

    // console.log("userInput.length", userInput.length);


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
    useEffect(() => {
      if (typedText.length - 1 > visibleContent.length) {
        console.log("이콜")
        const nextStartIndex = typedText.length; // 입력된 문자수만큼 이후 시작
        const nextEndIndex = nextStartIndex + MAX_VISIBLE_CHARS; // 다음 200글자 범위 설정
        setVisibleContent(text.content.slice(nextStartIndex, nextEndIndex)); // 다음 200글자만 표시
      }
    }, [typedText])
    
    return (
      <>
        {/* 유저가 입력한 부분 */}
        {typedText.split("").map((char, index) => {
          const correctChar = visibleContent[index]; // 올바른 텍스트와 비교
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
      <div className="bg-black p-4 rounded-lg w-full h-[300px] overflow-hidden font-mono text-lg text-left leading-relaxed px-4 py-6"
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

