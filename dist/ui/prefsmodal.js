var PrefsModal = /** @class */ (function () {
    function PrefsModal(ui, grooveBox, message) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        var midiManager = grooveBox.midiManager;
        var midiOutputs = midiManager.getMidiOutputs();
        var midiInputs = midiManager.getMidiInputs();
        document.body.appendChild(this.element);
        this.element.innerHTML = "\n            <div class=\"modal-content\">\n                <a href=\"#\" class=\"close\">&times;</a>\n                <div id=\"message\">".concat(message, "</div>\n                <h2>Preferences</h2>\n                <h3>MIDI</h3>\n                <div class=\"prefinputgroup\">\n                <label for=\"midiOutput\">MIDI Output</label>\n                <select id=\"midiOutput\">\n                </select>\n                </div>\n                <div class=\"prefinputgroup\">\n                <label for=\"midiInput\">MIDI Clock Input</label>\n                <select id=\"midiInput\">\n                </select>\n                </div>\n\n                <div class=\"prefinputgroup\">\n                <label for=\"midiInput\">MIDI Note Input</label>\n                <select id=\"midiNoteInput\">\n                </select>\n                </div>\n                <h3>Storage</h3>\n                <div>\n                <button id=\"clearclipbtn\">Clear clips</button>\n                </div>\n            </div>\n        ");
        var currentMidiOutputId;
        if (midiManager.getOutput() !== undefined) {
            currentMidiOutputId = midiManager.getOutput().id;
        }
        var outputselect = this.element.querySelector("#midiOutput");
        midiOutputs.forEach(function (output) {
            var option = document.createElement("option");
            option.value = output.id;
            option.text = output.name;
            if (currentMidiOutputId != undefined && output.id === currentMidiOutputId) {
                option.selected = true;
            }
            outputselect.appendChild(option);
        });
        var currentMidiInputId;
        if (midiManager.getClockInput() !== undefined) {
            currentMidiInputId = midiManager.getClockInput().id;
        }
        console.log("currentMidiInputId", currentMidiInputId);
        var inputselect = this.element.querySelector("#midiInput");
        midiInputs.forEach(function (output) {
            var option = document.createElement("option");
            option.value = output.id;
            option.text = output.name;
            if (currentMidiInputId != undefined && output.id === currentMidiInputId) {
                option.selected = true;
            }
            inputselect.appendChild(option);
        });
        var currentNoteInputId;
        if (midiManager.getNoteInput() !== undefined) {
            currentNoteInputId = midiManager.getNoteInput().id;
        }
        var noteinputselect = this.element.querySelector("#midiNoteInput");
        midiInputs.forEach(function (output) {
            var option = document.createElement("option");
            option.value = output.id;
            option.text = output.name;
            if (currentNoteInputId != undefined && output.id === currentNoteInputId) {
                option.selected = true;
            }
            noteinputselect.appendChild(option);
        });
        var clipClearBtn = this.element.querySelector("#clearclipbtn");
        clipClearBtn.addEventListener("click", function (e) {
            _this.grooveBox.clearAllClips();
        });
        outputselect.addEventListener("blur", function (e) {
            var select = e.target;
            midiManager.setMidiOutput(select.value);
        });
        inputselect.addEventListener("blur", function (e) {
            var select = e.target;
            midiManager.setClockInput(select.value);
        });
        noteinputselect.addEventListener("blur", function (e) {
            var select = e.target;
            console.log("noteinputselect", select.value);
            midiManager.setNoteInput(select.value);
        });
        var closeButton = this.element.querySelector(".close");
        if (closeButton !== null) {
            closeButton.addEventListener("click", function () {
                grooveBox.closePrefsModal();
            });
        }
    }
    return PrefsModal;
}());
export default PrefsModal;
