var ClipParamsPanel = /** @class */ (function () {
    function ClipParamsPanel(ui, grooveBox) {
        var _this = this;
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
        this.paramElements.forEach(function (paramElement) {
            var paramId = paramElement.dataset.paramid;
            var clip = _this.grooveBox.sequencer.clip;
            paramElement.addEventListener("input", function (e) {
                var element = e.target;
                var value = element.value;
                _this.grooveBox.setClipParam(paramId, parseInt(value));
            });
        });
    }
    ClipParamsPanel.prototype.update = function () {
    };
    return ClipParamsPanel;
}());
export default ClipParamsPanel;
