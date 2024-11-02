export const msToFrames = (ms: number, fps: number) => {
  const msPerFrame = 1000 / fps;
  return Math.floor(ms / msPerFrame);
};
