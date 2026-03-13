# Typing Magician (타이핑 매지션) 🧙‍♂️⌨️

타이핑 매지션은 흥미진진한 RPG 요소를 결합한 웹 기반 타이핑 연습 게임입니다. 마법사가 되어 몰려오는 몬스터들을 정확하고 빠르게 타이핑하여 물리치세요!

## 🌟 주요 특징

-   **RPG 스타일 게임플레이**: 캐릭터 성장과 다양한 몬스터 패턴을 즐길 수 있습니다.
-   **고성능 텍스트 렌더링**: WebGL 기반의 텍스트 로더를 통해 부드러운 애니메이션과 효과를 제공합니다.
-   **다국어 지원 (i18n)**: 한국어를 포함한 다양한 언어 설정을 지원합니다.
-   **최적화된 에셋 관리**: 이미지 아틀라스 제네레이터를 통해 많은 양의 게임 에셋을 효율적으로 로드하고 관리합니다.
-   **몰입감 넘치는 사운드**: 배경 음악(BGM)과 효과음을 통해 게임의 몰입도를 높였습니다.

## 🛠 기술 스택

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Animation**: [Anime.js](https://animejs.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Asset Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Texture Atlas Generation)

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 텍스처 아틀라스 생성
게임 내 이미지를 최적화된 아틀라스 형태로 변환해야 합니다. (`sharp` 모듈이 필요합니다)
```bash
npm run generate:atlas
```

### 3. 개발 서버 실행
```bash
npm run dev
```
이제 [http://localhost:3000](http://localhost:3000)에서 게임을 즐길 수 있습니다!

## 📁 주요 디렉토리 구조

-   `/src/app`: Next.js 페이지 및 주요 컴포넌트
-   `/lib`: 게임 렌더링 루프 및 텍스처 로더 등 코어 로직
-   `/scripts`: 이미지 아틀라스 생성 스크립트
-   `/public`: 게임 에셋 (이미지, 사운드, 폰트)
-   `/store`: Zustand 상태 정의

## 📝 라이선스
이 프로젝트의 저작권은 소유자에게 있습니다.
