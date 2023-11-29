import GrooveBox from "../groovebox";

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
            // timing clock
            case 248:
                this.grooveBox.transport.tick();
                break;
            // start
            case 250:
                this.grooveBox.transport.startByMidi();
                break;
            // continue
            case 251:
                this.grooveBox.transport.startByMidi();
                break;
            // stop
            case 252:
                this.grooveBox.transport.stopByMidi();
                console.log("stop");
                break;
            // note on
            case 146:    
                // console.log("note on", event.data);
                console.log("note on", event.data[1]);
                this.grooveBox.noteOn(event.data[1]);
                break;
            // note off
            case 130:
                // console.log("note off", event.data);
                break;
            default:
                console.log("Unhandled clock message", event.data);
        }
    }
}