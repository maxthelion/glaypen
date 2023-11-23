var BaseControlSet = /** @class */ (function () {
    function BaseControlSet(ui, grooveBox) {
        this.modeButtons = [];
        this.subModeIndex = 0;
        this.subModeLabels = "SubMode1 SubMode2 SubMode3".split(" ");
        console.log("BaseControlSet constructor");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.createElement("div");
        this.headElement = document.createElement("div");
        this.element.appendChild(this.headElement);
        this.controlSet = document.createElement("div");
        this.controlSet.classList.add("pitchcontrol");
        this.controlSet.classList.add("gencontrolset");
        this.element.appendChild(this.controlSet);
        this.addModeButtons(this.getSubModeLabels());
        this.renderables = [];
        this.setSubControls(0);
    }
    // overload in subclass
    BaseControlSet.prototype.setSubModeIndex = function (index) {
        this.subModeIndex = index;
    };
    BaseControlSet.prototype.getSubModeLabels = function () {
        console.log("getSubModeLabels", this.subModeLabels);
        return this.subModeLabels;
    };
    BaseControlSet.prototype.addModeButtons = function (modes) {
        var _this = this;
        var stepGenMode = document.createElement("div");
        stepGenMode.classList.add("stepgenmode");
        for (var i = 0; i < modes.length; i++) {
            var mode = modes[i];
            var button = document.createElement("a");
            button.classList.add("stepgenmodebutton");
            button.textContent = mode;
            button.href = "#";
            button.dataset.modeIndex = i.toString();
            this.modeButtons.push(button);
            stepGenMode.appendChild(button);
            button.addEventListener("click", function (e) {
                var element = e.target;
                var modeIndex = element.dataset.modeIndex;
                _this.grooveBox.setGeneratorParam("pitchmodeindex", parseInt(modeIndex));
                _this.subModeIndex = parseInt(modeIndex);
                _this.setSubControls(parseInt(modeIndex));
            });
        }
        this.headElement.appendChild(stepGenMode);
    };
    BaseControlSet.prototype.setSubControls = function (mode) {
    };
    BaseControlSet.prototype.update = function () {
        this.modeButtons.forEach(function (button) {
            button.classList.remove("selected");
        });
        this.modeButtons[this.subModeIndex].classList.add("selected");
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return BaseControlSet;
}());
export default BaseControlSet;
