import GrooveBox from "./groovebox.js";

document.addEventListener("DOMContentLoaded", function(event) {
    navigator.requestMIDIAccess().then(function(midiAccess) {
        var outputId = "-2082439212";
        var selectedOutput = midiAccess.outputs.get(outputId);
        if (selectedOutput) {
            const groovebox = new GrooveBox(selectedOutput);    
        }
    });
})

