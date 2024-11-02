import chroma from 'chroma-js';
import { Interval, Note, NoteLiteral } from 'tonal';

function freqToColor(frequency: number): string {
  const noteName = Note.fromFreq(frequency);
  let boundaryNotes: Array<NoteLiteral>;
  if (frequency >= Note.freq(noteName)!) {
    boundaryNotes = [
      Note.get(noteName),
      Note.get(Note.transpose(Note.get(noteName), '2m')),
    ];
  } else {
    boundaryNotes = [
      Note.get(Note.transpose(Note.get(noteName), '-2m')),
      Note.get(noteName),
    ];
  }

  const boundaryColors = boundaryNotes.map((note) => {
    const minor3rds = [0, 3, 6, 9]
      .map(Interval.fromSemitones)
      .map(Note.transposeFrom(Note.name(note)))
      .map(Note.pitchClass)
      .map(Note.simplify);
    if (minor3rds.includes('C')) {
      return '#FF0000';
    }
    if (minor3rds.includes('C#') || minor3rds.includes('Db')) {
      return '#00FF00';
    }
    if (minor3rds.includes('D')) {
      return '#0000FF';
    }
    // this should never happen
    throw new Error('Note not found in minor 3rds');
  });

  const boundaryFreqs = boundaryNotes.map(Note.freq);

  const color = chroma
    .scale(boundaryColors)
    .mode('rgb')
    .domain(boundaryFreqs)(frequency)
    .hex();

  return color;
}

console.log(
  [
    440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840, 880, 920, 960, 1000,
  ].map(freqToColor)
);
