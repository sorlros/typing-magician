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
  const [isLastFrame, setIsLastFrame] = useState(false);
  const animationRunning = useRef(false);
  const lastFrameRef = useRef(false);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= frameDuration && action !== "Idle") {
        setFrame((prevFrame) => {
          const nextFrame = (prevFrame + 1) % totalFrames;

          // 마지막 프레임에서 애니메이션 중지 및 onActionComplete 호출
          if (action === "Skill" && prevFrame === totalFrames - 1) {
            lastFrameRef.current = true;
            if (onActionComplete && !animationRunning.current) {
              animationRunning.current = true;
              onActionComplete(); // 단 한 번만 실행
            }
            return prevFrame; // 마지막 프레임 고정
          }

          lastFrameRef.current = false;
          return nextFrame;
        });

        lastFrameTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      animationRunning.current = false; // 애니메이션 종료 시 초기화
    };
  }, [totalFrames, frameDuration, action, onActionComplete]);

  return { frame, isLastFrame: lastFrameRef.current };
};