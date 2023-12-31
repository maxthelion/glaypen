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
            // this.grooveBox.currentClip()!.setClipDensity(parseFloat(value));
        });
        this.cliplengthinput = this.element.querySelector("#cliplength");
        this.cliplengthinput.addEventListener("input", function (e) {
            var element = e.target;
            var value = element.value;
            _this.grooveBox.currentClip().setClipLength(parseInt(value));
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
        var rotaryElements = [];
        var densityRotary = new RotaryDial(ui, grooveBox, document.getElementById("clipDensityRotary"));
        densityRotary.getParamValue = function () {
            return this.grooveBox.currentClip().densityPercentage();
        };
        rotaryElements.push(densityRotary);
        var clipLengthRotary = new RotaryDial(ui, grooveBox, document.getElementById("clipLengthRotary"));
        clipLengthRotary.getParamValue = function () {
            return this.grooveBox.currentClip().clipLength;
        };
        rotaryElements.push(clipLengthRotary);
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
