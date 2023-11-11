import GrooveBox from "./groovebox";

export default class MidiInputHandler {
    grooveBox: GrooveBox;
    clockInput: MIDIInput;
    constructor(grooveBox:GrooveBox, clockInput: MIDIInput) {
        this.grooveBox = grooveBox;
        this.clockInput = clockInput;
        this.clockInput.onmidimessage = this.handleClockMessage.bind(this);
    }

    handleClockMessage(event: MIDIMessageEvent) {
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
            default:
                console.log("Unhandled clock message", event.data);
        }
    }
}