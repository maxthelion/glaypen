import Transport from "./transport.js";
import UI from "./ui.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";
import StorageBox from "./storagebox.js";
import MidiInputHandler from "./midiinputhandler.js";
import Step from "./step.js";

export interface GeneratorParams {
    [key: string]: number;
    "tonic": number;
    "scaleIndex": number;
    "stepsInBar": number;
    "stepProbability": number;
    "pitchRange": number;
    "octaveRange": number;
    "octaveProbability": number;
}
type ScalePair = [string, number[]];

export default class GrooveBox {
    pitchHistory: PitchHistory;
    transport: Transport;
    maxClips: number = 16;
    ui: UI;
    selectedOutput: MIDIOutput;
    sequencer: Sequencer;
    clipSaver: ClipSaver;
    generatorParams: GeneratorParams;
    manualPitchOptions: number[] = [];
    lastPitchReadAt?: number;
    clipIndex?: number;
    scales: ScalePair[] = [
        ["Major", [0, 2, 4, 5, 7, 9, 11]],
        ["Harmonic Minor", [0, 2, 3, 5, 7, 8, 11]],
        ["Melodic Minor", [0, 2, 3, 5, 7, 9, 11]],
        ["Major Pentatonic", [0, 2, 4, 7, 9]],
        ["Minor Pentatonic", [0, 3, 5, 7, 10]],
        ["Blues", [0, 3, 5, 6, 7, 10]],
        ["Akebono", [0, 2, 3, 7, 8]],
        ["Japanese Mode", [0, 1, 5, 7, 8]],
        ["Hirajoshi", [0, 2, 3, 7, 8]],
    
    ]
    modeIndex: number = 0;
    storageBox: StorageBox = new StorageBox();
    midiAccess: MIDIAccess;
    generativeSequencer?: Sequencer;
    clockInput: MIDIInput;
    midiInputHandler: MidiInputHandler;

    constructor(midiAccess: MIDIAccess) {
        this.clipSaver = new ClipSaver(this);
        this.generatorParams = this.storageBox.getGeneratorParams();
        this.ui = new UI(this);
        this.midiAccess = midiAccess;
        this.selectedOutput = this.getMidiOutput();
        this.clockInput = this.getMidiInput();
        this.midiInputHandler = new MidiInputHandler(this, this.clockInput);
        this.sequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();

        this.setMode(0);
        // draw loop
        setInterval(() => {
            this.ui.update();
        }, 50);
    }

    moveWindow(direction: number) {
        this.pitchHistory.moveWindow(direction)
        let clipRawData = this.pitchHistory.stepsForCurrentWindow();
        clipRawData.color = this.randomColor(this.pitchHistory.windowStart!);
        let clip = new Clip(this, clipRawData);
        this.sequencer = new ClipSequencer(this, clip);
        this.setMode(1);
    }
    
    playPitch(pitch: number, velocity: number = 127) {
        // console.log("playPitch", pitch, velocity);
        let velocityInHex = velocity.toString(16);
        var noteOnMessage = [0x90, pitch, Number('0x' + velocityInHex)];    // Note on, middle C, full velocity
        this.selectedOutput.send(noteOnMessage);  // Send note on message to first MIDI output device
        var noteOffMessage = [0x80, pitch, 0x40];   // Note off, middle C,
        this.selectedOutput.send(noteOffMessage, window.performance.now() + 1000.0); // In one second
    }

    playStep(step: Step) {
        step.pitches.forEach((pitch) => {
            this.playPitch(pitch, step.velocity);
        })
    }

    setMode(modeIndex: number) {
        this.modeIndex = modeIndex;
        if (modeIndex == 0) {
            if (this.generativeSequencer != undefined) {
                this.sequencer = this.generativeSequencer
            } else {
                this.generativeSequencer = undefined;
                this.sequencer = new Sequencer(this);
            }
            this.clipIndex = undefined;
        }
        if (modeIndex == 1) {
            this.clipIndex = undefined;
            this.generativeSequencer = this.sequencer
        }
        if (modeIndex == 2) {
            this.generativeSequencer = this.sequencer
        }
        this.ui.setMode(modeIndex);
    }

    saveClipToIndex(index: number) {
        let clip = this.sequencer.clip;
        if (clip != undefined){
            this.clipSaver.saveClipToIndex(clip, index);
        }
    }

    saveOrLoadClipAtIndex(index: number) {
        this.setMode(2);
        let clip = this.clipSaver.savedClips[index];
        this.clipIndex = index;
        console.log("clip", index);
        if (clip != undefined){            
            this.sequencer = new ClipSequencer(this, clip);
        } else {
            this.saveClipToIndex(index);
        }
    }

    clearAllClips() {
        for (let i = 0; i < this.maxClips; i++) {
            this.clipSaver.clearClipAtIndex(i);
        }
    }

    showPrefsModal() {
        this.ui.showPrefsModal();
    }
    closePrefsModal() {
        this.ui.closePrefsModal();
    }

    getMidiOutput(): MIDIOutput {
        let outputId = this.storageBox.getOutputId();
        return this.midiAccess.outputs.get(outputId)
    }

    getMidiOutputs(): MIDIOutput[] {
        var outputs = Array.from(this.midiAccess.outputs.values());
        return outputs;
    }

    setMidiOutput(outputId: string) {
        var groooveBox = this;
        navigator.requestMIDIAccess().then(function(midiAccess) {
            var selectedOutput = midiAccess.outputs.get(outputId);
            if (selectedOutput) {
                groooveBox.storageBox.setOutputId(outputId);
                groooveBox.selectedOutput = selectedOutput;
            }
        });
    }

    setGeneratorParam(paramName: string, value: number) {
        this.generatorParams[paramName] = value;
        this.storageBox.setGeneratorParams(this.generatorParams);
    }

    setClipParam(paramName: string, value: number) {
        console.log("setClipParams", paramName, value);
    }

    clipStartLeft() {
        this.sequencer.clip!.shiftLeft();
    }

    clipStartRight() {
        this.sequencer.clip!.shiftRight();
    }

    shuffleClipPitches() {
        if (this.currentClip() != undefined){
            this.currentClip()!.shufflePitches();
        }
    }

    shuffleClipSteps() {
        if (this.currentClip() != undefined){
            this.currentClip()!.shuffleSteps();
        }
    }

    currentClip(): Clip | undefined {
        return this.sequencer.clip;
    }  

    getMidiInput(): MIDIInput {
        let inputId = "-1687982579"
        return this.midiAccess.inputs.get(inputId)
    }
    
    noteOn(pitch: number) {
        if (this.readingPitchOptions()){
            this.manualPitchOptions.push(pitch);
        } else {
            this.manualPitchOptions = [pitch];
        }
        this.lastPitchReadAt = window.performance.now();
    }

    setExtractLength(length: number) {
        this.pitchHistory.setLength(length);
        let clipRawData = this.pitchHistory.stepsForCurrentWindow();
        clipRawData.color = this.randomColor(this.pitchHistory.windowStart!);
        let clip = new Clip(this, clipRawData);
        this.sequencer = new ClipSequencer(this, clip);
    }

    readingPitchOptions(): boolean {
        return this.lastPitchReadAt != undefined && window.performance.now() - this.lastPitchReadAt < 200;
    }

    randomColor(seed: number): string {
        let random = new SeededRandom(seed);
        let r = 64 + Math.floor(random.next() * 64);
        let b = 64 + Math.floor(random.next() * 64);
        let g = 64 + Math.floor(random.next() * 64);
        return `rgb(${r},${g},${b})`;
    }
}

class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}