import fs from 'node:fs/promises';
import path from 'node:path';
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';

const WIDTH = 1200;
const HEIGHT = 630;
const projectRoot = process.cwd();
const indexPath = path.join(projectRoot, 'index.json');
const outputRoot = path.join(projectRoot, 'public', 'og');
const outputSkills = path.join(outputRoot, 'skills');
const tablerIconsPath = path.join(projectRoot, 'node_modules', '@tabler', 'icons', 'icons', 'outline');
const bgColor = '#1E2A45';
const titleColor = '#FFFFFF';
const subtitleColor = '#94a3b8';
const accentColor = '#00FFDC';
const subtitleText = 'André Lademann Skill';
const iconColor = '#00FFDC';
const iconSize = 92;
const iconRasterSize = 512;
const iconCache = new Map();

function configureCanvasQuality(ctx) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Extra quality hints supported by cairo-backed canvas contexts.
  if ('antialias' in ctx) ctx.antialias = 'subpixel';
  if ('quality' in ctx) ctx.quality = 'best';
  if ('patternQuality' in ctx) ctx.patternQuality = 'best';
  if ('textDrawingMode' in ctx) ctx.textDrawingMode = 'path';
}

GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 'Arial');
GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Arial.ttf', 'Arial Regular');

function formatSkillLabel(skillName) {
  return skillName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const next = currentLine ? `${currentLine} ${word}` : word;
    const width = ctx.measureText(next).width;

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = next;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function getIconName(skillName) {
  const iconMap = {
    default: 'sparkles',
    'iac-infrastructure-as-code': 'settings-cog',
    'terraform-style-guide': 'file-code',
    'skill-prompt-security-audit': 'shield-search'
  };

  return iconMap[skillName] ?? 'sparkles';
}

async function loadTablerIcon(iconName) {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  const iconFilePath = path.join(tablerIconsPath, `${iconName}.svg`);
  const rawSvg = await fs.readFile(iconFilePath, 'utf8');
  const colorizedSvg = rawSvg
    .replace(/width="[^"]*"/, `width="${iconRasterSize}"`)
    .replace(/height="[^"]*"/, `height="${iconRasterSize}"`)
    .replaceAll('currentColor', iconColor);
  const iconImage = await loadImage(Buffer.from(colorizedSvg));
  iconCache.set(iconName, iconImage);
  return iconImage;
}

async function renderOgImage(targetPath, title, iconName) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  configureCanvasQuality(ctx);

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = accentColor;
  ctx.fillRect(80, 88, 240, 8);

  const icon = await loadTablerIcon(iconName);
  const iconX = WIDTH / 2 - iconSize / 2;
  const iconY = 120;
  ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxTextWidth = WIDTH - 200;
  ctx.font = '700 76px Arial';
  const lines = wrapText(ctx, title, maxTextWidth);
  const lineHeight = 92;
  const textBlockHeight = lines.length * lineHeight;
  const startY = HEIGHT / 2 - textBlockHeight / 2 + lineHeight / 2 + 60;

  ctx.fillStyle = titleColor;
  for (const [index, line] of lines.entries()) {
    ctx.fillText(line, WIDTH / 2, startY + index * lineHeight);
  }

  ctx.font = '500 34px Arial Regular';
  ctx.fillStyle = subtitleColor;
  ctx.fillText(subtitleText, WIDTH / 2, HEIGHT - 82);

  const pngBuffer = await canvas.encode('png');
  await fs.writeFile(targetPath, pngBuffer);
}

async function main() {
  const indexContent = await fs.readFile(indexPath, 'utf8');
  const { skills } = JSON.parse(indexContent);

  await fs.mkdir(outputSkills, { recursive: true });

  await renderOgImage(path.join(outputRoot, 'default.png'), 'André Lademann Skills', getIconName('default'));

  for (const skill of skills) {
    const title = formatSkillLabel(skill.name);
    const outputPath = path.join(outputSkills, `${skill.name}.png`);
    await renderOgImage(outputPath, title, getIconName(skill.name));
  }

  console.log(`Generated Open Graph images for ${skills.length} skills.`);
}

await main();
