export const decomposeHangul = (char: string) => {
  const baseCode = 0xAC00;
  const choseongCount = 19;
  const jongseongCount = 28;
  const jungseongCount = 21;

  const charCode = char.charCodeAt(0);

  if (charCode < baseCode || charCode > 0xD7A3) {
    return [char]; // Non-Hangul characters are returned as-is
  }

  const index = charCode - baseCode;
  const choseongIndex = Math.floor(index / (jungseongCount * jongseongCount));
  const jungseongIndex = Math.floor((index % (jungseongCount * jongseongCount)) / jongseongCount);
  const jongseongIndex = index % jongseongCount;

  const choseong = String.fromCharCode(0x1100 + choseongIndex);
  const jungseong = String.fromCharCode(0x1161 + jungseongIndex);
  const jongseong = jongseongIndex > 0
    ? String.fromCharCode(0x11A8 + jongseongIndex - 1)
    : '';

  return [choseong, jungseong, jongseong].filter(char => char);
};


