const decomposeKorean = (char: string) => {
  const HANGUL_OFFSET = 0xac00;
  const CHO_BASE = 588;
  const JUNG_BASE = 28;

  const CHO = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  ];
  const JUNG = [
    "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
  ];
  const JONG = [
    "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  ];

  const code = char.charCodeAt(0) - HANGUL_OFFSET;

  if (code < 0 || code > 11171) return [char]; // 한글이 아니면 그대로 반환

  const cho = CHO[Math.floor(code / CHO_BASE)];
  const jung = JUNG[Math.floor((code % CHO_BASE) / JUNG_BASE)];
  const jong = JONG[code % JUNG_BASE];

  return [cho, jung, jong].filter(Boolean); // 종성 없을 경우 제거
};

export default decomposeKorean