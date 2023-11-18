var PhraseSelector = /** @class */ (function () {
    function PhraseSelector(ui, grooveBox) {
        var _this = this;
        this.lastPhraseIndex = -1;
        console.log("PhraseSelector constructor");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.elements = [];
        document.querySelectorAll(".phraseLaunchBtn").forEach(function (element) {
            element = element;
            var index = element.dataset.phraseid;
            _this.elements.push(element);
            element.addEventListener("click", function (e) {
                var element = e.target;
                var index = element.dataset.phraseid;
                grooveBox.phraseIndex = parseInt(index);
                grooveBox.setMode(3);
            });
        });
    }
    PhraseSelector.prototype.update = function () {
        if (this.lastPhraseIndex !== this.grooveBox.phraseIndex) {
            if (this.grooveBox.phraseIndex !== null && this.grooveBox.phraseIndex !== undefined) {
                this.elements.forEach(function (element) {
                    element.classList.remove("active");
                });
                var element = this.elements[this.grooveBox.phraseIndex];
                element.classList.add("active");
                this.lastPhraseIndex = this.grooveBox.phraseIndex;
            }
        }
    };
    return PhraseSelector;
}());
export default PhraseSelector;
