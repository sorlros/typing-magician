// export function splitText(content: string): {
//   visibleText: string; specialCharacters: string[] 
// } {
//   const specialCharPattern = /[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g; 
//   // /[^a-zA-Z0-9\s]/g;
//   const specialCharacters = content.match(specialCharPattern) || [];
//   const visibleText = content.replace(specialCharPattern, ''); // 특수문자를 공백으로 대체
  
//   return {
//     visibleText,
//     specialCharacters
//   };
// }

export function splitText(content: string): {
  visibleText: string; specialCharacters: string[] 
} {
  const specialCharPattern = /[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g;
    const specialCharacters = Array.from(content.matchAll(specialCharPattern)).map(match => match[0]);
    const visibleText = content.replace(specialCharPattern, "");
    return { visibleText, specialCharacters };
}