
function calculateLeakyReLU() {
    const inputs = Array.from(document.querySelectorAll('.x-input'))
        .map(input => parseFloat(input.value));
    const slope = parseFloat(document.getElementById('slope').value);

    const results = inputs.map(x => x >= 0 ? x : x * slope);

    // 更新if-item的值
    document.querySelectorAll('.if-item').forEach((item, index) => {
        const value = results[index];
        item.textContent = inputs[index] >= 0 ? `1` : `0.1`;
        item.setAttribute('data-tooltip', `${inputs[index]} ≥ 0 ? 1 : 0.1`);
        addEventListenersClickAndMouseover(item, () => {
            clearAllHighlights();
            highlight('.input-row', index);
        });
    });

    document.querySelectorAll('.result-item').forEach((item, index) => {
        const value = results[index];
        item.textContent = `LeakyReLU(X${index + 1}) = ${value.toFixed(3)}`;

        // 为正值和负值设置不同的提示信息
        const tooltip = inputs[index] >= 0
            ? `x ≥ 0: ${inputs[index]} → ${value.toFixed(3)}`
            : `x < 0: ${inputs[index]} × ${slope} = ${value.toFixed(3)}`;
        item.setAttribute('data-tooltip', tooltip);

        addEventListenersClickAndMouseover(item, () => {
            clearAllHighlights();
            highlight('.input-row', index);
            highlight('.if-item', index);
        });
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', calculateLeakyReLU);