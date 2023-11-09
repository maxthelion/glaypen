import GrooveBox from "../groovebox";
import UI from "../ui";

export default class PrefsButton {
    grooveBox: GrooveBox;
    element: HTMLElement | null;
    constructor(ui:UI, grooveBox: GrooveBox){
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#prefsbtn");
        if (this.element !== null) {
            this.element.addEventListener("click", () => {
                this.grooveBox.showPrefsModal();
            })
        }
    }

}