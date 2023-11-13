var ExtractParamsPanel = /** @class */ (function () {
    function ExtractParamsPanel(ui, grooveBox) {
        var extractLenghtInput = document.querySelector("#extractlength");
        extractLenghtInput.addEventListener("input", function (e) {
            var element = e.target;
            var value = element.value;
            grooveBox.setExtractLength(parseInt(value));
        });
    }
    ExtractParamsPanel.prototype.update = function () {
    };
    return ExtractParamsPanel;
}());
export default ExtractParamsPanel;
