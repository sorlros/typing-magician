import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { subscribeWithSelector } from "zustand/middleware";
import { useInteractStore } from "./use-interact-store";
import useStageStore from "./use-stage-store";

interface MonsterState {
  monsterNumber: number;
  setMonsterNumber: () => void;
  bossIndex: number;
  monsterImage: string;
  monsterHP: number;
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  updateMonsterSettings: (actionState: string) => void;
  appearMonster: boolean;
  setAppearMonster: (value: boolean) => void;
  monsterReduceHp: (amount: number) => void;
}

export const useMonsterStore = create(subscribeWithSelector<MonsterState>((set, get) => ({
  monsterNumber: 0,
  bossIndex: 1,
  monsterImage: "",
  monsterHP: 100,
  setMonsterNumber: () => {
      set((state) => {
        const { monsterNumber, bossIndex } = state;

        // 일반 몬스터에서 보스로 전환
        if (monsterNumber < 2) {
          return {
            monsterNumber: monsterNumber + 1,
            monsterHP: 100,
          };
        }

        // 보스 몬스터로 전환
        if (monsterNumber === 2) {
          return {
            monsterNumber: 3,
            monsterHP: 250,
            bossIndex,
          };
        }

        // 보스 몬스터 처리가 완료된 후 다시 일반 몬스터로 전환
        if (monsterNumber === 3) {
          // const nextBossIndex = bossIndex < 3 ? bossIndex + 1 : 1;
          const nextBossIndex = (bossIndex % 3) + 1; 

          return {
            monsterNumber: 0,
            monsterHP: 100,
            bossIndex: nextBossIndex,
          };
        }

        return state; // 기본 상태 유지
      });
    },
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  updateMonsterSettings: (monsterAction) => {
    const monsterNumber = useMonsterStore.getState().monsterNumber;
    const monsterHP = useMonsterStore.getState().monsterHP;
    const bossIndex = useMonsterStore.getState().bossIndex;
    const characterAction = useInteractStore.getState().characterAction;

    let action: "Idle" | "Hurt" | "Dead" | "Attack_1" = "Idle";
    let totalFrames: number;

    const framesMap = {
      Skeleton_Archer: { Idle: 7, Hurt: 2, Dead: 5, Attack_1: 5 },
      Skeleton_Spearman: { Idle: 7, Hurt: 3, Dead: 5, Attack_1: 4 },
      Skeleton_Warrior: { Idle: 7, Hurt: 2, Dead: 4, Attack_1: 5 },
      Gorgon_1: { Idle: 7, Hurt: 3, Dead: 3, Attack_1: 16 },
      Gorgon_2: { Idle: 7, Hurt: 3, Dead: 3, Attack_1: 16 },
      Gorgon_3: { Idle: 7, Hurt: 3, Dead: 3, Attack_1: 16 },
    };

    let monsterType: MonsterType;
    
    type MonsterType = keyof typeof framesMap;
    
    if (monsterNumber < 3) {
      // 일반 몬스터 로직
      if (monsterNumber === 0) {
        monsterType = "Skeleton_Archer";
      } else if (monsterNumber === 1) {
        monsterType = "Skeleton_Spearman";
      } else {
        monsterType = "Skeleton_Warrior";
      }
    } else {
      // 보스 몬스터 로직
      monsterType = `Gorgon_${bossIndex}` as MonsterType;
    }

    if (characterAction === "Dead") {
      action = "Idle";
    } else {
      if (monsterAction === "Dead") {
        action = "Dead";
      } else if (monsterAction === "Hurt") {
        action = "Hurt";
      } else if (monsterAction === "Attack") {
        action = "Attack_1";
      } else {
        action = "Idle";
      }
    }

    totalFrames = framesMap[monsterType][action];

    set({
      monsterNumber: monsterNumber,
      monsterImage: `url("/game_images/${monsterNumber < 3 ? "skeleton" : "gorgon"}/${monsterType}/${action}.png")`,
      monsterHP: monsterHP,
      totalFrames,
      frameWidth: 200,
      frameHeight: 200,
      frameDuration: 100,
    });

    // console.log('Updated monster settings:', { typedCharacters, monsterType, action });
  },
  appearMonster: false,
  setAppearMonster: (value) => {
    set({
      appearMonster: value
    })
  },
  monsterReduceHp: (amount) => {
    set((state) => {
      const newHp = Math.max(state.monsterHP - amount, 0);

      return {
        monsterHP: newHp,
      }
    });
  }
})));

// useMonsterStore.subscribe(
//   (state) => state.monsterHP, // monsterHP 상태 변화 감지
//   (monsterHP) => {
//     const monsterNumber = useMonsterStore.getState().monsterNumber;
//     const { setNextStage } = useStageStore.getState(); // 스테이지 전환 함수
//     const currentStage = useStageStore.getState().stage;

//     // 이미 Dead 상태라면 추가 업데이트 방지
//     if (monsterHP <= 0 && monsterNumber === 3) {
//       if (currentStage < 4) {
//         console.log("setNextStage")
//         setNextStage(); // 스테이지 전환
//       }

//       // 몬스터 상태를 Dead로 업데이트 (무한 루프 방지)
//       useMonsterStore.getState().updateMonsterSettings("Dead");
//       return; // 이후 로직 실행 방지
//     }

//     if (monsterHP <= 0) {
//       console.log("몬스터 사망: Dead 상태로 전환됩니다.");
//       useMonsterStore.getState().updateMonsterSettings("Dead");
//     }
//   }
// );