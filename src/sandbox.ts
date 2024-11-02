import { TMidiEvent } from 'midi-json-parser-worker';
import { createCanvas, CanvasRenderingContext2D, Canvas } from 'canvas';

function dim(imageData: ImageData, amount: number): void {
  for (let i = 0; i < imageData.data.length) {
    imageData[i] = imageData[i] - amount;
  }
}

const MIDI_NOTES = 119; // https://en.wikipedia.org/wiki/Piano_key_frequencies
const tracks = 2;
const totalFramesAmount = 120; // 2 seconds
const frames: Array<ImageData> = [];
const canvas = createCanvas(MIDI_NOTES, tracks);
const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);
const imageData = context.getImageData();
let currentTime = 0;
const track: Array<TMidiEvent> = [];

for (let i)