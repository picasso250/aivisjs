function calculateSoftmax() {
    // 获取所有输入值
    const inputs = Array.from(document.querySelectorAll('.x-input'))
        .map(input => parseFloat(input.value));
    
    const base = parseFloat(document.getElementById('base').value);
    
    // 计算exp值
    const expValues = inputs.map(x => Math.pow(base, x));
    const expSum = arraySum(expValues);
    
    // 计算softmax值
    const softmaxValues = expValues.map(exp => exp / expSum);
    
    // 更新exp显示
    document.querySelectorAll('.exp-item').forEach((item, index) => {
        item.textContent = `exp(X${index + 1}) = ${expValues[index].toFixed(2)}`;
        item.setAttribute('data-tooltip', `exp(${inputs[index].toFixed(2)}) = ${expValues[index].toFixed(2)}`);
    });
    
    // 更新softmax显示
    document.querySelectorAll('.soft-item').forEach((item, index) => {
        item.textContent = `softmax(X${index + 1}) = ${softmaxValues[index].toFixed(2)}`;
        item.setAttribute('data-tooltip', `exp(X${index + 1}) / ${expSum.toFixed(2)} = ${softmaxValues[index].toFixed(2)}`);

        const value = parseFloat(item.textContent.split('=')[1]);
        item.style.background = `linear-gradient(to right, rgba(144, 202, 249, 0.2) ${value * 100}%, transparent ${value * 100}%)`;
    });

    // 更新expSum显示
    document.getElementById('expSum').textContent = `expSum = ${expSum.toFixed(2)}`;
    const expSumStr = expValues.map((e, index) => `${e.toFixed(2)}`).join(' + ');
    document.getElementById('expSum').setAttribute('data-tooltip', `expSum = ${expSumStr}`);

    // 更新softSum显示
    document.getElementById('softSum').textContent = `softSum = ${arraySum(softmaxValues).toFixed(2)}`;
    const softSumStr = softmaxValues.map((s, index) => `${s.toFixed(2)}`).join(' + ');
    document.getElementById('softSum').setAttribute('data-tooltip', `softSum = ${softSumStr}`);
}

function arraySum(array) {
    return array.reduce((a, b) => a + b, 0);
}

function setupHighlight() {

    // exp值点击时高亮对应的输入行
    document.querySelectorAll('.exp-item').forEach((element, index) => {
        addEventListenersClickAndMouseover(element, () => {
            clearAllHighlights();
            highlight('.input-row', index);
        });
    });

    // softmax值点击时高亮对应的exp值
    document.querySelectorAll('.soft-item').forEach((element, index) => {
        addEventListenersClickAndMouseover(element, () => {
            clearAllHighlights();
            highlight('.exp-item', index);
        });
    });

    addEventListenersClickAndMouseover(document.getElementById('expSum'), () => {
        clearAllHighlights();
        highlight('.exp-item');
    });

    addEventListenersClickAndMouseover(document.getElementById('softSum'), () => {
        clearAllHighlights();
        highlight('.soft-item');
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    calculateSoftmax();
    setupHighlight();
});