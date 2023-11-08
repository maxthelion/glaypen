import Transport from "./transport.js";
import UI from "./ui.js";
import Loop from "./loop.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";

export default class GrooveBox {
    pitchHistory: PitchHistory;
    transport: Transport;
    ui: UI;
    selectedOutput: MIDIOutput;
    sequencer: Sequencer;
    windowStart?: number;
    clipSaver: ClipSaver;

    constructor(selectedOutput: MIDIOutput) {
        this.ui = new UI(this);
        this.selectedOutput = selectedOutput;
        this.sequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();
        this.clipSaver = new ClipSaver(this);
        // draw loop
        setInterval(() => {
            this.ui.update();
        }, 50);
    }

    moveWindow(direction: number) {
        if (this.windowStart){
            this.windowStart += direction;
        } else {
            let clipWindowLength = 16;
            let minStep = this.pitchHistory.maxStep - clipWindowLength;
            this.windowStart = minStep;
        }
        let selectedSteps = this.pitchHistory.stepsForWindow(this.windowStart)
        console.log("selectedSteps", selectedSteps);
        let clip = new Clip(this, selectedSteps);
        this.sequencer = new ClipSequencer(this, clip);
    }
    
    playPitch(pitch: number) {
        console.log("playPitch", pitch);
        var noteOnMessage = [0x90, pitch, 0x7f];    // Note on, middle C, full velocity
        this.selectedOutput.send(noteOnMessage);  // Send note on message to first MIDI output device
        var noteOffMessage = [0x80, pitch, 0x40];   // Note off, middle C,
        this.selectedOutput.send(noteOffMessage, window.performance.now() + 400.0); // In one second
    }

    saveClipToIndex(index: number) {
        let clip = this.sequencer.clip;
        if (clip != undefined){
            this.clipSaver.saveClipToIndex(clip, index);
        }
    }

    saveOrLoadClipAtIndex(index: number) {
        let clip = this.clipSaver.savedClips[index];
        if (clip != undefined){
            this.sequencer = new ClipSequencer(this, clip);
        } else {
            this.saveClipToIndex(index);
        }
    }

    showPrefsModal() {
        this.ui.showPrefsModal();
    }
    closePrefsModal() {
        this.ui.closePrefsModal();
    }

    getMidiOutputs(): Promise<MIDIOutput[]> {
        return navigator.requestMIDIAccess().then(function(midiAccess) {
            var outputs = Array.from(midiAccess.outputs.values());
            return outputs;
        });
    }

    setMidiOutput(outputId: MIDIOutput) {
        var groooveBox = this;
        navigator.requestMIDIAccess().then(function(midiAccess) {
            var selectedOutput = midiAccess.outputs.get(outputId);
            if (selectedOutput) {
                groooveBox.selectedOutput = selectedOutput;
            }
        });
    }
}

