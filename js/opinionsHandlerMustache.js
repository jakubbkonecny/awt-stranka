import OpinionsHandler from './opinionsHandler.js';
import Mustache from './mustache.js';

export default class OpinionsHandlerMustache {
    constructor(formId, containerId, templateId) {
        this.formElm = document.getElementById(formId);
        this.containerElm = document.getElementById(containerId);
        this.template = document.getElementById(templateId).innerHTML;

        // Načítanie existujúcich názorov z localStorage
        this.loadOpinions();

        // Odoslanie formulára
        this.formElm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addOpinionFromForm();
        });
    }

    // Načítanie všetkých názorov z localStorage a zobrazenie
    loadOpinions() {
        const opinions = JSON.parse(localStorage.getItem("siteOpinions") || "[]");
        this.renderOpinions(opinions);
    }

    // Zobrazenie názorov v HTML cez Mustache
    renderOpinions(opinions) {
        this.containerElm.innerHTML = opinions.map(op => {
            const view = {
                ...op,
                createdDate: new Date(op.created).toLocaleString(),
                willReturnMessage: op.willReturn ? "Používateľ sa plánuje vrátiť 👍" : ""
            };
            view.likes = view.likes.join(", ");
            return Mustache.render(this.template, view);
        }).join('');
    }

    // Pridanie nového názoru z formulára
    addOpinionFromForm() {
        const name = this.formElm.name.value.trim();
        const email = this.formElm.email.value.trim();
        const imageUrl = this.formElm.imageUrl.value.trim();
        const opinionText = this.formElm.opinion.value.trim();
        const keywords = this.formElm.keywords.value.trim();
        const willReturn = this.formElm.willReturn.checked;
        const contentType = this.formElm.querySelector('input[name="contentType"]:checked')?.value || "";

        const likes = [];
        if (this.formElm.design.checked) likes.push("Dizajn");
        if (this.formElm.content.checked) likes.push("Obsah");
        if (this.formElm.clarity.checked) likes.push("Prehľadnosť");

        const newOpinion = {
            name,
            email,
            imageUrl,
            opinion: opinionText,
            keywords,
            willReturn,
            contentType,
            likes,
            created: new Date().toISOString()
        };

        // Uloženie do localStorage
        const opinions = JSON.parse(localStorage.getItem("siteOpinions") || "[]");
        opinions.push(newOpinion);
        localStorage.setItem("siteOpinions", JSON.stringify(opinions));

        // Renderovanie nového názoru bez načítania celej stránky
        const view = {
            ...newOpinion,
            createdDate: new Date(newOpinion.created).toLocaleString(),
            willReturnMessage: willReturn ? "Používateľ sa plánuje vrátiť 👍" : ""
        };
        view.likes = view.likes.join(", ");
        this.containerElm.innerHTML += Mustache.render(this.template, view);

        // Reset formulára
        this.formElm.reset();
    }
}
