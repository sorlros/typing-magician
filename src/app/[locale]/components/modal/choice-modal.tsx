"use client";

import Image from "next/image";
import { useCharacterStore } from "@/store/character-store";
import { useChoice } from "@/store/use-choice";
import { useInteractStore } from "@/store/interact-store";
import { useMonsterStore } from "@/store/monster-store";
import useStageStore from "@/store/stage-store";
import { useTypingStore } from "@/store/typing-store";
import { useEffect, useReducer } from "react";

const ChoiceModal = () => {
  const { onClose, onOpen, isOpen } = useChoice();
  const { changeJob } = useCharacterStore();
  const { resetTyping } = useTypingStore();
  const { setModalState } = useStageStore(
    (state) => ({
      setModalState: state.setModalState,
    })
  );
  const sentenceNumber = useTypingStore((state) => state.sentenceNumber);
  const setAppearMonster = useMonsterStore.getState().setAppearMonster;
  const setIsLoading = useInteractStore.getState().setIsLoading;

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (sentenceNumber === 1) {
      onOpen();
    }
    return;
  }, [sentenceNumber]);

  const handleChangeJob = (job: string) => {
    changeJob(job);
    // resetTyping();
    setModalState("close");
    setAppearMonster(true);
    setIsLoading(false);
    onClose();
    forceUpdate();

    setTimeout(() => {
      const inputElement = document.querySelector<HTMLInputElement>(
        "#typingInput"
      );
      inputElement?.focus();
    }, 300);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-80 z-50 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      data-state={isOpen ? "open" : "closed"}
    >
      <div
        className={`flex space-x-8 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-10"
        }`}
      >
        {/* Fireball Choice */}
        <div
          className="relative bg-gradient-to-br cursor-pointer from-red-500 to-orange-700 p-6 w-64 h-72 rounded-lg shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          onClick={() => handleChangeJob("Fire vizard")}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30 rounded-lg z-0"></div>
          <Image
            src="/game_images/skills/painterly-spell-icons-1/fireball-red-2.png"
            alt="Fireball"
            width={96}
            height={96}
            className="z-10 w-24 h-24 mx-auto rounded-full border-4 border-yellow-500 shadow-lg"
          />
          <h3 className="text-lg font-bold text-yellow-300 mt-4 text-center">
            Fireball
          </h3>
          <p className="text-sm text-gray-300 text-center mt-4">
            강력한 불덩이를 소환해 적을 공격합니다.
          </p>
        </div>

        {/* Ice Blast Choice */}
        <div
          className="relative bg-gradient-to-br cursor-pointer from-blue-500 to-cyan-700 p-6 w-64 h-72 rounded-lg shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          onClick={() => handleChangeJob("Wanderer Magican")}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30 rounded-lg z-0"></div>
          <Image
            src="/game_images/skills/painterly-spell-icons-2/ice-blue-2.png"
            alt="Ice Blast"
            width={96}
            height={96}
            className="z-10 w-24 h-24 mx-auto rounded-full border-4 border-blue-300 shadow-lg"
          />
          <h3 className="text-lg font-bold text-blue-300 mt-4 text-center">
            Ice Blast
          </h3>
          <p className="text-sm text-gray-300 text-center mt-4">
            적을 얼어붙게하는 얼음을 소환합니다.
          </p>
        </div>

        {/* Thunder Strike Choice */}
        <div
          className="relative bg-gradient-to-br cursor-pointer from-yellow-400 to-purple-600 p-6 w-64 h-72 rounded-lg shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          onClick={() => handleChangeJob("Lightning Mage")}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30 rounded-lg z-0"></div>
          <Image
            src="/game_images/skills/painterly-spell-icons-2/lightning-orange-2.png"
            alt="Thunder Strike"
            width={96}
            height={96}
            className="z-10 w-24 h-24 mx-auto rounded-full border-4 border-purple-400 shadow-lg"
          />
          <h3 className="text-lg font-bold text-purple-300 mt-4 text-center">
            Thunder Strike
          </h3>
          <p className="text-sm text-gray-300 text-center mt-4">
            강렬한 번개로 적을 공격합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
