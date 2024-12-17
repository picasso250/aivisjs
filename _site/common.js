function addEventListenersClickAndMouseover(element, callback) {
    element.addEventListener('click', callback);
    element.addEventListener('mouseover', callback);
}

function highlight(selector, index = null) {
    const elements = document.querySelectorAll(selector);
    if (index !== null) {
        elements[index].classList.add('highlight');
    } else {
        elements.forEach(element => {
            element.classList.add('highlight');
        });
    }
}

function arraySum(array) {
    return array.reduce((a, b) => a + b, 0);
}

function arraySumStr(array) {
    return array.map(e => `${e.toFixed(2)}`).join(' + ');
}