import { useState, useEffect, useRef } from "react";

interface FrameAnimationProps {
  totalFrames: number;
  frameDuration: number;
  action: string;
  onActionComplete?: () => void;
}

export const useFrameAnimation = ({
  totalFrames,
  frameDuration,
  action,
  onActionComplete,
}: FrameAnimationProps) => {
  const [frame, setFrame] = useState(0);
  const animationRef = useRef<number>();
  const lastUpdate = useRef(performance.now());
  const isSkillAction = useRef(false);

  const updateFrame = (timestamp: number) => {
    const elapsed = timestamp - lastUpdate.current;

    if (elapsed >= frameDuration) {
      setFrame((prev) => {
        let nextFrame = prev + 1;

        // Skill 액션 마지막 프레임 도달 시 완료 처리
        if (isSkillAction.current && nextFrame >= totalFrames - 1) {
          cancelAnimation();
          onActionComplete?.();
          
          return totalFrames - 1;
        }

        // 일반 프레임 순환 (Idle 상태)
        if (action === "Idle") {
          return nextFrame % totalFrames;
        }

        // 다른 액션의 경우 프레임 증가
        return nextFrame;
      });
      lastUpdate.current = timestamp;
    }

    animationRef.current = requestAnimationFrame(updateFrame);
  };

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    isSkillAction.current = action === "Skill";
    lastUpdate.current = performance.now();

    // Skill 상태 초기화
    if (action === "Skill") {
      setFrame(0); // Skill 시작 시 프레임 초기화
    }

    // 애니메이션 시작
    animationRef.current = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimation();
    };
  }, [action, totalFrames, frameDuration]);

  // Skill 액션 타임아웃 백업 (안전 장치)
  useEffect(() => {
    if (action === "Skill") {
      const timeout = setTimeout(() => {
        onActionComplete?.();
      }, totalFrames * frameDuration);

      return () => clearTimeout(timeout);
    }
  }, [action, totalFrames, frameDuration]);

  return { frame };
};