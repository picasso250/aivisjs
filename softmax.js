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
        item.innerHTML = `exp(X<sub>${index + 1}</sub>) = ${expValues[index].toFixed(2)}`;
        item.setAttribute('data-tooltip', `${base}<sup>${inputs[index].toFixed(2)}</sup> = ${expValues[index].toFixed(2)}`);
    });
    
    // 更新softmax显示
    document.querySelectorAll('.soft-item').forEach((item, index) => {
        item.innerHTML = `softmax(X<sub>${index + 1}</sub>) = ${softmaxValues[index].toFixed(2)}`;
        item.setAttribute(
            'data-tooltip', 
            `exp(X<sub>${index + 1}</sub>) / exp_sum = ${expValues[index].toFixed(2)} / ${expSum.toFixed(2)} = ${softmaxValues[index].toFixed(2)}`);
        
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.style.width = `${softmaxValues[index] * 100}%`;
        item.appendChild(progressBar);
    });

    // 更新expSum显示
    document.getElementById('expSum').textContent = `exp_sum = ${expSum.toFixed(2)}`;
    document.getElementById('expSum').setAttribute(
        'data-tooltip', 
        `${arraySumStr(expValues)} = ${expSum.toFixed(2)}`);

    // 更新softSum显示
    document.getElementById('softSum').textContent = `soft_sum = ${arraySum(softmaxValues).toFixed(2)}`;
    document.getElementById('softSum').setAttribute(
        'data-tooltip', 
        `${arraySumStr(softmaxValues)} = ${arraySum(softmaxValues).toFixed(2)}`);
}

function arraySum(array) {
    return array.reduce((a, b) => a + b, 0);
}

function setupHighlight() {

    document.querySelectorAll('.input-row').forEach((element, index) => {
        addEventListenersClickAndMouseover(element, () => {
            clearAllHighlights();
        });
    });

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
            highlight('.exp-sum');
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

function clearAllHighlights() {
    document.querySelectorAll('.input-row, .exp-item, .soft-item, .exp-sum, .soft-sum').forEach(element => {
        element.classList.remove('highlight', 'highlight-all');
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    calculateSoftmax();
    setupHighlight();
});