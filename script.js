const apiUrl = "https://api.mymemory.translated.net/get";

// Расширенный список языков
const languages = {
    "en": "English",
    "ru": "Russian",
    "uz": "Uzbek",
    "tr": "Turkish",
    "de": "German",
    "fr": "French",
    "es": "Spanish",
    "it": "Italian",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean",
    "ar": "Arabic",
    "pt": "Portuguese",
    "hi": "Hindi"
};

document.addEventListener('DOMContentLoaded', () => {
    const inputLang = document.getElementById('inputLang');
    const outputLang = document.getElementById('outputLang');
    
    // Заполнение списков языков
    Object.entries(languages).forEach(([code, name]) => {
        inputLang.innerHTML += `<option value="${code}">${name}</option>`;
        outputLang.innerHTML += `<option value="${code}">${name}</option>`;
    });

    // Настройки по умолчанию
    inputLang.value = "en";
    outputLang.value = "ru";
});

// Функция перевода
document.getElementById('translateBtn').addEventListener('click', async () => {
    const text = document.getElementById('inputText').value.trim();
    const fromLang = document.getElementById('inputLang').value;
    const toLang = document.getElementById('outputLang').value;
    const outputText = document.getElementById('outputText');
    
    if (!text) return;

    outputText.value = "Переводим...";

    try {
        const response = await fetch(`${apiUrl}?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
        const data = await response.json();

        if (data && data.responseData) {
            outputText.value = data.responseData.translatedText;
        } else {
            outputText.value = "Не удалось получить перевод.";
        }
    } catch (error) {
        outputText.value = "Ошибка сети при выполнении запроса.";
    }
});

// Озвучка текста
document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetText = document.getElementById(targetId).value;
        const lang = btn.closest('.translation-box').querySelector('select').value;
        
        if (!targetText) return;

        const utterance = new SpeechSynthesisUtterance(targetText);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
    });
});

// Быстрое копирование результата
document.getElementById('copyBtn').addEventListener('click', () => {
    const outputText = document.getElementById('outputText').value;
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText).then(() => {
        const icon = document.getElementById('copyBtn').querySelector('i');
        icon.className = "fa-solid fa-check";
        setTimeout(() => {
            icon.className = "fa-regular fa-copy";
        }, 1500);
    });
});