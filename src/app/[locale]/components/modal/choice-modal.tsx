import { useCharacterStore } from "@/store/use-character-store";
import { useChoice } from "@/store/use-choice";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect } from "react";

interface ChoiceState {
  isOpen: boolean;
}

const ChoiceModal = ({ isOpen }: ChoiceState) => {
  const { onClose, onOpen } = useChoice();
  const { changeJob } = useCharacterStore();
  const { sentenceNumber } = useTypingStore();

  if (!isOpen) return null;

  useEffect(() => {
    if (sentenceNumber === 1) {
      onOpen();
    }
  }, [sentenceNumber, onOpen]);

  const handleChangeJob = (job: string) => {
    changeJob(job);
    onClose();
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 z-50 flex justify-center items-center">
      <div className="flex space-x-8">
        {/* Fireball Choice */}
        <div 
          className="relative bg-gradient-to-br cursor-pointer from-red-500 to-orange-700 p-6 w-64 h-72 rounded-lg shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          onClick={() =>handleChangeJob("Fire vizard")}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30 rounded-lg z-0"></div>
          <img
            src="/game_images/skills/painterly-spell-icons-1/fireball-red-2.png"
            alt="Fireball"
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
          onClick={() =>handleChangeJob("Wanderer Magician")}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30 rounded-lg z-0"></div>
          <img
            src="/game_images/skills/painterly-spell-icons-2/ice-blue-2.png"
            alt="Ice Blast"
            className="z-10 w-24 h-24 mx-auto rounded-full border-4 border-blue-300 shadow-lg"
          />
          <h3 className="text-lg font-bold text-blue-300 mt-4 text-center">
            Ice Blast
          </h3>
          <p className="text-sm text-gray-300 text-center mt-4">
            적의 움직임을 느리게 얼립니다.
          </p>
        </div>

        {/* Thunder Strike Choice */}
        <div 
          className="relative bg-gradient-to-br cursor-pointer from-yellow-400 to-purple-600 p-6 w-64 h-72 rounded-lg shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          onClick={() =>handleChangeJob("Lightning Mage")}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30 rounded-lg z-0"></div>
          <img
            src="/game_images/skills/painterly-spell-icons-2/lightning-orange-2.png"
            alt="Thunder Strike"
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
