var PlayButton = /** @class */ (function () {
    function PlayButton(grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#playbtn");
        if (this.element !== null) {
            this.element.addEventListener("click", function () {
                _this.grooveBox.transport.togglePlay();
            });
        }
    }
    PlayButton.prototype.update = function () {
        if (this.grooveBox.transport.playing) {
            this.element.classList.add("playing");
        }
        else {
            this.element.classList.remove("playing");
        }
    };
    return PlayButton;
}());
export default PlayButton;
