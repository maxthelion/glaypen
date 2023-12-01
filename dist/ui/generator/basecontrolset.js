var BaseControlSet = /** @class */ (function () {
    function BaseControlSet(ui, grooveBox) {
        this.modeButtons = [];
        this.subRenderables = [];
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
        this.footElement = document.createElement("div");
        this.element.appendChild(this.footElement);
        this.addModeButtons(this.getSubModeLabels());
        this.renderables = [];
        this.setSubControls();
    }
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
                _this.onModeChange(parseInt(modeIndex));
            });
        }
        this.headElement.appendChild(stepGenMode);
    };
    BaseControlSet.prototype.onModeChange = function (mode) {
    };
    BaseControlSet.prototype.getSubModeIndex = function () {
        throw new Error("Method not implemented.");
    };
    BaseControlSet.prototype.setSubControls = function () {
        // console.log("setSubControls")
        var controlSet = this.controlSet;
        this.subRenderables = [];
        controlSet.innerHTML = "";
        this.footElement.innerHTML = "";
    };
    BaseControlSet.prototype.update = function () {
        this.modeButtons.forEach(function (button) {
            button.classList.remove("selected");
        });
        this.modeButtons[this.getSubModeIndex()].classList.add("selected");
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
        this.subRenderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return BaseControlSet;
}());
export default BaseControlSet;
