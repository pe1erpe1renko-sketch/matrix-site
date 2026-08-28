import { arcanaImage } from './contentPositions.js';
import { arcanaName } from './images.js';
import { urlDateToHuman } from './urlDate.js';

/**
 * СБОРКА ФАЙЛА ОБРАЗА
 * ===================
 * То же, что рисует ObrazCard, но на canvas и в размере под заставку
 * телефона: 900×1200. Экранная карточка — это предпросмотр, а сохраняют
 * люди файл, и он должен быть достаточно крупным, чтобы не мылить.
 *
 * Иллюстрации лежат на нашем же домене, поэтому canvas не «пачкается»
 * и toBlob работает. Если файла нет — рисуем градиент и номер аркана,
 * как и на экране: раздел обязан работать без иллюстраций.
 */

const W = 900;
const H = 1200;

export async function buildImageFile({ arcana, accent, theme, who, date }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  /* 1. подложка и иллюстрация */
  ctx.fillStyle = '#0A0817';
  ctx.fillRect(0, 0, W, H);

  const picture = await loadImage(arcanaImage(arcana));
  if (picture) {
    drawCover(ctx, picture);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, hexAlpha(accent, 0.5));
    grad.addColorStop(1, '#0A0817');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = accent;
    ctx.font = `600 ${W * 0.32}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(arcana), W / 2, H / 2);
  }

  /* 2. затемнение сверху и снизу — под подписи */
  const shade = ctx.createLinearGradient(0, 0, 0, H);
  shade.addColorStop(0, 'rgba(6,4,14,0.78)');
  shade.addColorStop(0.32, 'rgba(6,4,14,0)');
  shade.addColorStop(0.52, 'rgba(6,4,14,0)');
  shade.addColorStop(1, 'rgba(6,4,14,0.88)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, H);

  /* 3. рамка в цвете темы */
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  roundRect(ctx, 4, 4, W - 8, H - 8, 56);
  ctx.stroke();

  /* 4–6. подписи */
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  if (theme) {
    ctx.fillStyle = accent;
    ctx.font = '600 30px Inter, Arial, sans-serif';
    ctx.fillText(spaced(theme.toUpperCase(), 4), W / 2, 84);
  }

  ctx.fillStyle = 'rgba(245,242,252,0.65)';
  ctx.font = '500 27px Inter, Arial, sans-serif';
  ctx.fillText(`АРКАН ${arcana} · ${arcanaName(arcana).toUpperCase()}`, W / 2, H - 214);

  if (who) {
    ctx.fillStyle = '#F5F2FC';
    ctx.font = '600 66px Georgia, serif';
    ctx.fillText(who, W / 2, H - 148);
  }

  if (date) {
    ctx.fillStyle = 'rgba(245,242,252,0.72)';
    ctx.font = '400 32px Inter, Arial, sans-serif';
    ctx.fillText(urlDateToHuman(date), W / 2, H - 106);
  }

  ctx.fillStyle = 'rgba(228,190,114,0.6)';
  ctx.font = '500 22px Inter, Arial, sans-serif';
  ctx.fillText(spaced('MATRIKA', 9), W / 2, H - 46);

  return canvas;
}

/** Собрать и отдать браузеру на скачивание. */
export async function downloadImage(image, themeId) {
  const canvas = await buildImageFile(image);
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = `matrika-obraz-${themeId}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* ---------- мелочи рисования ---------- */

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Вписать картинку по короткой стороне, лишнее обрезать. */
function drawCover(ctx, img) {
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight) * 1.02;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Разрядка: у canvas нет letter-spacing до недавнего времени. */
const spaced = (text, px) => String(text).split('').join(String.fromCharCode(8202).repeat(Math.round(px / 2)));

const hexAlpha = (hex, alpha) => {
  const n = parseInt(String(hex).slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
