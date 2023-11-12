var MidiInputHandler = /** @class */ (function () {
    function MidiInputHandler(grooveBox, clockInput) {
        this.grooveBox = grooveBox;
        this.clockInput = clockInput;
        this.clockInput.onmidimessage = this.handleClockMessage.bind(this);
    }
    MidiInputHandler.prototype.handleClockMessage = function (event) {
        switch (event.data[0]) {
            case 248:
                this.grooveBox.transport.tick();
                break;
            case 250:
                this.grooveBox.transport.start();
                console.log("start", event.data);
                break;
            case 251:
                this.grooveBox.transport.start();
                break;
            case 252:
                this.grooveBox.transport.stop();
                break;
            case 146:
                // console.log("note on", event.data);
                this.grooveBox.noteOn(event.data[1]);
                break;
            case 130:
                // console.log("note off", event.data);
                break;
            default:
                console.log("Unhandled clock message", event.data);
        }
    };
    return MidiInputHandler;
}());
export default MidiInputHandler;
