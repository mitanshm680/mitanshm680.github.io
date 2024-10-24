document.addEventListener('DOMContentLoaded', function () {
    const typedTextElement = document.getElementById('typed-text');
    const description = "I'm a Data Scientist and Software Engineer skilled in machine learning, artificial intelligence, and building scalable software solutions. I enjoy analyzing data, optimizing algorithms, and driving innovation to deliver impactful results.";
    let index = 0;

    function typeText() {
        if (index < description.length) {
            typedTextElement.textContent += description.charAt(index);
            index++;
            setTimeout(typeText, 20);  // Typing speed remains fast
        }
    }

    typeText();
});
