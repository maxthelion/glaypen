var PrefsButton = /** @class */ (function () {
    function PrefsButton(ui, grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#prefsbtn");
        if (this.element !== null) {
            this.element.addEventListener("click", function () {
                _this.grooveBox.showPrefsModal();
            });
        }
    }
    return PrefsButton;
}());
export default PrefsButton;
