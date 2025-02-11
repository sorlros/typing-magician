import { InteractEffect } from "@/store/interact-store";
import Background from "./game-area/background";
import Character from "./game-area/character";
import Monster from "./game-area/monster";
import React from "react";
import useGameLoop from '@/app/hooks/use-loop';
import usePreloadImages from "@/app/hooks/use-preload";

const GameComponent = () => {
  useGameLoop();

  // 이미지들을 preloading & caching
  const characterJobs = ["Fire vizard", "Wanderer Magican", "Lightning Mage"]
  const skeletonTypes = ["Skeleton_Archer", "Skeleton_Spearman", "Skeleton_Warrior"];
  const gorgonTypes = ["Gorgon_1", "Gorgon_2", "Gorgon_3"];
  const monsterActions = ["Idle", "Attack_1", "Hurt", "Dead"];
  const characterActions = ["Idle", "Walk", "Run", "Skill", "Attack", "Hurt", "Dead"];

  const chacracterUrls = characterJobs.flatMap(characterJobs => 
    characterActions.map(action => `/game_images/character-wizard/${characterJobs}/${action}.png`)
  );
  const skeletonUrls = skeletonTypes.flatMap(skeletonTypes =>
    monsterActions.map(action => `/game_images/skeleton/${skeletonTypes}/${action}.png`)
  );
  const gorgonUrls = gorgonTypes.flatMap(gorgonTypes =>
    monsterActions.map(action => `/game_images/gorgon/${gorgonTypes}/${action}.png`)
  );
  const preloadUrls = [...skeletonUrls, ...gorgonUrls, ...chacracterUrls];
  // console.log("preloadUrls", preloadUrls);

  usePreloadImages(preloadUrls);
  // const MemoizedInteractEffect = React.memo(InteractEffect);
  return (
    <div className="flex w-full h-[200px] relative overflow-hidden">
      <InteractEffect />
      <div className="w-full h-full z-10">
        <Background />
      </div>
      
      <div className="w-full h-[200px] absolute left-[20%] top-0 z-50">
        <Character />
      </div>

      <div className="w-full h-full absolute inset-0 z-50">
        <Monster />
      </div>
    </div>
  )
}

export default GameComponent;