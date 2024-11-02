export interface AdsrEnvelope {
  attack: number; // ms
  decay: number; // ms
  sustain: number; // 0-1
  release: number; // ms
}

export type Envelope = AdsrEnvelope;

export class Note {
  public currentVolume: number;

  constructor(env: Envelope) {}
}
