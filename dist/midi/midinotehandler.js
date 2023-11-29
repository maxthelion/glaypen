var MidiNoteInputHandler = /** @class */ (function () {
    function MidiNoteInputHandler(grooveBox, input) {
        this.grooveBox = grooveBox;
        this.input = input;
        this.input.onmidimessage = this.handleClockMessage.bind(this);
    }
    MidiNoteInputHandler.prototype.handleClockMessage = function (event) {
        var type = event.data[0] & 0xf0;
        var channel = event.data[0] & 0xf;
        var note = event.data[1];
        var velocity = event.data[2];
        // console.log("type", type);
        switch (type) {
            // note on
            case 144:
                // console.log("note on", channel, note, velocity);
                if (velocity > 0) {
                    this.grooveBox.noteOn(note);
                }
                break;
            // note off
            case 128:
                // console.log("note off", event.data);
                break;
            // polyphonic aftertouch
            case 160:
                break;
            default:
                console.log("Unhandled clock message", event.data);
        }
    };
    return MidiNoteInputHandler;
}());
export default MidiNoteInputHandler;
