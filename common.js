function addEventListenersClickAndMouseover(element, callback) {
    element.addEventListener('click', callback);
    element.addEventListener('mouseover', callback);
}

function clearAllHighlights() {
    document.querySelectorAll('.input-row, .exp-item, .soft-item, .result-item').forEach(element => {
        element.classList.remove('highlight', 'highlight-all');
    });
}

function highlight(selector, index = null) {
    const elements = document.querySelectorAll(selector);
    if (index !== null) {
        elements[index].classList.add('highlight-all');
    } else {
        elements.forEach(element => {
            element.classList.add('highlight-all');
        });
    }
}

function arraySum(array) {
    return array.reduce((a, b) => a + b, 0);
} 