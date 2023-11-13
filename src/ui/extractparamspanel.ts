import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class ExtractParamsPanel implements Renderable {

    constructor(ui:UI, grooveBox: GrooveBox) {
        let extractLenghtInput = document.querySelector("#extractlength") as HTMLInputElement;
        extractLenghtInput.addEventListener("input", (e) => {
            let element = e.target as HTMLInputElement;
            let value = element.value;
            grooveBox.setExtractLength(parseInt(value));
        })
    }

    update() {

    }
}