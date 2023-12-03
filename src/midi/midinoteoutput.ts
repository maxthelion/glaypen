import GrooveBox from "../groovebox.js";

export default class MidiNoteOutput {
    midiOutput: MIDIOutput;
    playingPitches: any = {};

    constructor(grooveBox: GrooveBox, MIDIOutput: MIDIOutput) {
        this.midiOutput = MIDIOutput;
    }

    playPitch(pitch: number, velocity: number) {
        if (this.playingPitches[pitch] != undefined) {
            var noteOffMessage = [0x80, pitch, 0x40];   
            this.currentOutput()!.send(noteOffMessage); 
            this.playingPitches[pitch] = undefined;
        }
        this.clearExpiredNotes();
        // console.log("playPitch", pitch, velocity);
        let velocityInHex = velocity.toString(16);
        var noteOnMessage = [0x90, pitch, Number('0x' + velocityInHex)];    // Note on, middle C, full velocity
        this.playingPitches[pitch] = window.performance.now();
        this.currentOutput()!.send(noteOnMessage);  // Send note on message to first MIDI output device
    }

    clearExpiredNotes() {
        let maxLength = 200;
        for (const key in this.playingPitches) {
            if (Object.prototype.hasOwnProperty.call(this.playingPitches, key)) {
                const time = this.playingPitches[key];
                const pitch = parseInt(key);
                // console.log("time", key, time, pitch, this.playingPitches);
                if (time != undefined && window.performance.now() - time > maxLength) {
                    var noteOffMessage = [0x80, pitch, 0x40];   
                    this.currentOutput()!.send(noteOffMessage); 
                    this.playingPitches[pitch] = undefined;
                }
            }
        }
    }

    currentOutput(){
        return this.midiOutput;
    }

    noteOff(note: number) {
        this.midiNoteOutput.noteOff(note);
    }
}