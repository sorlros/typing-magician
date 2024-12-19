import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import useCharacterSituationStore from "./use-character-situation-store";
import { useInteractStore } from "./use-interact-store";

interface CharacterState {
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  characterImage: string;
  currentJob: string;
  changeJob: (job: string) => void;
  hp: number;
  updateCharacterSettings: (actionValue: string) => void;
  reduceHp: (amount: number) => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  currentJob: "Fire vizard",
  characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
  hp: 100,
  changeJob: (job) => {
    set({ currentJob: job })
  },
  updateCharacterSettings: (characterAction) => {
    const typingSpeed = useTypingStore.getState().cpm;
    const currentJob = get().currentJob;
    // const { characterAction } = useInteractStore.getState();
    
    let totalFrames: number;
    let action: "Idle" | "Walk" | "Run" | "Hurt" | "Dead" | "Attack" | "Skill" = "Idle";
    let frameJob: "Fire_vizard" | "Wanderer_Magican" | "Lightning_Mage" = "Fire_vizard";

    // 캐릭터 행동 변수 정의
    if (characterAction === "Dead") {
      action = "Dead";
    } else if (characterAction === "Hurt") {
      action = "Hurt";
    } else if (characterAction === "Attack") {
      action = "Attack";
    } else if (characterAction === "Idle" && typingSpeed > 150) {
      action = "Run";
    } else if (characterAction === "Idle" && typingSpeed > 0) {
      action = "Walk";
    } else if (characterAction === "Idle" && typingSpeed === 0) {
      action = "Idle";
    } else if (characterAction === "Skill") {
      action = "Skill";
    }
    
    if (currentJob === "Fire vizard") {
      frameJob = "Fire_vizard"
    } else if (currentJob === "Wanderer Magican") {
      frameJob = "Wanderer_Magican"
    } else if (currentJob === "Lightning Mage") {
      frameJob = "Lightning_Mage"
    } else {
      frameJob = "Fire_vizard"
    }

    const framesMap = {
      Fire_vizard: { Idle: 7, Walk: 6, Run: 8, Hurt: 3, Dead: 6, Attack: 4, Skill: 14 },
      Wanderer_Magican: { Idle: 8, Walk: 7, Run: 8, Hurt: 4, Dead: 4, Attack: 9, Skill: 16 },
      Lightning_Mage: { Idle: 7, Walk: 7, Run: 8, Hurt: 3, Dead: 5, Attack: 10, Skill: 12 },
    };
  
    totalFrames = framesMap[frameJob][action]

    let setFrameDuration;

    // frameDuration 설정
    if (action === "Dead") {
      setFrameDuration = 300;
    } else if (action === "Hurt") {
      setFrameDuration = 200;
    } else if (action === "Attack") {
      setFrameDuration = Math.max(100, Math.min(10000 / typingSpeed, 1000));
    } else if (action === "Run") {
      setFrameDuration = 100;
    } else if (action === "Walk") {
      setFrameDuration = 200;
    } else if (action === "Idle") {
      setFrameDuration = 300;
    } else if (action === "Skill") {
      setFrameDuration = 600;
    }

    set({
      characterImage: `url("game_images/character-wizard/${currentJob}/${action}.png")`,
      totalFrames,
      frameWidth: 200,
      frameHeight: 200,
      frameDuration: setFrameDuration,
    });






    // if(characterAction === "Skill") {
    //   set({

    //   })
    // }

    // if (characterAction === "Dead") {
    //   set({
    //     totalFrames: 6,
    //     frameWidth: 200,
    //     frameHeight: 200,
    //     frameDuration: 300,
    //     characterImage: `url("/game_images/character-wizard/${currentJob}/Dead.png")`,
    //   });
    // } else if (characterAction === "Hurt") {
    //   set({
    //     totalFrames: 3,
    //     frameWidth: 200,
    //     frameHeight: 200,
    //     frameDuration: 200,
    //     characterImage: `url("/game_images/character-wizard/${currentJob}/Hurt.png")`,
    //   });
    // } else if (characterAction === "Attack") {
    //   set({
    //     totalFrames: 4,
    //     frameWidth: 200,
    //     frameHeight: 200,
    //     frameDuration: Math.max(100, Math.min(10000 / typingSpeed, 1000)),
    //     characterImage: `url("/game_images/character-wizard/${currentJob}/Attack_2.png")`,
    //   });
    // } else if (characterAction === "Idle" && typingSpeed > 150) {
    //   set({
    //     totalFrames: 8,
    //     frameWidth: 200,
    //     frameHeight: 200,
    //     frameDuration: 100,
    //     characterImage: `url("/game_images/character-wizard/${currentJob}/Run.png")`,
    //   });
    // } else if (characterAction === "Idle" && typingSpeed > 0) {
    //   set({
    //     totalFrames: 6,
    //     frameWidth: 200,
    //     frameHeight: 200,
    //     frameDuration: 200,
    //     characterImage: `url("/game_images/character-wizard/${currentJob}/Walk.png")`,
    //   });
    // } else {
    //   set({
    //     totalFrames: 7,
    //     frameWidth: 200,
    //     frameHeight: 200,
    //     frameDuration: 300,
    //     characterImage: `url("/game_images/character-wizard/${currentJob}/Idle.png")`,
    //   });
    // }
  },

  reduceHp: (amount) => {
    const currentJob = get().currentJob;
    set((state) => {
      const newHp = Math.max(state.hp - amount, 0);
      return {
        hp: newHp,
        ...(newHp <= 0 && {
          totalFrames: 6,
          frameWidth: 200,
          frameHeight: 200,
          frameDuration: 300,
          characterImage: `url("/game_images/character-wizard/${currentJob}/Dead.png")`,
        })
      }
    })
  }
}))