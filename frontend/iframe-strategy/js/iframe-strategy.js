var channel = new MessageChannel();
var cartChannel = new MessageChannel();
function iframeLoaded(event) {
    event.target.style.height = window.innerHeight + 'px';
    // event.target.style.width = window.innerWidth + 'px';
    channel.port1.onmessage = onMessage;
    let iframe = event.target;
    iframe.contentWindow.postMessage('Register Parent Div', '*', [channel.port2]);
}

function onMessage(iframeMessage) {
    let itemData = null;
    try {
        itemData = JSON.parse(iframeMessage.data);
    } catch (e) {
        // swallow
    }
    if (itemData) {
        if (itemData.actionType) {
            if (itemData.actionType === 'OPEN_DETAIL') {
                let itemDetailSection = document.querySelector('.item-detail-section');
                if (itemDetailSection) {
                    let iframeDetailSection = itemDetailSection.querySelector('iframe');
                    iframeDetailSection.src = 'http://localhost:4200/?code=' + itemData.data.code;
                    toggleElem('MODAL');
                    iframeDetailSection.onload = () => {
                        let elemStyle = getComputedStyle(itemDetailSection, null);
                        iframeDetailSection.style.width = elemStyle.width;
                        iframeDetailSection.style.height = elemStyle.height;
                    };
                }
            }
            if (itemData.actionType === 'ADD_TO_CART') {
                document.querySelector('.cart-item-section').querySelector('iframe').contentWindow.postMessage(iframeMessage.data, '*');
            }
        }
    }
}
// window.addEventListener('message', onMessage);

// function onMessage(e) {
//     // output.innerHTML = e.data;
//     // // Use the transfered port to post a message back to the main frame
//     // e.ports[0].postMessage('Message back from the IFrame');
//     console.log("on message: ", e);
// }
var toggleElem = function(toggleTarget) {
    let toggleTargetElem = document.querySelector('[data-toggle-target="' + toggleTarget +'"]');
    if (toggleTargetElem) {
        toggleTargetElem.classList.toggle('hidden');
    }
}
var handleClickCart = function(toggleTarget) {
    let toggleTargetElem = document.querySelector('[data-toggle-target="' + toggleTarget +'"]');
    if (toggleTargetElem) {
        toggleTargetElem.classList.toggle('hidden');
    }
};
var setHeightIframe = function(selectorToHeight) {
    const parentElem = document.querySelector(selectorToHeight);
    let iframeDetailSection = parentElem.querySelector('iframe');
    let elemStyle = getComputedStyle(parentElem, null);
    iframeDetailSection.style.width = elemStyle.width;
    iframeDetailSection.style.height = elemStyle.height;
}
var bindCartIframeChannel = function(event) {
    cartChannel.port1.onmessage = (message) => {
        console.log("iframe");
    };
    let iframe = event.target;
    iframe.contentWindow.postMessage('Register Parent Div', '*', [cartChannel.port2]);
};