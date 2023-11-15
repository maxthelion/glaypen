var PrefsModal = /** @class */ (function () {
    function PrefsModal(ui, grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        var midiOutputs = grooveBox.getMidiOutputs();
        document.body.appendChild(this.element);
        this.element.innerHTML = "\n            <div class=\"modal-content\">\n                <a href=\"#\" class=\"close\">&times;</a>\n                <h2>Preferences</h2>\n                <label for=\"midiOutput\">MIDI Output</label>\n                <select id=\"midiOutput\">\n                </select>\n\n                <div>\n                <button id=\"clearclipbtn\">Clear clips</button>\n                </div>\n            </div>\n        ";
        var currentMidiOutputId;
        if (grooveBox.getMidiOutput() !== undefined) {
            console.log(grooveBox.getMidiOutput());
            currentMidiOutputId = grooveBox.getMidiOutput().id;
        }
        var select = this.element.querySelector("#midiOutput");
        midiOutputs.forEach(function (output) {
            console.log("output", output);
            var option = document.createElement("option");
            option.value = output.id;
            option.text = output.name;
            console.log("currentMidiOutputId", currentMidiOutputId);
            if (currentMidiOutputId != undefined && output.id === currentMidiOutputId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        var clipClearBtn = this.element.querySelector("#clearclipbtn");
        clipClearBtn.addEventListener("click", function (e) {
            _this.grooveBox.clearAllClips();
        });
        select.addEventListener("blur", function (e) {
            var select = e.target;
            grooveBox.setMidiOutput(select.value);
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
