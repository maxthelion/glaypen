var MidiNoteOutput = /** @class */ (function () {
    function MidiNoteOutput(grooveBox, MIDIOutput) {
        this.playingPitches = {};
        this.midiOutput = MIDIOutput;
    }
    MidiNoteOutput.prototype.playPitch = function (pitch, velocity) {
        if (this.playingPitches[pitch] != undefined) {
            var noteOffMessage = [0x80, pitch, 0x40];
            this.currentOutput().send(noteOffMessage);
            this.playingPitches[pitch] = undefined;
        }
        this.clearExpiredNotes();
        // console.log("playPitch", pitch, velocity);
        var velocityInHex = velocity.toString(16);
        var noteOnMessage = [0x90, pitch, Number('0x' + velocityInHex)]; // Note on, middle C, full velocity
        this.playingPitches[pitch] = window.performance.now();
        this.currentOutput().send(noteOnMessage); // Send note on message to first MIDI output device
    };
    MidiNoteOutput.prototype.clearExpiredNotes = function () {
        var maxLength = 200;
        for (var key in this.playingPitches) {
            if (Object.prototype.hasOwnProperty.call(this.playingPitches, key)) {
                var time = this.playingPitches[key];
                var pitch = parseInt(key);
                // console.log("time", key, time, pitch, this.playingPitches);
                if (time != undefined && window.performance.now() - time > maxLength) {
                    var noteOffMessage = [0x80, pitch, 0x40];
                    this.currentOutput().send(noteOffMessage);
                    this.playingPitches[pitch] = undefined;
                }
            }
        }
    };
    MidiNoteOutput.prototype.currentOutput = function () {
        return this.midiOutput;
    };
    MidiNoteOutput.prototype.noteOff = function (note) {
        this.midiNoteOutput.noteOff(note);
    };
    return MidiNoteOutput;
}());
export default MidiNoteOutput;
