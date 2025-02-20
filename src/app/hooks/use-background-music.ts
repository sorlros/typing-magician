"use client";

const useBgm = () => {
  const bgmSounds = [
    "/sounds/background/Dune dancer-Patrick Patrikios.mp3",
    "/sounds/background/Mirage melody-Patrick Patrikios.mp3",
    "/sounds/background/Sunlit Souk-Patrick Patrikios.mp3",
    "/sounds/background/Veil of mysteries-Patrick Patrikios.mp3",
  ];

  let playedSounds: string[] = [];
  let currentAudio: HTMLAudioElement | null = null;

  const playBgmSound = () => {
    // 재생 가능한 음악 목록 생성 (이미 재생한 음악 제외)
    const availableSounds = bgmSounds.filter((sound) => !playedSounds.includes(sound));

    // 모든 음악을 재생했을 경우 리스트 초기화
    if (availableSounds.length === 0) {
      playedSounds = [];
      availableSounds.push(...bgmSounds);
    }

    // 랜덤 음악 선택
    const randomIndex = Math.floor(Math.random() * availableSounds.length);
    const soundFile = availableSounds[randomIndex];

    // 현재 재생 중인 음악이 있으면 멈추고 해제
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.remove();
    }

    // 새로운 오디오 생성 및 재생
    const audio = new Audio(soundFile);
    audio.volume = 0.4;
    currentAudio = audio;
    playedSounds.push(soundFile); // 현재 재생한 음악 기록

    // 음악이 끝난 후 다른 음악 재생
    audio.addEventListener("bgm ended", playBgmSound);

    audio.addEventListener("error", () => {
      console.error(`해당 bgm 사운드파일 재생 오류: ${soundFile}`);
    });

    audio.play().catch((error) => {
      console.error("bgm 오디오 재생 오류", error);
    });
  };

  return { playBgmSound };
};

export default useBgm;
