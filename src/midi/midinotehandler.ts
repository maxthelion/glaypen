import GrooveBox from "../groovebox";

export default class MidiNoteInputHandler {
    grooveBox: GrooveBox;
    input: MIDIInput;
    constructor(grooveBox:GrooveBox, input: MIDIInput) {
        this.grooveBox = grooveBox;
        this.input = input;
        this.input.onmidimessage = this.handleClockMessage.bind(this);
    }

    handleClockMessage(event: MIDIMessageEvent) {
        let type = event.data[0] & 0xf0;
        let channel =  event.data[0] & 0xf;
        let note = event.data[1];
        let velocity = event.data[2];
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
    }
}