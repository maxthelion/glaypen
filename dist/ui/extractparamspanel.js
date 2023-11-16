import RotaryDial from "./rotarydial.js";
var ExtractParamsPanel = /** @class */ (function () {
    function ExtractParamsPanel(ui, grooveBox) {
        this.renderables = [];
        this.element = document.querySelector("#extractpane");
        var extractLenghtInput = document.querySelector("#extractlength");
        extractLenghtInput.addEventListener("input", function (e) {
            var element = e.target;
            var value = element.value;
            grooveBox.setExtractLength(parseInt(value));
        });
        var rotaries = this.element.querySelectorAll(".rotary");
        var array = Array.from(rotaries);
        var rotaryElements = array.map(function (element) {
            var r = new RotaryDial(ui, grooveBox, element);
            r.getParamValue = function () {
                return this.grooveBox.sequencer.clip.clipLength;
            };
            return r;
        });
        this.renderables = this.renderables.concat(rotaryElements);
    }
    ExtractParamsPanel.prototype.update = function () {
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return ExtractParamsPanel;
}());
export default ExtractParamsPanel;
