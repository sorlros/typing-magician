import { PerformanceMonitor } from './game-loop';

export class DebugStats {
  private static instance: DebugStats;
  private performanceMonitor: PerformanceMonitor;
  private memoryUsage: number = 0;
  private renderCalls: number = 0;
  private updateTime: number = 0;
  private renderTime: number = 0;
  private gameObjects: number = 0;
  private activeParticles: number = 0;

  private constructor() {
    this.performanceMonitor = new PerformanceMonitor();
  }

  static getInstance(): DebugStats {
    if (!DebugStats.instance) {
      DebugStats.instance = new DebugStats();
    }
    return DebugStats.instance;
  }

  // 프레임 통계 업데이트
  beginFrame(): void {
    this.renderCalls = 0;
    this.updateTime = 0;
    this.renderTime = 0;
  }

  endFrame(): void {
    this.performanceMonitor.update();
  }

  // 측정 메서드들
  addRenderCall(): void {
    this.renderCalls++;
  }

  addUpdateTime(time: number): void {
    this.updateTime += time;
  }

  addRenderTime(time: number): void {
    this.renderTime += time;
  }

  setGameObjects(count: number): void {
    this.gameObjects = count;
  }

  setActiveParticles(count: number): void {
    this.activeParticles = count;
  }

  setMemoryUsage(usage: number): void {
    this.memoryUsage = usage;
  }

  // 통계 가져오기
  getStats(): DebugStatsData {
    return {
      fps: Math.round(this.performanceMonitor.getFPS()),
      minFps: Math.round(this.performanceMonitor.getMinFPS()),
      maxFps: Math.round(this.performanceMonitor.getMaxFPS()),
      renderCalls: this.renderCalls,
      updateTime: this.updateTime,
      renderTime: this.renderTime,
      gameObjects: this.gameObjects,
      activeParticles: this.activeParticles,
      memoryUsage: this.memoryUsage,
      totalFrames: this.performanceMonitor.totalFrames
    };
  }

  reset(): void {
    this.performanceMonitor.reset();
    this.memoryUsage = 0;
    this.renderCalls = 0;
    this.updateTime = 0;
    this.renderTime = 0;
    this.gameObjects = 0;
    this.activeParticles = 0;
  }

  // 콘솔 출력
  logStats(): void {
    const stats = this.getStats();
    console.log(`
🎮 Game Performance Stats:
├── FPS: ${stats.fps} (Min: ${stats.minFps}, Max: ${stats.maxFps})
├── Render Calls: ${stats.renderCalls}
├── Update Time: ${stats.updateTime.toFixed(2)}ms
├── Render Time: ${stats.renderTime.toFixed(2)}ms
├── Game Objects: ${stats.gameObjects}
├── Particles: ${stats.activeParticles}
└── Memory: ${(stats.memoryUsage / 1024 / 1024).toFixed(2)}MB
    `);
  }

  // 성능 경고 체크
  checkPerformanceWarnings(): PerformanceWarning[] {
    const stats = this.getStats();
    const warnings: PerformanceWarning[] = [];

    if (stats.fps < 30) {
      warnings.push({
        level: 'critical',
        message: `FPS가 매우 낮습니다: ${stats.fps}FPS`,
        suggestion: '렌더링 호출 수 줄이기 또는 객체 수 감소'
      });
    } else if (stats.fps < 50) {
      warnings.push({
        level: 'warning',
        message: `FPS가 낮습니다: ${stats.fps}FPS`,
        suggestion: '배치 렌더링 최적화 필요'
      });
    }

    if (stats.renderCalls > 1000) {
      warnings.push({
        level: 'warning',
        message: `렌더링 호출 수가 많음: ${stats.renderCalls}회`,
        suggestion: '배치 렌더링 구현 필요'
      });
    }

    if (stats.updateTime > 16) { // 60FPS 기준 한 프레임 시간
      warnings.push({
        level: 'warning',
        message: `업데이트 시간이 길음: ${stats.updateTime.toFixed(2)}ms`,
        suggestion: '로직 최적화 또는 Web Worker 사용'
      });
    }

    if (stats.memoryUsage > 100 * 1024 * 1024) { // 100MB
      warnings.push({
        level: 'warning',
        message: `메모리 사용량이 높음: ${(stats.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        suggestion: '객체 풀링 또는 메모리 해제 구현'
      });
    }

    return warnings;
  }
}

interface DebugStatsData {
  fps: number;
  minFps: number;
  maxFps: number;
  renderCalls: number;
  updateTime: number;
  renderTime: number;
  gameObjects: number;
  activeParticles: number;
  memoryUsage: number;
  totalFrames: number;
}

interface PerformanceWarning {
  level: 'info' | 'warning' | 'critical';
  message: string;
  suggestion: string;
}

// React 컴포넌트용 훅 (선택적)
export const useDebugStats = () => {
  const debugStats = DebugStats.getInstance();
  
  return {
    getStats: () => debugStats.getStats(),
    logStats: () => debugStats.logStats(),
    checkWarnings: () => debugStats.checkPerformanceWarnings()
  };
};

// 글로벌 접근을 위한 단축키
declare global {
  interface Window {
    debugStats: DebugStats;
  }
}

// 개발 모드에서만 글로벌 등록
if (process.env.NODE_ENV === 'development') {
  window.debugStats = DebugStats.getInstance();
}