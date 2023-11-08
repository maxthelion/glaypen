var PrefsModal = /** @class */ (function () {
    function PrefsModal(ui, grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        grooveBox.getMidiOutputs().then(function (midiOutputs) {
            console.log(midiOutputs);
            document.body.appendChild(_this.element);
            _this.element.innerHTML = "\n                <div class=\"modal-content\">\n                    <a href=\"#\" class=\"close\">&times;</a>\n                    <h2>Preferences</h2>\n                    <label for=\"midiOutput\">MIDI Output</label>\n                    <select id=\"midiOutput\">\n                    </select>\n                </div>\n            ";
            var select = _this.element.querySelector("#midiOutput");
            midiOutputs.forEach(function (output) {
                var option = document.createElement("option");
                option.value = output.id;
                option.text = output.name;
                select.appendChild(option);
            });
            select.addEventListener("change", function (e) {
                var select = e.target;
                grooveBox.setMidiOutput(select.value);
            });
            var closeButton = _this.element.querySelector(".close");
            if (closeButton !== null) {
                closeButton.addEventListener("click", function () {
                    grooveBox.closePrefsModal();
                });
            }
        });
    }
    return PrefsModal;
}());
export default PrefsModal;
