const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class TextureAtlasGenerator {
  constructor() {
    this.maxAtlasSize = 4096; // 현대적인 WebGL 환경에 적합한 사이즈
    this.padding = 2;
    this.atlases = [];
  }

  async generate() {
    const imageDir = path.join(__dirname, '../public/game_images');
    const files = this.scanImageFiles(imageDir);
    
    // 이미지 그룹화 (배경, UI, 아이템 등)
    const groups = this.groupImages(files);
    
    // 그룹별 아틀라스 생성
    for (const [groupName, groupFiles] of Object.entries(groups)) {
      await this.createAtlas(groupName, groupFiles);
    }
    
    this.generateMetadata();
  }

  scanImageFiles(dir) {
    const files = [];
    
    const scanRecursive = (currentDir) => {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
          scanRecursive(fullPath);
        } else if (this.isImageFile(item.name)) {
          files.push({
            path: fullPath,
            relativePath: path.relative(dir, fullPath),
            name: path.parse(item.name).name
          });
        }
      }
    };
    
    scanRecursive(dir);
    return files;
  }

  isImageFile(filename) {
    return /\.(png|jpg|jpeg|webp)$/i.test(filename);
  }

  groupImages(files) {
    const groups = {
      background: [],
      ui: [],
      item: [],
      effect: []
    };

    files.forEach(file => {
      const dirName = path.dirname(file.relativePath).toLowerCase();
      
      if (dirName.includes('background')) {
        groups.background.push(file);
      } else if (dirName.includes('ui')) {
        groups.ui.push(file);
      } else if (file.name.toLowerCase().includes('item')) {
        groups.item.push(file);
      } else {
        groups.effect.push(file);
      }
    });

    return groups;
  }

  async createAtlas(groupName, files) {
    if (files.length === 0) return;

    const outputDir = path.join(__dirname, '../public/atlases');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 이미지 크기 측정
    const textures = [];
    for (const file of files) {
      const metadata = await sharp(file.path).metadata();
      textures.push({
        ...file,
        width: metadata.width,
        height: metadata.height
      });
    }

    // 패킹 알고리즘 (간단한 shelf 알고리즘)
    const packed = this.packTextures(textures);
    
    // 아틀라스 이미지 생성
    const atlasImage = sharp({
      create: {
        width: packed.width,
        height: packed.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    // WebP는 최대 16383x16383 제한이 있음
    const isTooLargeForWebP = packed.width > 16383 || packed.height > 16383;
    const format = isTooLargeForWebP ? 'png' : 'webp';
    const ext = isTooLargeForWebP ? 'png' : 'webp';

    const composites = [];
    const atlasData = {
      image: `atlas_${groupName}.${ext}`,
      textures: {}
    };

    for (const texture of packed.textures) {
      composites.push({
        input: texture.path,
        left: texture.x,
        top: texture.y
      });

      atlasData.textures[texture.name] = {
        x: texture.x,
        y: texture.y,
        width: texture.width,
        height: texture.height
      };
    }

    const outputPath = path.join(outputDir, `atlas_${groupName}.${ext}`);
    let outputProcessor = atlasImage.composite(composites);
    
    if (ext === 'webp') {
      outputProcessor = outputProcessor.webp({ quality: 80 });
    } else {
      outputProcessor = outputProcessor.png();
    }

    await outputProcessor.toFile(outputPath);
    
    // 메타데이터 저장
    const metaPath = path.join(outputDir, `atlas_${groupName}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(atlasData, null, 2));

    this.atlases.push({
      group: groupName,
      image: `atlas_${groupName}.${ext}`,
      meta: `atlas_${groupName}.json`
    });
  }

  packTextures(textures) {
    // 간단한 shelf 패킹 알고리즘
    textures.sort((a, b) => b.height - a.height); // 높이 기준 정렬
    
    let currentY = 0;
    let currentX = 0;
    let maxRowHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    for (const texture of textures) {
      // 현재 줄에 공간이 부족하면 다음 줄로
      if (currentX + texture.width > this.maxAtlasSize && currentX > 0) {
        currentX = 0;
        currentY += maxRowHeight + this.padding;
        maxRowHeight = 0;
      }

      texture.x = currentX;
      texture.y = currentY;
      
      currentX += texture.width + this.padding;
      maxRowHeight = Math.max(maxRowHeight, texture.height);
      
      maxWidth = Math.max(maxWidth, texture.x + texture.width);
      maxHeight = Math.max(maxHeight, texture.y + texture.height);
    }

    return {
      width: maxWidth,
      height: maxHeight,
      textures
    };
  }

  generateMetadata() {
    const manifest = {
      generatedAt: new Date().toISOString(),
      atlases: this.atlases,
      totalTextures: this.atlases.reduce((sum, atlas) => 
        sum + Object.keys(require(`../public/atlases/${atlas.meta}`).textures).length, 0)
    };

    fs.writeFileSync(
      path.join(__dirname, '../public/atlases/manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
  }
}

// 실행
if (require.main === module) {
  const generator = new TextureAtlasGenerator();
  generator.generate().catch(console.error);
}

module.exports = TextureAtlasGenerator;