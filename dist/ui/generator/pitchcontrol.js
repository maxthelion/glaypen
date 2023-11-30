var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import PianoNoteView from "../pianonoteview.js";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";
var PitchControl = /** @class */ (function (_super) {
    __extends(PitchControl, _super);
    function PitchControl(ui, grooveBox) {
        var _this = _super.call(this, ui, grooveBox) || this;
        _this.pianoNoteView = new PianoNoteView(ui, grooveBox);
        _this.headElement.appendChild(_this.pianoNoteView.element);
        _this.renderables.push(_this.pianoNoteView);
        _this.generatorManager = grooveBox.generatorManager;
        console.log("pitch control constructor", _this.generatorManager);
        return _this;
    }
    PitchControl.prototype.getSubModeLabels = function () {
        return "Scale Chord Manual".split(" ");
    };
    PitchControl.prototype.onModeChange = function (mode) {
        this.grooveBox.setPitchGen(mode);
        this.setSubControls();
    };
    PitchControl.prototype.update = function () {
        _super.prototype.update.call(this);
        this.setScaleValue();
    };
    PitchControl.prototype.getSubModeIndex = function () {
        // console.log("getSubModeIndex", this.generatorManager)
        return this.grooveBox.generatorManager.getPitchModeIndex();
    };
    PitchControl.prototype.setSubControls = function () {
        var _this = this;
        _super.prototype.setSubControls.call(this);
        switch (this.getSubModeIndex()) {
            case 0:
                // tonic rotary
                var tonicRotary = this.addRotaryControl("tonic", "Root note", 12);
                tonicRotary.displayValue = function () {
                    var pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                    return pitches[this.readValue() % 12];
                };
                // pitchProbability Rotary
                this.addRotaryControl("pitchRange", "Pitch range", 12);
                // <div>
                // <select class="genparam" name="scale" id="scale" data-paramid="scaleIndex">
                // </select>
                // <label for="scale">Scale</label>
                // </div>
                var div = document.createElement("div");
                this.scaleSelect = document.createElement("select");
                this.scaleSelect.classList.add("genparam");
                this.scaleSelect.name = "scale";
                this.scaleSelect.id = "scale";
                this.scaleSelect.dataset.paramid = "scaleIndex";
                this.scaleSelect.addEventListener("change", function (e) {
                    var element = e.target;
                    var value = element.value;
                    _this.grooveBox.setGeneratorParam("scaleIndex", parseInt(value));
                });
                div.appendChild(this.scaleSelect);
                this.controlSet.appendChild(div);
                var scales = this.grooveBox.scales;
                for (var i = 0; i < scales.length; i++) {
                    var option = document.createElement("option");
                    option.value = i.toString();
                    option.text = scales[i][0];
                    if (this.grooveBox.generatorManager.getCurrentAttribute("scaleIndex") == i) {
                        option.selected = true;
                    }
                    this.scaleSelect.add(option);
                }
                break;
            case 1:
                //
                // chordRoot rotary
                var chordRootRotary = this.addRotaryControl("chordRoot", "Root note", 12);
                chordRootRotary.displayValue = function () {
                    var pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                    // console.log("this.displayValue")
                    return pitches[this.grooveBox.generatorManager.currentGeneratorParams.chordRoot % 12];
                };
                var chordDiv = document.createElement("div");
                this.scaleSelect = document.createElement("select");
                this.scaleSelect.addEventListener("change", function (e) {
                    var element = e.target;
                    var value = element.value;
                    _this.grooveBox.setGeneratorParam("chordIndex", parseInt(value));
                });
                chordDiv.appendChild(this.scaleSelect);
                this.controlSet.appendChild(chordDiv);
                var chords = this.grooveBox.getChords();
                for (var i = 0; i < chords.length; i++) {
                    var option = document.createElement("option");
                    option.value = i.toString();
                    option.text = chords[i][0];
                    if (this.grooveBox.generatorManager.currentGeneratorParams.chordIndex == i) {
                        option.selected = true;
                    }
                    this.scaleSelect.add(option);
                }
                // something
                break;
        }
    };
    PitchControl.prototype.addRotaryControl = function (paramName, label, valueScale) {
        var rotary = new RotaryControl(this.ui, this.grooveBox);
        rotary.valueScale = valueScale;
        rotary.paramName = paramName;
        rotary.setLabel(label);
        this.controlSet.appendChild(rotary.element);
        this.subRenderables.push(rotary);
        return rotary;
    };
    PitchControl.prototype.setScaleValue = function () {
        if (this.scaleSelect !== undefined) {
            this.scaleSelect.value = this.generatorManager.currentGeneratorParams.scaleIndex.toString();
        }
    };
    return PitchControl;
}(BaseControlSet));
export default PitchControl;
