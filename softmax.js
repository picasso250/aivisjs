function calculateSoftmax() {
    // 获取所有输入值
    const inputs = Array.from(document.querySelectorAll('.x-input'))
        .map(input => parseFloat(input.value));
    
    // 计算exp值
    const expValues = inputs.map(x => Math.exp(x));
    const expSum = expValues.reduce((a, b) => a + b, 0);
    
    // 计算softmax值
    const softmaxValues = expValues.map(exp => exp / expSum);
    
    // 更新exp显示
    document.querySelectorAll('.exp-item').forEach((item, index) => {
        setupContentAndTooltip(
            item,
            `exp(X${index + 1}) = ${expValues[index].toFixed(2)}`,
            `exp(${inputs[index].toFixed(2)}) = ${expValues[index].toFixed(2)}`
        );
    });
    
    // 更新softmax显示
    document.querySelectorAll('.soft-item').forEach((item, index) => {
        setupContentAndTooltip(
            item,
            `softmax(X${index + 1}) = ${softmaxValues[index].toFixed(2)}`,
            `exp(X${index + 1}) / ${expSum.toFixed(2)} = ${softmaxValues[index].toFixed(2)}`
        );
    });
}

function setupContentAndTooltip(element, content, tooltip) {
    element.textContent = content;
    element.setAttribute('data-tooltip', tooltip);
    
    if (element.classList.contains('soft-item')) {
        const value = parseFloat(content.split('=')[1]);
        element.style.background = `linear-gradient(to right, rgba(144, 202, 249, 0.2) ${value * 100}%, transparent ${value * 100}%)`;
    }
}

function setupHighlight() {

    // exp值点击时高亮对应的输入行
    document.querySelectorAll('.exp-item').forEach((element, index) => {
        addEventListenersClickAndMouseover(element, () => {
            clearAllHighlights();
            highlightByIndex('.input-row', index);
        });
    });

    // softmax值点击时高亮对应的exp值
    document.querySelectorAll('.soft-item').forEach((element, index) => {
        addEventListenersClickAndMouseover(element, () => {
            clearAllHighlights();
            highlightByIndex('.exp-item', index);
        });
    });

    addEventListenersClickAndMouseover(document.getElementById('expSum'), () => {
        clearAllHighlights();
        highlightByClass('.exp-item');
    });

    addEventListenersClickAndMouseover(document.getElementById('softSum'), () => {
        clearAllHighlights();
        highlightByClass('.soft-item');
    });
}

function highlightByClass(className) {
    document.querySelectorAll(className).forEach(element => {
        element.classList.add('highlight-all');
    });
}

function highlightByID(id) {
    document.getElementById(id).classList.add('highlight-all');
}

function highlightByIndex(className, index) {
    document.querySelectorAll(className)[index].classList.add('highlight-all');
}

function clearAllHighlights() {
    document.querySelectorAll('.input-row, .exp-item, .soft-item').forEach(element => {
        element.classList.remove('highlight', 'highlight-all');
    });
}

function addEventListenersClickAndMouseover(element, callback) {
    element.addEventListener('click', callback);
    element.addEventListener('mouseover', callback);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    calculateSoftmax();
    setupHighlight();
});