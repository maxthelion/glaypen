import GrooveBox from "../groovebox.js";

export default class PlayButton {
    grooveBox: GrooveBox;
    element: HTMLElement;
    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#playbtn")!;
        if (this.element !== null) {
            this.element.addEventListener("click", () => {
                this.grooveBox.transport.togglePlay();
            });
        }
    }

    update(): void {

        if (this.grooveBox.transport.playing) {
            this.element.classList.add("playing");
        } else {
            this.element.classList.remove("playing");
        }
    }
}