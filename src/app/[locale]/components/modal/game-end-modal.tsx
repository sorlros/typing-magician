import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import localFont from 'next/font/local';
import { useInteractStore } from '@/store/interact-store';

const neoDunggeunmo = localFont({
  src: "../../../../../public/fonts/NeoDunggeunmoPro-Regular.woff2",
  weight: "400",
  display: "swap",
});

const GameEndModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const gameOver = useInteractStore((state => state.gameOver));

  useEffect(() => {
    if (gameOver) {
      setOpen(true);
    }
  }, [gameOver])

  return (
    <div className={`absolute inset-0 z-[9999] transform transition-opacity duration-1000
      ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      <Image
        alt="game-over"
        src="/game_images/modal/moon_and_sea_pixel_art_background/5.png"
        fill
      />
    </div>
  )
}

export default GameEndModal