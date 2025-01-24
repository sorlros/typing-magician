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

          // "Dead" 액션에서 마지막 프레임에 도달하면 프레임 고정
          if (action === "Dead" && prevFrame === totalFrames - 1) {
            lastFrameRef.current = true;
            setIsLastFrame(true);
            return prevFrame;
          }

          lastFrameRef.current = false;
          setIsLastFrame(false);
          return nextFrame;
        });

        lastFrameTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalFrames, frameDuration, action]);

  useEffect(() => {
    if (action === "Skill") {
      actionTimeoutRef.current = setTimeout(() => {
        if (onActionComplete) onActionComplete();
      }, frameDuration * totalFrames);
      // console.log("Timeout duration:", frameDuration * totalFrames);
      return () => {
        if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      };
    }
  }, [action, frameDuration, totalFrames, onActionComplete]);

  
  return { frame, isLastFrame };
};
