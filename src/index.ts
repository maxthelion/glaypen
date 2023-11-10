import GrooveBox from "./groovebox.js";

document.addEventListener("DOMContentLoaded", function(event) {
    navigator.requestMIDIAccess().then(function(midiAccess) {
        const groovebox = new GrooveBox(midiAccess);    
    });
})

