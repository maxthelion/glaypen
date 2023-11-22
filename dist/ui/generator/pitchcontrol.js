import RotaryControl from "../rotarycontrol.js";
var PitchControl = /** @class */ (function () {
    function PitchControl(ui, grooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.createElement("div");
        this.element.classList.add("pitchcontrol");
        this.element.classList.add("gencontrolset");
        this.renderables = [];
        // tonic rotary
        var tonicRotary = new RotaryControl(ui, grooveBox);
        tonicRotary.setValue = function (value) {
            var tonicValue = Math.floor(value * 128);
            this.grooveBox.setGeneratorParam("tonic", tonicValue);
        };
        tonicRotary.readValue = function () { return this.grooveBox.generatorParams.tonic / 128; };
        tonicRotary.displayValue = function () {
            var pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            return pitches[this.grooveBox.generatorParams.tonic % 12];
        };
        tonicRotary.setLabel("Root note");
        this.element.appendChild(tonicRotary.element);
        this.renderables.push(tonicRotary);
        // pitchProbability Rotary 
        var pitchRangeRotary = new RotaryControl(ui, grooveBox);
        pitchRangeRotary.setValue = function (value) {
            var modifiedValue = Math.floor(value * 12);
            this.grooveBox.setGeneratorParam("pitchRange", modifiedValue);
        };
        pitchRangeRotary.readValue = function () { return this.grooveBox.generatorParams.pitchRange / 12; };
        pitchRangeRotary.displayValue = function () { return this.grooveBox.generatorParams.pitchRange.toString(); };
        pitchRangeRotary.getIncrement = function () { return 1 / 12; };
        pitchRangeRotary.setLabel("Pitch range");
        this.element.appendChild(pitchRangeRotary.element);
        this.renderables.push(pitchRangeRotary);
        // <div>
        // <select class="genparam" name="scale" id="scale" data-paramid="scaleIndex">
        // </select>
        // <label for="scale">Scale</label>
        // </div>
        var div = document.createElement("div");
        var scaleSelect = document.createElement("select");
        scaleSelect.classList.add("genparam");
        scaleSelect.name = "scale";
        scaleSelect.id = "scale";
        scaleSelect.dataset.paramid = "scaleIndex";
        div.appendChild(scaleSelect);
        this.element.appendChild(div);
        var scales = this.grooveBox.scales;
        for (var i = 0; i < scales.length; i++) {
            var option = document.createElement("option");
            option.value = i.toString();
            option.text = scales[i][0];
            if (this.grooveBox.generatorParams.scaleIndex == i) {
                option.selected = true;
            }
            scaleSelect.add(option);
        }
    }
    PitchControl.prototype.update = function () {
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return PitchControl;
}());
export default PitchControl;
