import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import localFont from 'next/font/local';
import { useInteractStore } from '@/store/interact-store';
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation';

const neoDunggeunmo = localFont({
  src: "../../../../../public/fonts/NeoDunggeunmoPro-Regular.woff2",
  weight: "400",
  display: "swap",
});

const GameEndModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const gameOver = useInteractStore((state => state.gameOver));
  const setGameOver = useInteractStore((state => state.setGameOver));
  const router = useRouter();

  useEffect(() => {
    if (gameOver) {
      setOpen(true);
    }
  }, [gameOver])

  const handleButton = (href: string) => {
    setOpen(false);
    // router.push(`${href}`)
    router.refresh();
  }

  return (
    <div className={`absolute inset-0 z-[9999] transform transition-opacity duration-1000
      ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      <Image
        alt="game-over"
        src="/game_images/modal/moon_and_sea_pixel_art_background/5.png"
        fill
      />
      <div className={cn(`flex justify-center w-full h-full transform ${open ? "items-center" : "items-start"} z-50`, neoDunggeunmo.className)}>
        <div className="flex flex-col space-y-8">
          <div className="text-6xl text-red-500">GAME OVER</div>
          <div className="space-x-4">
            <button onClick={() => handleButton("/")} className="bg-gray-900 text-green-700 text-xl tracking-widest border-2 border-green-700   px-4 py-2 rounded-none hover:text-green-500 hover:border-green-500 hover:bg-gray-800 active:translate-y-2 transition-all duration-200">
              TRY AGAIN
            </button>
            <button onClick={() => handleButton("/contact")} className="bg-gray-900 text-green-700 text-xl tracking-widest border-2 border-green-700   px-4 py-2 rounded-none hover:text-green-500 hover:border-green-500 hover:bg-gray-800 active:translate-y-2 transition-all duration-200">
              CONTACT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameEndModal;