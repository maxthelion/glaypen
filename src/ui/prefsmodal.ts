import GrooveBox from "../groovebox";
import UI from "../ui";

export default class PrefsModal {
    grooveBox: GrooveBox;
    element: HTMLElement | null;
    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.element = document.createElement("div");
        this.element.id = "prefsmodal";
        let midiOutputs = grooveBox.getMidiOutputs()

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
        let currentMidiOutputId : string | undefined;
        if (grooveBox.getMidiOutput() !== undefined) {
            console.log(grooveBox.getMidiOutput())
            currentMidiOutputId = grooveBox.getMidiOutput().id;
        }
        let select = this.element.querySelector("#midiOutput");
        midiOutputs.forEach((output) => {
            console.log("output", output)
            let option = document.createElement("option");
            option.value = output.id;
            option.text = output.name!;
            console.log("currentMidiOutputId", currentMidiOutputId)
            if (currentMidiOutputId != undefined && output.id === currentMidiOutputId) {
                option.selected = true;
            }
            select!.appendChild(option);
        });

        select!.addEventListener("blur", (e) => {
            let select = e.target as HTMLSelectElement;
            grooveBox.setMidiOutput(select.value);
        })

        let closeButton = this.element.querySelector(".close");
        if (closeButton !== null) {
            closeButton.addEventListener("click", () => {
                grooveBox.closePrefsModal();
            });
        }

    }
}