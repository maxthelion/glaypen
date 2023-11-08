var PlayButton = /** @class */ (function () {
    function PlayButton(grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        var playButton = document.querySelector("#playbtn");
        if (playButton !== null) {
            playButton.addEventListener("click", function () {
                _this.grooveBox.transport.togglePlay();
            });
        }
    }
    return PlayButton;
}());
export default PlayButton;
