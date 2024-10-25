export function splitText(content: string): {
  visibleText: string; specialCharacters: string[] 
} {
  const specialCharPattern = /[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g;
    const specialCharacters = Array.from(content.matchAll(specialCharPattern)).map(match => match[0]);
    const visibleText = content.replace(specialCharPattern, "");
    return { visibleText, specialCharacters };
}