import EventHandler from "../eventhandler.js";
import GrooveBox from "../groovebox.js";

export default class PlayButton {
    grooveBox: GrooveBox;
    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        var playButton = document.querySelector("#playbtn");
        if (playButton !== null) {
            playButton.addEventListener("click", () => {
                this.grooveBox.transport.togglePlay();
            });
        }
    }
}