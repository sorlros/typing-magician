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
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number>(); // 추가: 애니메이션 프레임 ID 추적용

  useEffect(() => {
    let lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= frameDuration && action !== "Idle") {
        setFrame((prevFrame) => {
          // "Skill" 액션 마지막 프레임 고정
          if (action === "Skill" && prevFrame >= totalFrames - 1) {
            lastFrameRef.current = true;
            setIsLastFrame(true);
            return prevFrame;
          }

          // 일반 프레임 업데이트
          const nextFrame = (prevFrame + 1) % totalFrames;
          lastFrameRef.current = false;
          setIsLastFrame(false);
          return nextFrame;
        });
        lastFrameTime = currentTime;
      }

      // 애니메이션 ID 저장
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 애니메이션 시작
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      // 클린업 시 애니메이션 정지
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [totalFrames, frameDuration, action]);

  useEffect(() => {
    if (action === "Skill") {
      const timeoutDuration = frameDuration * totalFrames;
      
      // 타임아웃 설정
      actionTimeoutRef.current = setTimeout(() => {
        if (onActionComplete) onActionComplete();
      }, timeoutDuration);

      return () => {
        // 타임아웃 클린업
        if (actionTimeoutRef.current) {
          clearTimeout(actionTimeoutRef.current);
        }
      };
    }
  }, [action, frameDuration, totalFrames, onActionComplete]);

  // 추가: 프레임 체크용 효과
  useEffect(() => {
    if (action === "Skill" && frame === totalFrames - 1) {
      // 마지막 프레임 도달 시 강제 종료
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // 즉시 액션 완료 처리
      if (onActionComplete) onActionComplete();
    }
  }, [frame, action, totalFrames, onActionComplete]);

  return { frame, isLastFrame };
};