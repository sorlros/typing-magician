interface TextureData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AtlasData {
  image: string;
  textures: Record<string, TextureData>;
}

interface TextureCache {
  image: HTMLImageElement;
  data: AtlasData;
  loaded: boolean;
}

class TextureLoader {
  private static instance: TextureLoader;
  private cache: Map<string, TextureCache> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  static getInstance(): TextureLoader {
    if (!TextureLoader.instance) {
      TextureLoader.instance = new TextureLoader();
    }
    return TextureLoader.instance;
  }

  async loadAtlas(atlasName: string): Promise<TextureCache> {
    const cacheKey = `atlas_${atlasName}`;
    
    // 이미 로딩 중인 경우 기존 Promise 반환
    if (this.loadingPromises.has(cacheKey)) {
      await this.loadingPromises.get(cacheKey);
      return this.cache.get(cacheKey)!;
    }

    // 캐시에 있는 경우 바로 반환
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const loadingPromise = this._loadAtlas(atlasName);
    this.loadingPromises.set(cacheKey, loadingPromise);
    
    try {
      const result = await loadingPromise;
      this.loadingPromises.delete(cacheKey);
      return result;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  private async _loadAtlas(atlasName: string): Promise<TextureCache> {
    const atlasData = await this.loadJSON(`/atlases/atlas_${atlasName}.json`);
    const atlasImage = await this.loadImage(`/atlases/${atlasData.image}`);

    const cache: TextureCache = {
      image: atlasImage,
      data: atlasData,
      loaded: true
    };

    this.cache.set(`atlas_${atlasName}`, cache);
    return cache;
  }

  getTexture(atlasName: string, textureName: string): TextureData {
    const cache = this.cache.get(`atlas_${atlasName}`);
    if (!cache || !cache.loaded) {
      throw new Error(`Atlas ${atlasName} not loaded`);
    }

    const textureData = cache.data.textures[textureName];
    if (!textureData) {
      throw new Error(`Texture ${textureName} not found in atlas ${atlasName}`);
    }

    return textureData;
  }

  drawTexture(
    ctx: CanvasRenderingContext2D,
    atlasName: string,
    textureName: string,
    x: number,
    y: number,
    width?: number,
    height?: number
  ) {
    const texture = this.getTexture(atlasName, textureName);
    const cache = this.cache.get(`atlas_${atlasName}`)!;

    const drawWidth = width ?? texture.width;
    const drawHeight = height ?? texture.height;

    ctx.drawImage(
      cache.image,
      texture.x, texture.y, texture.width, texture.height,
      x, y, drawWidth, drawHeight
    );
  }

  // 배치 렌더링을 위한 메서드
  batchDrawTextures(
    ctx: CanvasRenderingContext2D,
    draws: Array<{
      atlas: string;
      texture: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
    }>
  ) {
    // 아틀라스별로 그룹화
    const groupedDraws = new Map<string, Array<{
      texture: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
    }>>();

    for (const draw of draws) {
      if (!groupedDraws.has(draw.atlas)) {
        groupedDraws.set(draw.atlas, []);
      }
      groupedDraws.get(draw.atlas)!.push({
        texture: draw.texture,
        x: draw.x,
        y: draw.y,
        width: draw.width,
        height: draw.height
      });
    }

    // 아틀라스별로 배치 렌더링
    groupedDraws.forEach((atlasDraws, atlasName) => {
      const cache = this.cache.get(`atlas_${atlasName}`);
      if (!cache) {
        console.warn(`Atlas ${atlasName} not found in cache during batch draw`);
        return;
      }

      for (const draw of atlasDraws) {
        const texture = this.getTexture(atlasName, draw.texture);
        const width = draw.width ?? texture.width;
        const height = draw.height ?? texture.height;

        ctx.drawImage(
          cache.image,
          texture.x, texture.y, texture.width, texture.height,
          draw.x, draw.y, width, height
        );
      }
    });
  }

  preloadAtlases(atlases: string[]): Promise<void[]> {
    return Promise.all(atlases.map(atlas => 
      this.loadAtlas(atlas).then(() => {})
    ));
  }

  private async loadJSON(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${url}. Check if the file exists in /public/atlases/ and if the server is running.`);
    }
    return response.json();
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Cannot load image on server side'));
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}. Check if the file exists in /public/atlases/`));
      img.src = url;
    });
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getMemoryUsage(): number {
    let totalBytes = 0;
    this.cache.forEach((cache) => {
      if (cache.image) {
        totalBytes += cache.image.width * cache.image.height * 4; // RGBA
      }
    });
    return totalBytes;
  }
}

export const textureLoader = TextureLoader.getInstance();
export type { TextureData, AtlasData };