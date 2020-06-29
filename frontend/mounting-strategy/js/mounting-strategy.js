var toggleElem = function(toggleTarget) {
    let toggleTargetElem = document.querySelector('[data-toggle-target="' + toggleTarget +'"]');
    if (toggleTargetElem) {
        toggleTargetElem.classList.toggle('hidden');
    }
};
pubSub.subscribe('OPEN_DETAIL', (data) => {
    toggleElem('MODAL');
});