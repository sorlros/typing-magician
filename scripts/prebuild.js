const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PrebuildScript {
  constructor() {
    this.scriptsDir = path.join(__dirname, '.');
    this.publicDir = path.join(__dirname, '../public');
    this.atlasesDir = path.join(this.publicDir, 'atlases');
  }

  run() {
    console.log('🚀 Running prebuild optimization scripts...\n');

    try {
      this.ensureDirectories();
      this.runTextureAtlasGeneration();
      this.cleanOldBuildFiles();
      this.generateBuildInfo();

      console.log('✅ Prebuild optimization completed successfully!');
    } catch (error) {
      console.error('❌ Prebuild optimization failed:', error.message);
      process.exit(1);
    }
  }

  ensureDirectories() {
    const requiredDirs = [
      this.atlasesDir,
      path.join(this.publicDir, 'optimized'),
      path.join(__dirname, '../dist')
    ];

    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${path.relative(process.cwd(), dir)}`);
      }
    });
  }

  runTextureAtlasGeneration() {
    console.log('\n🎨 Generating texture atlases...');
    
    try {
      execSync('node scripts/generate-texture-atlas.js', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Texture atlases generated successfully');
    } catch (error) {
      console.warn('⚠️ Texture atlas generation failed, continuing build...');
    }
  }

  cleanOldBuildFiles() {
    console.log('\n🧹 Cleaning old build files...');
    
    const filesToClean = [
      path.join(__dirname, '../.next'),
      path.join(__dirname, '../out'),
      path.join(__dirname, '../dist')
    ];

    filesToClean.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️  Cleaned: ${path.relative(process.cwd(), dir)}`);
      }
    });
  }

  generateBuildInfo() {
    console.log('\n📋 Generating build information...');
    
    const buildInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      optimization: {
        textureAtlases: true,
        bundleAnalysis: true,
        codeSplitting: true
      }
    };

    const buildInfoPath = path.join(__dirname, '../build-info.json');
    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
    console.log(`📄 Build info saved to: ${path.relative(process.cwd(), buildInfoPath)}`);
  }
}

// 실행
if (require.main === module) {
  const prebuild = new PrebuildScript();
  prebuild.run();
}

module.exports = PrebuildScript;