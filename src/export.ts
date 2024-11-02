import { createWriteStream, writeFileSync } from 'fs';
import { Frame } from './frame';
import { createCanvas, CanvasRenderingContext2D, Canvas } from 'canvas';
// pnpm issue: https://github.com/Automattic/node-canvas/issues/2431
import ffmpeg from 'fluent-ffmpeg';

export function exportImages(
  frames: Array<Frame>,
  fps: number,
  outputDir = '.temp'
) {
  const canvas = createCanvas(frames[0].width, frames[0].height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < frames.length; i++) {
    ctx.putImageData(
      new ImageData(frames[i].toFlat(), frames[i].width, frames[i].height),
      0,
      0
    );
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (i % fps === 0) {
      const buffer = canvas.toBuffer('image/png');
      writeFileSync(
        `${outputDir}/frame_${String(i).padStart(3, '0')}.png`,
        buffer
      );
    }
  }
}

export function createVideo(
  outputDir: string,
  fps: number,
  audioFile?: string
): void {
  const runner = ffmpeg()
    .input(`${outputDir}/frame_%03d.png`) // Assumes frames are saved as frame_000.png, frame_001.png, etc.
    .outputFormat('mp4')
    .inputFPS(fps) // Set the frames per second
    .output(`${outputDir}/output.mp4`)
    .on('end', () => {
      console.log('Video created successfully!');
    })
    .on('error', (err: Error) => {
      console.error('Error creating video:', err);
    });

  if (audioFile) {
    runner.input(audioFile);
  }

  runner.run();
}
