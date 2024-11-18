import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect, useRef, useState } from "react";
import decomposeKorean from "./decompose-korean";

const TypingArea = () => {
  const { updatedTypingSpeed, resetTyping, decreaseCPM, addCorrectCharacters, accuracy } = useTypingStore();
  const { text, typedText, decomposedText, setTypedText, setDecomposedText } = useTextStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleContent, setVisibleContent] = useState<string>("");
  // const [decomposedContent, setDecomposedContent] = useState<string[][]>([]);
  const [decomposedTyped, setDecomposedTyped] = useState<string[][]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  // setDecomposedText(text.contents[0]);

  // 현재 타이핑할 텍스트 설정
  useEffect(() => {
    const currentText = text.contents[currentIndex];
    setVisibleContent(currentText);

    const decomposed = currentText.split("").map(decomposeKorean);
    console.log("분리된 컨텐츠", decomposed);
    setDecomposedText(decomposed)
  }, [text, currentIndex]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    const decomposedNewText = newText.split("").map(decomposeKorean);
    setDecomposedTyped(decomposedNewText);
    // console.log("자소별 입력된 문자", decomposedNewText);

    // 수정할 점
    // 한글 입력시 자소별로 문자를 구분해 틀린경우 빨간색으로 표현할 것
    // 자소 별로 맞게 입력하고 있을때는 정상 색상 표현

    // 커서가 이동했을 때 이전 문자를 확인하는 로직

    // if (newText.length > typedText.length) {
    //   const prevCharIndex = newText.length - 2; // 바로 이전 문자 인덱스
    //   const prevCharTyped = newText[prevCharIndex];
    //   const prevCharCorrect = visibleContent[prevCharIndex];

    //   if (prevCharTyped === prevCharCorrect) {
    //     addCorrectCharacters();
    //     updatedTypingSpeed(1);
    //   } else {
    //     setShakingIndex(prevCharIndex); // 틀린 문자에 애니메이션 효과
    //     setTimeout(() => setShakingIndex(null), 200);
    //   }
    // }
    const lastIndex = decomposedNewText.length - 1;

    if (lastIndex >= 0) {
      const lastTypedChar = decomposedNewText[lastIndex];
      const lastCorrectChar = decomposedText[lastIndex];
  
      // 두 자소 배열을 비교
      const isCorrect = lastTypedChar.every((char, index) => char === lastCorrectChar[index]);
      
      // 한 음절이 끝나기전 "바다"를 입력할때 "바"까지는 일치, "받" "ㅏ"를 치기전에는 불일치가 발생하는 로직 수정

      if (isCorrect) {
        console.log("일치");
        addCorrectCharacters();
        updatedTypingSpeed(1);
      } else {
        console.log("불일치");
        setShakingIndex(lastIndex); // 틀린 자소에 애니메이션 효과
        setTimeout(() => setShakingIndex(null), 200);
      }
    }

  // if (lastIndex >= 0) {
  //   const lastTypedChar = decomposedNewText[lastIndex];
  //   console.log("마지막 입력된 자소", lastTypedChar);
  //   const lastCorrectChar = decomposedText[lastIndex];
  //   console.log("실제 입력해야 할 마지막 자소", lastCorrectChar);

  //   // 마지막 자소가 맞는지 확인
  //   if (lastTypedChar === lastCorrectChar) {
  //     console.log("일치함");
  //     addCorrectCharacters();
  //     updatedTypingSpeed(1);
  //   } else {
  //     setShakingIndex(lastIndex); // 틀린 자소에 애니메이션 효과
  //     setTimeout(() => setShakingIndex(null), 200);
  //   }
  // }

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
