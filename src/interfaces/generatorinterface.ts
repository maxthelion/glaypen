export default interface GeneratorParamsInterface {
    [key: string]: number | string | number[];
    "tonic": number;
    "scaleIndex": number;
    "stepsInBar": number;
    "stepProbability": number;
    "pitchRange": number;
    "octaveRange": number;
    "octaveProbability": number;
    "color": string;
    "pitchMode": number;
    "stepMode": number;
    // Euclidian steps
    "stepPulseNumber": number;
    "chordIndex": number;
    "chordRoot": number;
    "manualSteps": number[];
}