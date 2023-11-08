import GrooveBox from "../groovebox";

export default class PrefsButton {
    grooveBox: GrooveBox;
    element: HTMLElement | null;
    constructor(grooveBox: GrooveBox){
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#prefsbtn");
        if (this.element !== null) {
            this.element.addEventListener("click", () => {
                this.grooveBox.showPrefsModal();
            })
        }
    }

}