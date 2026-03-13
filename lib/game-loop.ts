interface GameLoopOptions {
  maxFPS?: number;
  physicsUpdateRate?: number;
  onUpdate: (deltaTime: number) => void;
  onRender: (interpolation: number) => void;
  onPhysicsUpdate?: (fixedDeltaTime: number) => void;
}

export class GameLoop {
  private running = false;
  private lastTime = 0;
  private accumulator = 0;
  private frameId: number | null = null;

  private readonly maxFPS: number;
  private readonly fixedDeltaTime: number;
  private readonly onUpdate: (deltaTime: number) => void;
  private readonly onRender: (interpolation: number) => void;
  private readonly onPhysicsUpdate?: (fixedDeltaTime: number) => void;

  constructor(options: GameLoopOptions) {
    this.maxFPS = options.maxFPS ?? 60;
    this.fixedDeltaTime = 1000 / (options.physicsUpdateRate ?? 60);
    this.onUpdate = options.onUpdate;
    this.onRender = options.onRender;
    this.onPhysicsUpdate = options.onPhysicsUpdate;

    this.tick = this.tick.bind(this);
  }

  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (!this.running) return;

    this.running = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private tick(currentTime: number): void {
    if (!this.running) return;

    this.frameId = requestAnimationFrame(this.tick);

    // FPS 제한
    const elapsed = currentTime - this.lastTime;
    if (elapsed < 1000 / this.maxFPS) {
      return;
    }

    const deltaTime = Math.min(elapsed, 1000); // 최대 1초로 제한
    this.lastTime = currentTime;

    // 물리 업데이트 누적
    this.accumulator += deltaTime;

    // 고정 시간 간격으로 물리 업데이트
    while (this.accumulator >= this.fixedDeltaTime) {
      this.onPhysicsUpdate?.(this.fixedDeltaTime);
      this.accumulator -= this.fixedDeltaTime;
    }

    // 가변 시간 간격으로 로직 업데이트
    this.onUpdate(deltaTime);

    // 렌더링 보간
    const interpolation = this.accumulator / this.fixedDeltaTime;
    this.onRender(interpolation);
  }

  isRunning(): boolean {
    return this.running;
  }

  getFPS(): number {
    const now = performance.now();
    const elapsed = now - this.lastTime;
    return elapsed > 0 ? 1000 / elapsed : 0;
  }
}

// 객체 풀링 유틸리티
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn?: (obj: T) => void;

  constructor(createFn: () => T, resetFn?: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.expand(initialSize);
  }

  acquire(): T {
    if (this.pool.length === 0) {
      this.expand(Math.max(10, this.pool.length * 2));
    }
    
    const obj = this.pool.pop()!;
    this.resetFn?.(obj);
    return obj;
  }

  release(obj: T): void {
    this.resetFn?.(obj);
    this.pool.push(obj);
  }

  private expand(count: number): void {
    for (let i = 0; i < count; i++) {
      this.pool.push(this.createFn());
    }
  }

  get size(): number {
    return this.pool.length;
  }

  clear(): void {
    this.pool = [];
  }
}

// 성능 모니터링
export class PerformanceMonitor {
  private frames: number[] = [];
  private lastUpdate = 0;
  private frameCount = 0;

  constructor(private sampleSize = 60) {}

  update(): void {
    const now = performance.now();
    
    if (this.lastUpdate === 0) {
      this.lastUpdate = now;
      return;
    }

    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

    this.frames.push(delta);
    this.frameCount++;

    if (this.frames.length > this.sampleSize) {
      this.frames.shift();
    }
  }

  getFPS(): number {
    if (this.frames.length === 0) return 0;
    
    const totalTime = this.frames.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / this.frames.length;
    
    return averageTime > 0 ? 1000 / averageTime : 0;
  }

  getMinFPS(): number {
    if (this.frames.length === 0) return 0;
    
    const maxTime = Math.max(...this.frames);
    return maxTime > 0 ? 1000 / maxTime : 0;
  }

  getMaxFPS(): number {
    if (this.frames.length === 0) return 0;
    
    const minTime = Math.min(...this.frames);
    return minTime > 0 ? 1000 / minTime : 0;
  }

  reset(): void {
    this.frames = [];
    this.lastUpdate = 0;
    this.frameCount = 0;
  }

  get totalFrames(): number {
    return this.frameCount;
  }
}