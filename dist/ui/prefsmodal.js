var PrefsModal = /** @class */ (function () {
    function PrefsModal(ui, grooveBox, message) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        var midiOutputs = grooveBox.getMidiOutputs();
        var midiInputs = grooveBox.getMidiInputs();
        document.body.appendChild(this.element);
        this.element.innerHTML = "\n            <div class=\"modal-content\">\n                <a href=\"#\" class=\"close\">&times;</a>\n                <div id=\"message\">".concat(message, "</div>\n                <h2>Preferences</h2>\n                <h3>MIDI</h3>\n                <div class=\"prefinputgroup\">\n                <label for=\"midiOutput\">MIDI Output</label>\n                <select id=\"midiOutput\">\n                </select>\n                </div>\n                <div class=\"prefinputgroup\">\n                <label for=\"midiInput\">MIDI Input</label>\n                <select id=\"midiInput\">\n                </select>\n                </div>\n                <h3>Storage</h3>\n                <div>\n                <button id=\"clearclipbtn\">Clear clips</button>\n                </div>\n            </div>\n        ");
        var currentMidiOutputId;
        if (grooveBox.getMidiOutput() !== undefined) {
            currentMidiOutputId = grooveBox.getMidiOutput().id;
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
        if (grooveBox.getMidiInput() !== undefined) {
            currentMidiInputId = grooveBox.getMidiInput().id;
        }
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
        var clipClearBtn = this.element.querySelector("#clearclipbtn");
        clipClearBtn.addEventListener("click", function (e) {
            _this.grooveBox.clearAllClips();
        });
        outputselect.addEventListener("blur", function (e) {
            var select = e.target;
            grooveBox.setMidiOutput(select.value);
        });
        inputselect.addEventListener("blur", function (e) {
            var select = e.target;
            grooveBox.setMidiInput(select.value);
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
