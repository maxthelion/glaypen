import GrooveBox from "../groovebox";
import UI from "../ui";

export default class PrefsModal {
    grooveBox: GrooveBox;
    element: HTMLElement | null;
    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        grooveBox.getMidiOutputs().then((midiOutputs) => {
            console.log(midiOutputs);
            document.body.appendChild(this.element);
            this.element.innerHTML = `
                <div class="modal-content">
                    <a href="#" class="close">&times;</a>
                    <h2>Preferences</h2>
                    <label for="midiOutput">MIDI Output</label>
                    <select id="midiOutput">
                    </select>
                </div>
            `;

            let select = this.element.querySelector("#midiOutput");
            midiOutputs.forEach((output) => {
                let option = document.createElement("option");
                option.value = output.id;
                option.text = output.name;
                select.appendChild(option);
            });

            select.addEventListener("change", (e) => {
                let select = e.target as HTMLSelectElement;
                grooveBox.setMidiOutput(select.value);
            })
            
            let closeButton = this.element.querySelector(".close");
            if (closeButton !== null) {
                closeButton.addEventListener("click", () => {
                    grooveBox.closePrefsModal();
                });
            }
        });
    }
}