import RotaryDial from "./rotarydial.js";
var ClipParamsPanel = /** @class */ (function () {
    function ClipParamsPanel(ui, grooveBox) {
        var _this = this;
        this.renderables = [];
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#clippane");
        this.paramElements = this.element.querySelectorAll(".clipparam");
        var clipLeftBtn = this.element.querySelector("#clipstartleftbtn");
        clipLeftBtn.addEventListener("click", function (e) {
            _this.grooveBox.clipStartLeft();
        });
        var clipRightBtn = this.element.querySelector("#clipstartrightbtn");
        clipRightBtn.addEventListener("click", function (e) {
            _this.grooveBox.clipStartRight();
        });
        var clipshufflepitchesbtn = this.element.querySelector("#clipshufflepitchesbtn");
        clipshufflepitchesbtn.addEventListener("click", function (e) {
            _this.grooveBox.shuffleClipPitches();
        });
        var clipshufflestepsbtn = this.element.querySelector("#clipshufflestepsbtn");
        clipshufflestepsbtn.addEventListener("click", function (e) {
            _this.grooveBox.shuffleClipSteps();
        });
        // let clipEndInput = this.element.querySelector("#clipend") as HTMLInputElement;
        // clipEndInput.addEventListener("input", (e) => {
        //     let element = e.target as HTMLInputElement;
        //     let value = element.value;
        //     // this.grooveBox.setClipEnd(parseInt(value));
        // })
        // clipEndInput.value = this.grooveBox.currentClip()!.clipLength().toString();
        this.clipdensityinput = this.element.querySelector("#clipdensity");
        this.clipdensityinput.addEventListener("input", function (e) {
            var element = e.target;
            var value = element.value;
            _this.grooveBox.currentClip().setClipDensity(parseFloat(value));
        });
        // this.paramElements.forEach((paramElement) => {
        //     let paramId = paramElement.dataset.paramid;
        //     let clip = this.grooveBox.sequencer.clip;
        //     paramElement.addEventListener("input", (e) => {
        //         let element = e.target as HTMLInputElement;
        //         let value = element.value;
        //         this.grooveBox.setClipParam(paramId!, parseInt(value));
        //     })
        // });
        var rotaries = this.element.querySelectorAll(".rotary");
        var array = Array.from(rotaries);
        var rotaryElements = array.map(function (element) {
            var r = new RotaryDial(ui, grooveBox, element);
            r.getParamValue = function () {
                return this.grooveBox.sequencer.clip.densityPercentage();
            };
            return r;
        });
        this.renderables = this.renderables.concat(rotaryElements);
    }
    ClipParamsPanel.prototype.update = function () {
        this.clipdensityinput.value = this.grooveBox.currentClip().densityPercentage().toString();
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return ClipParamsPanel;
}());
export default ClipParamsPanel;
