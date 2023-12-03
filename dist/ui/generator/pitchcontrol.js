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
import IntervalProbabilityControl from "../intervalprobabilitycontrol.js";
import PianoNoteView from "../pianonoteview.js";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";
var PitchControl = /** @class */ (function (_super) {
    __extends(PitchControl, _super);
    function PitchControl(ui, grooveBox) {
        var _this = _super.call(this, ui, grooveBox) || this;
        _this.intervalProbabilityControls = [];
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
        this.highlightInterval();
    };
    PitchControl.prototype.highlightInterval = function () {
        if (this.intervalProbabilityControls.length > 0) {
            this.intervalProbabilityControls.forEach(function (button) {
                button.update();
            });
        }
    };
    PitchControl.prototype.getSubModeIndex = function () {
        // console.log("getSubModeIndex", this.generatorManager)
        return this.grooveBox.generatorManager.getPitchModeIndex();
    };
    PitchControl.prototype.setSubControls = function () {
        _super.prototype.setSubControls.call(this);
        switch (this.getSubModeIndex()) {
            case 0:
                var keyRotary = this.addRotaryControl("scaleKey", "Key", 12);
                keyRotary.displayValue = function () {
                    var pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                    return pitches[Math.round(this.readValue() * 12) % 12];
                };
                this.addScaleSelect();
                // tonic rotary
                var tonicRotary = this.addRotaryControl("tonic", "Scale offset", 0);
                tonicRotary.getValueScale = function () {
                    return this.grooveBox.generatorManager.getScale().length;
                };
                // tonicRotary.displayValue = function () {
                //     let pitches = 
                //     let octave = Math.floor((this.readValue() * this.valueScale) / 12);
                //     return pitches[ Math.round(this.readValue() * this.valueScale) % 12 ] + octave.toString();
                // }
                var octaveRotary = this.addRotaryControl("scaleOctaveRoot", "Octave", 10);
                // pitchProbability Rotary
                this.addRotaryControl("pitchRange", "Pitch range", 12);
                this.addIntervalChooser();
                this.addRotaryControl("octaveRange", "Octave range", 10);
                this.addRotaryControl("octaveProbability", "Octave probability", 128);
                break;
            case 1:
                //
                // chordRoot rotary
                var chordRootRotary = this.addRotaryControl("chordRoot", "Chord offset", 12);
                chordRootRotary.getValueScale = function () {
                    return this.grooveBox.generatorManager.getChordScale().length;
                };
                this.addScaleSelect("chordScaleIndex", "Chord scale");
                var chordOctaveRotary = this.addRotaryControl("chordOctaveRoot", "Octave", 10);
                var chordKey = this.addRotaryControl("chordKey", "Key", 12);
                chordKey.displayValue = function () {
                    var pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                    return pitches[Math.round(this.readValue() * 12) % 12];
                };
                this.addChordChooser();
                this.addChordSelect();
                // something
                break;
        }
    };
    PitchControl.prototype.addChordChooser = function () {
        var _this = this;
        var div = document.createElement("div");
        div.classList.add("chordchooser");
        var chordNames = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
        var chordModes = ["maj", "min", "min", "maj", "maj", "min", "dim"];
        for (var i = 0; i < 7; i++) {
            var button = document.createElement("a");
            button.href = "#";
            button.classList.add("chordbutton");
            button.textContent = chordNames[i];
            button.dataset.chordIndex = this.mapModeToChordIndex(chordModes[i]).toString();
            button.dataset.chordRoot = i.toString();
            div.appendChild(button);
            button.addEventListener("click", function (e) {
                var element = e.target;
                var chordRoot = element.dataset.chordRoot;
                var chordIndex = element.dataset.chordIndex;
                _this.grooveBox.setGeneratorParam("chordRoot", parseInt(chordRoot));
                _this.grooveBox.setGeneratorParam("chordIndex", parseInt(chordIndex));
            });
        }
        this.footElement.appendChild(div);
    };
    PitchControl.prototype.addIntervalChooser = function () {
        var div = document.createElement("div");
        div.classList.add("intervalchooser");
        var intervals = [];
        for (var i = 0; i < 12; i++) {
            intervals.push(i);
        }
        this.intervalProbabilityControls = [];
        for (var i = 0; i < intervals.length; i++) {
            var intervalProbabilityControl = new IntervalProbabilityControl(this.ui, this.grooveBox, i);
            div.appendChild(intervalProbabilityControl.element);
            this.subRenderables.push(intervalProbabilityControl);
            this.intervalProbabilityControls.push(intervalProbabilityControl);
        }
        this.footElement.appendChild(div);
    };
    PitchControl.prototype.mapModeToChordIndex = function (mode) {
        switch (mode) {
            case "maj":
                return 0;
            case "min":
                return 1;
            case "dim":
                return 2;
        }
    };
    PitchControl.prototype.addScaleSelect = function (paramName, label) {
        var _this = this;
        if (paramName === void 0) { paramName = "scaleIndex"; }
        if (label === void 0) { label = "Scale"; }
        var div = document.createElement("div");
        this.scaleSelect = document.createElement("select");
        this.scaleSelect.dataset.paramid = paramName;
        this.scaleSelect.addEventListener("change", function (e) {
            var element = e.target;
            var value = element.value;
            _this.grooveBox.setGeneratorParam(paramName, parseInt(value));
        });
        div.appendChild(this.scaleSelect);
        this.controlSet.appendChild(div);
        var scales = this.grooveBox.scales;
        for (var i = 0; i < scales.length; i++) {
            var option = document.createElement("option");
            option.value = i.toString();
            option.text = scales[i][0];
            if (this.grooveBox.generatorManager.getCurrentAttribute(paramName) == i) {
                option.selected = true;
            }
            this.scaleSelect.add(option);
        }
    };
    PitchControl.prototype.addChordSelect = function () {
        var _this = this;
        var chordDiv = document.createElement("div");
        this.scaleSelect = document.createElement("select");
        this.scaleSelect.addEventListener("change", function (e) {
            var element = e.target;
            var value = element.value;
            _this.grooveBox.setGeneratorParam("chordIndex", parseInt(value));
        });
        chordDiv.appendChild(this.scaleSelect);
        this.footElement.appendChild(chordDiv);
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
