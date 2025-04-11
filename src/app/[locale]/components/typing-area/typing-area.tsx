"use client";

import { useTextStore } from "@/store/text-store";
import { useTypingStore } from "@/store/typing-store";
import { useCallback, useEffect, useRef, useState } from "react";
import decomposeKorean from "./decompose-korean";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import useStageStore from "@/store/stage-store";
import { useInteractStore } from "@/store/interact-store";
// import useNote from "@/app/hooks/use-note";

const TypingArea = () => {
  const {
    // startTime,
    // lastTypedTime,
    // cpm,
    updatedTypingSpeed,
    resetTyping,
    // decreaseCPM,
    setAccuracy,
    // accuracy,
    correctCharacters,
    setCorrectCharacters,
    setTypedCharacters,
    typedCharacters,
    // totalTypedCharacters,
    sentenceNumber,
    addSentenceNumber,
  } = useTypingStore(
    useShallow((state) => ({
      startTime: state.startTime,
      lastTypedTime: state.lastTypedTime,
      // cpm: state.cpm,
      updatedTypingSpeed: state.updatedTypingSpeed,
      resetTyping: state.resetTyping,
      // decreaseCPM: state.decreaseCPM,
      setAccuracy: state.setAccuracy,
      accuracy: state.accuracy,
      correctCharacters: state.correctCharacters,
      setCorrectCharacters: state.setCorrectCharacters,
      setTypedCharacters: state.setTypedCharacters,
      typedCharacters: state.typedCharacters,
      totalTypedCharacters: state.totalTypedCharacters,
      sentenceNumber: state.sentenceNumber,
      addSentenceNumber: state.addSentenceNumber,
    }))
  );

  const cpm = useTypingStore((state) => state.cpm);

  // Text 관련 상태 구독
  const {
    text,
    typedText,
    decomposedText,
    setTypedText,
    setDecomposedText,
    initializeIndex,
    currentIndex,
  } = useTextStore(
    useShallow((state) => ({
      text: state.text,
      typedText: state.typedText,
      decomposedText: state.decomposedText,
      setTypedText: state.setTypedText,
      setDecomposedText: state.setDecomposedText,
      initializeIndex: state.initializeIndex,
      currentIndex: state.currentIndex,
    })),
  );

  const { setModalState } = useStageStore(
    (state) => ({
      setModalState: state.setModalState
    })
  );
  const setUseSpecial = useInteractStore.getState().setUseSpecial;
  const useSpecial = useInteractStore.getState().useSpecial;
  const setCharacterAction = useInteractStore.getState().setCharacterAction;
  const setMonsterAction = useInteractStore.getState().setMonsterAction;

  // const useSound = useNote();

  const inputRef = useRef<HTMLInputElement>(null);

  const [visibleContent, setVisibleContent] = useState<string>("");
  const [realTimeAccuracy, setRealTimeAccuracy] = useState<number>(0);
  const [typingSpeed, setTypingSpeed] = useState<number>(0);

  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  useEffect(() => {
    initializeIndex();
  }, [initializeIndex]);

  // 현재 타이핑할 텍스트 설정
  useEffect(() => {
    if (text.contents.length > 0) {
      const currentText = text.contents[currentIndex];
      setVisibleContent(currentText);
      // setSentenceNumber(0);
  
      const decomposed = currentText.split("").map(decomposeKorean);
      setDecomposedText(decomposed);
    }
  }, [text, currentIndex]);
  
  useEffect(() => {
    const typingInterval = setInterval(() => {
      updatedTypingSpeed();
    }, 2000);
  
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (typedCharacters > 0) {
      // const typingAccuracy = setAccuracy()
      setRealTimeAccuracy(setAccuracy());
    }
  }, [typedCharacters, correctCharacters])

  const calculateTotalMatches = useCallback((newText: string) => {
    let totalMatches = 0;

    // 타이핑된 텍스트와 목표 텍스트를 비교
    for (let i = 0; i < newText.length; i++) {
      // 각 문자 비교 (불일치가 발생해도 계속 비교)
      if (newText[i] === visibleContent[i]) {
        totalMatches++;
      }
    }

    return totalMatches;
  }, [visibleContent]);

  const resetTypingState = () => {
    setTypedText("");
    // resetTyping();
    initializeIndex();
  };
  
  const loadNextSentence = () => {
    try {
      // 현재 문장을 초기화
      resetTypingState();
  
      // 새로운 문장으로 상태 업데이트
      setVisibleContent(text.contents[currentIndex]);
      // setIsLoading(true);

      if (sentenceNumber === 0) {
        setCharacterAction("Idle");
        setMonsterAction("Idle");
        setModalState("open");
      } 
      // 상태 변경이 완료된 이후 실행될 로직
      setTimeout(() => {
        addSentenceNumber();
        
        if (sentenceNumber > 0) {
          setUseSpecial(true);
          // console.log("useSpecial true?", useSpecial)
        }
      }, 0);
    } catch (error) {
      toast.error("새로운 문장을 불러오는데 실패했습니다.");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {

    const newText = e.target.value;

    // 커서의 현재 위치
    const cursorPosition = e.target.selectionStart || 0;

    // 커서가 위치한 곳까지의 텍스트 개수를 계산
    const typedCharacterCount = cursorPosition;
    setTypedCharacters(typedCharacterCount);
    // console.log("커서 위치 기준으로 타이핑한 문자 수:", typedCharacterCount);
    
    setTypedText(newText);

    if (newText.length > typedText.length) {
      const getCorrect = calculateTotalMatches(newText);
      setCorrectCharacters(getCorrect);
      const speed = updatedTypingSpeed();
      setTypingSpeed(speed);
    } else {
      void 0;
    }

    // 다음 문장으로 넘어가기 및 초기화
    if (newText.length >= visibleContent.length) {
      loadNextSentence();
    }
  };
  

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const renderText = () => {
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
        <div className="flex text-white mb-4">
          <div className="flex mr-4">
            {Math.round(realTimeAccuracy * 100)} %
          </div>
          <div className="flex">
            {`cpm: ${cpm}`}
          </div>
        </div>

        <div>{renderText()}</div>
      
        <input
          id="typingInput"
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleTyping}
          // onKeyDown={() => useSound.handleTyping()}
          className="opacity-0 absolute inset-0 z-0"
          // autoFocus
        />
      </div>
    </div>
  );
};

export default TypingArea;
