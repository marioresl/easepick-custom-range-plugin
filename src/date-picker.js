import {create} from "@easepick/core";

export class DatePickerElement extends HTMLElement {
    constructor() {
        super();
        this.picker = null;
    }

    connectedCallback() {
        this.picker = new create( {
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css'
            ],
            element: this,
            format: "YYYY-MM-DD",
            autoApply: true
        });
    }
}

customElements.define('date-picker', DatePickerElement);

export default DatePickerElement;