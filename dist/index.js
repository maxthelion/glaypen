import GrooveBox from "./groovebox.js";
document.addEventListener("DOMContentLoaded", function (event) {
    navigator.requestMIDIAccess().then(function (midiAccess) {
        var groovebox = new GrooveBox(midiAccess);
    });
});
