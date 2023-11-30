import Transport from "./transport.js";
import UI from "./ui.js";
import Sequencer, { SequencerInterface } from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";
import StorageBox from "./storagebox.js";
import Step from "./step.js";
import SongSequencer from "./songsequencer.js";
import DrumSequencer from "./drumsequencer.js";
import GeneratorManager from "./generatormanager.js";
import MidiManager from "./midi/midimanager.js";

type ScalePair = [string, number[]];

export default class GrooveBox {
    pitchHistory: PitchHistory;
    transport: Transport;
    maxClips: number = 64;
    ui: UI;
    selectedOutput?: MIDIOutput;
    clipSaver: ClipSaver;
    
    manualPitchOptions: number[] = [];
    lastPitchReadAt?: number;
    clipIndex?: number;
    playingPitches: any = {};
    phraseIndex?: number;

    scales: ScalePair[] = [
        ["Chromatic", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ,10 ,11]],
        ["Major", [0, 2, 4, 5, 7, 9, 11]],
        ["Harmonic Minor", [0, 2, 3, 5, 7, 8, 11]],
        ["Melodic Minor", [0, 2, 3, 5, 7, 9, 11]],
        ["Major Pentatonic", [0, 2, 4, 7, 9]],
        ["Minor Pentatonic", [0, 3, 5, 7, 10]],
        ["Blues", [0, 3, 5, 6, 7, 10]],
        ["Akebono", [0, 2, 3, 7, 8]],
        ["Japanese Mode", [0, 1, 5, 7, 8]],
        ["Hirajoshi", [0, 2, 3, 7, 8]],
        ["In-Sen", [0, 1, 5, 7, 10]],
        ["Iwato", [0, 1, 5, 6, 10]],
        ["Kumoi", [0, 2, 3, 7, 9]],
        ["Pelog", [0, 1, 3, 7, 8]],
        ["Whole Tone", [0, 2, 4, 6, 8, 10]],
        ["Augmented", [0, 3, 4, 7, 8, 11]],
        ["Diminished", [0, 2, 3, 5, 6, 8, 9, 11]],
        ["Gypsy", [0, 1, 4, 5, 7, 8, 10]],
        ["Hungarian Minor", [0, 2, 3, 6, 7, 8, 11]],
    
    ]

    chords: ScalePair[] = [
        ["Major Triad", [0, 4, 7]],
        ["Minor Triad", [0, 3, 7]],
        ["Diminished Triad", [0, 3, 6]],
        ["Augmented Triad", [0, 4, 8]],
        ["Major Seventh", [0, 4, 7, 11]],
        ["Minor Seventh", [0, 3, 7, 10]],
        ["Dominant Seventh", [0, 4, 7, 10]],
        ["Suspended Second", [0, 2, 7]],
        ["Suspended Fourth", [0, 5, 7]],

    ]
    majorRelativeChords: ScalePair[] = [
        ["I", [0, 4, 7]],
        ["ii", [2, 5, 9]],
        ["iii", [4, 7, 11]],
        ["IV", [5, 9, 12]],
        ["V", [7, 11, 14]],
        ["vi", [9, 12, 16]],
        ["vii", [11, 14, 17]],
    ]
    minorRelativeChords: ScalePair[] = [
        ["i", [0, 3, 7]],
        ["ii", [2, 5, 8]],
        ["III", [3, 7, 10]],
        ["iv", [5, 8, 12]],
        ["v", [7, 10, 14]],
        ["VI", [8, 12, 15]],
        ["VII", [10, 14, 17]],
    ]

    modeIndex: number = 0;
    storageBox: StorageBox = new StorageBox();
    midiAccess: MIDIAccess;
    generativeSequencer?: Sequencer;
    clipSequencer?: ClipSequencer;
    songSequencer?: SongSequencer;
    clockInput?: MIDIInput;
    generatorManager: GeneratorManager;
    midiManager: MidiManager;

    constructor(midiAccess: MIDIAccess) {
        this.clipSaver = new ClipSaver(this);
        this.generatorManager = new GeneratorManager(this);
        this.ui = new UI(this);
        this.midiAccess = midiAccess;
        this.midiManager = new MidiManager(this, midiAccess);
        if (this.midiManager.needsPrefs()) {
            this.ui.showPrefsModal("No MIDI devices set");
        }
        this.clipSequencer = undefined
        this.songSequencer = new SongSequencer(this);
        this.generativeSequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();

        this.setMode(0);
        // draw loop
        setInterval(() => {
            this.ui.update();
            this.clearExpiredNotes();
        }, 50);
    }

    moveWindow(direction: number) {
        this.pitchHistory.moveWindow(direction)
        this.adjustWindow();
        if(this.modeIndex != 1){
            this.setMode(1);
        }
    }

    adjustWindow() {
        let clipRawData = this.pitchHistory.stepsForCurrentWindow();
        clipRawData.color = this.randomColor(this.pitchHistory.windowStart!);
        let clip = new Clip(this, clipRawData);
        this.clipSequencer = new ClipSequencer(this, clip);
    }

    changeWindowLength(length: number) {
        this.pitchHistory.setLength(length)
        this.adjustWindow();
    }

    setHistoryIndex(index: number) {
        this.pitchHistory.moveWindowToPosition(index)
        this.adjustWindow();
        if(this.modeIndex != 1){
            this.setMode(1);
        }
    }
    
    playPitch(pitch: number, velocity: number = 127) {
        let maxLength = 1000;
        if (this.playingPitches[pitch] != undefined) {
            var noteOffMessage = [0x80, pitch, 0x40];   
            this.midiManager.currentOutput()!.send(noteOffMessage); 
            this.playingPitches[pitch] = undefined;
        }
        // console.log("playPitch", pitch, velocity);
        let velocityInHex = velocity.toString(16);
        var noteOnMessage = [0x90, pitch, Number('0x' + velocityInHex)];    // Note on, middle C, full velocity
        this.playingPitches[pitch] = window.performance.now();
        this.midiManager.currentOutput()!.send(noteOnMessage);  // Send note on message to first MIDI output device
    }

    clearExpiredNotes() {
        for (const key in this.playingPitches) {
            if (Object.prototype.hasOwnProperty.call(this.playingPitches, key)) {
                const time = this.playingPitches[key];
                const pitch = parseInt(key);
                // console.log("time", key, time, pitch, this.playingPitches);
                if (time != undefined && window.performance.now() - time > 500) {
                    var noteOffMessage = [0x80, pitch, 0x40];   
                    this.midiManager.currentOutput()!.send(noteOffMessage); 
                    this.playingPitches[pitch] = undefined;
                }
            }
        }
    }

    playStep(step: Step) {
        step.pitches.forEach((pitch) => {
            this.playPitch(pitch, step.velocity);
        })
    }

    setMode(modeIndex: number) {
        this.modeIndex = modeIndex;
        if (modeIndex !== 3){
            this.phraseIndex = undefined;
        }
        if (modeIndex == 0) {
            this.pitchHistory.clearWindow();
            this.clipIndex = undefined;
        }
        if (modeIndex == 1) {
            this.clipIndex = undefined;
            this.adjustWindow()
        }
        if (modeIndex == 2) {

        }
        if (modeIndex == 3) {
            if (this.phraseIndex !== undefined) {
                this.songSequencer!.rowIndex = this.phraseIndex;
            } else if ( this.clipIndex !== undefined) {
                this.songSequencer!.rowIndex = Math.floor(this.clipIndex / 8);
            }
            this.songSequencer!.updateClipData();
        }
        this.ui.setMode(modeIndex);
    }

    currentSequencer(): Sequencer | undefined {
        switch(this.modeIndex) {
            case 0:
                return this.generativeSequencer!;
                break;
            case 1:
                return this.clipSequencer;
                break;
            case 2:
                return this.clipSequencer;
                break;
            case 3:
                return this.songSequencer;
                break
        }
    }

    saveClipToIndex(index: number) {
        let clip = this.clipSequencer!.clip;
        if (clip != undefined){
            console.log("saveClipToIndex", index, clip);
            this.clipSaver.saveClipToIndex(clip, index);
        }
    }

    saveOrLoadClipAtIndex(index: number) {
        
        this.setMode(2);
        let clip = this.clipSaver.savedClips[index];
        this.clipIndex = index;
        if (clip != undefined){            
            this.clipSequencer = new ClipSequencer(this, clip);
        } else if (this.clipSequencer!.clip != undefined){
            this.saveClipToIndex(index);
        } else {
            // can't switch to clip mode because there is no clip
            return undefined
        }
    }

    clearAllClips() {
        for (let i = 0; i < this.maxClips; i++) {
            this.clipSaver.clearClipAtIndex(i);
        }
    }

    clearClipAtIndex(index: number) {
        this.clipSaver.clearClipAtIndex(index);
    }

    showPrefsModal() {
        this.ui.showPrefsModal();
    }
    closePrefsModal() {
        this.ui.closePrefsModal();
    }

    setGeneratorParam(paramName: string, value: number) {
        this.generatorManager.setGeneratorParam(paramName, value)
    }

    getChords(): ScalePair[] {
        return this.chords;
    }

    availablePitches(): number[] {
        return this.currentSequencer()!.availablePitches();
    }

    setClipParam(paramName: string, value: number) {
        console.log("setClipParams", paramName, value);
    }
 
    clipStartLeft() {
        this.clipSequencer?.clip!.shiftLeft();
    }

    clipStartRight() {
        this.clipSequencer?.clip!.shiftRight();
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
        if (this.modeIndex == 1 || this.modeIndex == 2){
            return this.clipSequencer!.clip;    
        } else if (this.modeIndex == 3){
            return this.songSequencer!.clip;
        }
    }

    saveClip(clip: Clip) {
        if (this.clipIndex != undefined) {
            this.clipSaver.saveClipToIndex(clip, this.clipIndex);
        }
    }
    
    noteOn(pitch: number) {
        this.playPitch(pitch);
        this.generatorManager.noteOn(pitch);
        if (this.generatorManager.getPitchModeIndex() == 2) {
            if (this.readingPitchOptions()){
                this.manualPitchOptions.push(pitch);
            } else {
                this.manualPitchOptions = [pitch];
            }
            this.lastPitchReadAt = window.performance.now();
        }
    }

    readingPitchOptions(): boolean {
        return this.lastPitchReadAt != undefined && window.performance.now() - this.lastPitchReadAt < 200;
    }

    setExtractLength(length: number) {
        this.pitchHistory.setLength(length);
        let clipRawData = this.pitchHistory.stepsForCurrentWindow();
        clipRawData.color = this.randomColor(this.pitchHistory.windowStart!);
        let clip = new Clip(this, clipRawData);
        this.clipSequencer = new ClipSequencer(this, clip);
    }


    setPitchGen(subModeIndex: number) {
        if (this.currentSequencer() !== undefined) {
            this.currentSequencer()!.setPitchMode(subModeIndex)
            this.generatorManager.setGeneratorParam("pitchMode", subModeIndex);
        }
    }

    setStepGen(subModeIndex: number) {
        if (this.currentSequencer() !== undefined) {
            this.currentSequencer()!.setStepMode(subModeIndex)
            this.generatorManager.setGeneratorParam("stepMode", subModeIndex);
        }
    }

    generatorButtonPressed(index: number) {
        console.log("generatorButtonPressed", index)
        // if (this.storedGenParams[index] != undefined) {
        //     this.generatorParams = Object.assign({}, this.storedGenParams[index]);
        //     this.genParamPresetIndex = index;
        // } else {
        //     this.storedGenParams[index] = { ...this.generatorParams };
        //     this.genParamPresetIndex = index;
        // }
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