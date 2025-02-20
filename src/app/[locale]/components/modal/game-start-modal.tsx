import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import localFont from 'next/font/local';
import { useInteractStore } from '@/store/interact-store';
import { cn } from '@/lib/utils'
import { useTypingStore } from '@/store/typing-store';
import useBgm from '@/app/hooks/use-background-music';

const neoDunggeunmo = localFont({
  src: "../../../../../public/fonts/NeoDunggeunmoPro-Regular.woff2",
  weight: "400",
  display: "swap",
});

const GameStartModal = () => {
  const [open, setOpen] = useState<boolean>(true);
  const resetTyping = useTypingStore(state => state.resetTyping);
  const useBackgroundMusic = useBgm();

  useEffect(() => {
    setOpen(true);
  }, [])

  const handleButton = () => {
    resetTyping();

    setTimeout(() => {
      const inputElement = document.querySelector<HTMLInputElement>(
        "#typingInput"
      );
      inputElement?.focus();
    }, 0);

    setTimeout(() => {
      setOpen(false);
      useBackgroundMusic.playBgmSound();
    }, 1000);
  }

  return (
    <div className={`absolute inset-0 z-[9999] transform transition-opacity duration-1000
      ${open ? "opacity-100" : "opacity-0 hidden"}`}>
      <Image
        alt="game-start"
        src="/game_images/modal/simple_natural_landscape_pixel_art_background/orig.png"
        fill
      />
      <div className={cn(`flex justify-center w-full h-full transform ${open ? "items-center" : "items-start"} z-50`, neoDunggeunmo.className)}>
        <div className="flex flex-col space-y-8">
        <div 
          className="text-6xl text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 bg-clip-text"
          style={{
            textShadow: "2px 2px 0 rgba(0, 0, 0, 0.5)", 
          }}
        >
          TYPING MAGICIAN
        </div>
          <div className="flex justify-center">
            <button onClick={() => handleButton()} className="bg-gray-900 text-green-700 text-xl tracking-widest border-2 border-green-700   px-4 py-2 rounded-none hover:text-green-500 hover:border-green-500 hover:bg-gray-800 active:translate-y-2 transition-all duration-200">
              GAME START
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameStartModal;