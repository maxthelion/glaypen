var MidiMap = /** @class */ (function () {
    function MidiMap(grooveBox, midiAccess) {
        this.grooveBox = grooveBox;
        var midiInputHandler = new MidiInputHandler(grooveBox, midiAccess);
    }
    return MidiMap;
}());
export { MidiMap };
