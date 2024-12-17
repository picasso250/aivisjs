document.addEventListener('DOMContentLoaded', function() {
    var triggers = document.querySelectorAll('[data-tooltip]');

    triggers.forEach(function(trigger) {
        trigger.addEventListener('mouseover', function() {
            var tipContent = trigger.getAttribute('data-tooltip');
            var datatip = document.createElement('div');
            datatip.className = 'tooltip';
            datatip.innerHTML = tipContent;
            trigger.appendChild(datatip);
            datatip.style.display = 'block';
        });

        trigger.addEventListener('mouseout', function() {
            var datatip = trigger.querySelector('.tooltip');
            if (datatip) {
                trigger.removeChild(datatip);
            }
        });
    });
});
