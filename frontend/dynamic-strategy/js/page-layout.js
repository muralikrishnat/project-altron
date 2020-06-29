
let pageLayoutTemplate = ``;
let pageLayoutStyles = ``;
class PageLayout extends HTMLElement {
    constructor() {
        super();
        console.log("PageLayout - constructor Callback", new Date().toLocaleTimeString());
    }
    
    connectedCallback() {
        console.log("PageLayout - connected Callback", new Date().toLocaleTimeString());
    }
    attributeChangeCallback() {
        console.log("PageLayout - attribute change Callback", new Date().toLocaleTimeString());
    }
    disconnectedCallback() {
        console.log("PageLayout - Disconnected Callback", new Date().toLocaleTimeString());
    }

    render() {
        
    }
}

customElements.define('page-layout', PageLayout);