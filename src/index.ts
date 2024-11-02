import { exportImages } from './export';
import { Frame } from './frame';
import { IMidiFile } from 'midi-json-parser-worker';

// interface OutputVideo {
//   frames: Array<Frame>;
//   fps: number;
//   audioSource?: string;
// }

export function midiToVideo(midiFile: IMidiFile, outputDir: string): void {
  const frames: Array<Frame> = [];
  const tracks = midiFile.tracks;
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const channel = track.channel;
    const notes = track.notes;
    for (let j = 0; j < notes.length; j++) {
      const note = notes[j];
      const pitch = note.pitch;
      const velocity = note.velocity;
      const frame = frames[j];
      if (!frame) {
        frames.push(new Frame(128, 128));
      }
      frame.setFromChannel(pitch, channel, velocity);
    }
  }
  exportImages(frames, 25, outputDir);
}
