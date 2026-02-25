// Расширенная база узбекских слов (более 200 слов)
const words = [
    // Базовые
    "salom", "xayr", "rahmat", "iltimos", "uzr", "yaxshi", "yomon", "katta", "kichik",
    // Семья и люди
    "odam", "bola", "qiz", "ona", "ota", "uka", "singil", "aka", "opa", "bobo", "buvi", "oilam", "do'st", "inson",
    // Тело
    "bosh", "ko'z", "quloq", "qo'l", "oyoq", "soch", "yuz",
    // Дом и вещи
    "uy", "eshik", "deraza", "xona", "devor", "tom", "hovli", "kitob", "maktab", "daftar", "qalam", "kompyuter", "telefon",
    // Еда и продукты
    "suv", "choy", "sut", "go'sht", "non", "tuxum", "meva", "piyoz", "sabzi", "kartoshka", "olma", "anor", "uzum", "qovun", "tarvuz",
    // Время
    "kun", "tun", "ertalab", "tush", "kechqurun", "hafta", "oy", "yil", "asr", "yoz", "bahor", "kuz", "qish",
    "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba", "yakshanba",
    // Числа
    "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz", "o'n",
    // Цвета
    "qizil", "qora", "oq", "sariq", "yashil", "ko'k", "jigarrang",
    // Глаголы (Действия)
    "yozmoq", "o'qimoq", "ko'rmoq", "eshitmoq", "bormoq", "kelmoq", "olmoq", "bermoq", "yemoq", "ichmoq", "uxlamoq", "turmoq", "o'tirmoq", "gapirmoq",
    // Природа
    "osmon", "bulut", "quyosh", "yulduz", "yomg'ir", "qor", "shamol", "daryo", "ko'l", "dengiz", "tog'", "o'rmon", "cho'l", "gul", "daraxt", "tabiat",
    // Животные
    "hayvon", "it", "mushuk", "ot", "sigir", "qo'y", "echki", "tovuq", "qush", "baliq", "ilon",
    // Города и места
    "O'zbekiston", "vatan", "Toshkent", "Samarqand", "Buxoro", "Xiva", "Andijon", "Farg'ona", "Namangan", "shahar", "qishloq", "ko'cha", "bozor", "do'kon",
    // Абстрактные понятия
    "tinchlik", "mustaqillik", "do'stlik", "sevgi", "baxt", "shodlik", "qayg'u", "orzu", "kelajak", "ishonch", "mehr", "hurmat", "g'alaba"
];

const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

let currentWord = "";
let startTime = null;
let isTyping = false;
let totalTypedChars = 0;
let correctChars = 0;
let mistakes = 0;
let statsInterval = null;

// Загрузка нового слова
function loadText() {
    currentWord = words[Math.floor(Math.random() * words.length)];

    textDisplay.innerHTML = "";
    
    // Создаем буквы
    currentWord.split('').forEach(char => {
        let span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
    
    // Добавляем невидимый символ для ПРОБЕЛА в конце слова
    let spaceSpan = document.createElement('span');
    spaceSpan.innerHTML = "&nbsp;"; 
    spaceSpan.classList.add('space-char');
    textDisplay.appendChild(spaceSpan);
    
    // Ставим курсор на первую букву
    textDisplay.querySelectorAll('span')[0].classList.add('current');
}

// Обработка ввода
function processTyping() {
    let typedText = textInput.value;
    const characters = textDisplay.querySelectorAll('span'); // Буквы + пробел

    // Запускаем секундомер при первом нажатии
    if (!isTyping && typedText.length > 0) {
        isTyping = true;
        startTime = new Date().getTime();
        statsInterval = setInterval(updateWPM, 1000);
    }

    // ЕСЛИ НАЖАТ ПРОБЕЛ (Конец слова)
    if (typedText.endsWith(' ')) {
        // Если пробел нажат случайно в самом начале - игнорируем
        if (typedText.trim() === '') {
            textInput.value = "";
            return;
        }

        let typedWithoutSpace = typedText.slice(0, -1);
        let currentMistakes = 0;

        // Проверяем ошибки в слове
        for (let i = 0; i < Math.max(typedWithoutSpace.length, currentWord.length); i++) {
            if (typedWithoutSpace[i] !== currentWord[i]) {
                currentMistakes++;
            }
        }

        // Обновляем статистику (считаем слово + 1 нажатие за пробел)
        totalTypedChars += currentWord.length + 1; 
        correctChars += (currentWord.length - currentMistakes) + 1; 
        mistakes += currentMistakes;

        // Переходим к следующему слову
        textInput.value = "";
        loadText();
        updateStatsLive(0, 0); // Обновляем процент точности
        updateWPM();
        return;
    }

    // БЛОКИРОВКА ВВОДА: не даем печатать больше длины слова (заставляем нажать пробел)
    if (typedText.length > currentWord.length) {
        textInput.value = typedText.substring(0, currentWord.length);
        typedText = textInput.value;
    }

    let currentMistakes = 0;

    // Подсветка текущего набора
    characters.forEach((charSpan, index) => {
        // Пропускаем последнюю пустую клетку (пробел) в этой проверке
        if (index === currentWord.length) {
            charSpan.classList.remove('correct', 'incorrect', 'current');
            return;
        }

        let typedChar = typedText[index];

        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect', 'current');
        } else if (typedChar === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect', 'current');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct', 'current');
            currentMistakes++;
        }
    });

    // Управление курсором (подчеркиванием)
    characters.forEach(c => c.classList.remove('current'));
    // Если набрали всё слово — курсор прыгает на пробел в конце
    if (typedText.length <= currentWord.length) {
        characters[typedText.length].classList.add('current');
    }

    updateStatsLive(typedText.length, currentMistakes);
    updateWPM();
}

// Обновление процентов точности (Accuracy)
function updateStatsLive(currentTypedLen, currentMistakes) {
    let totalAttempts = totalTypedChars + currentTypedLen;
    let totalErrors = mistakes + currentMistakes;
    let accuracy = totalAttempts === 0 ? 100 : Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100);
    accuracyElement.innerText = accuracy;
}

// Подсчет WPM (Слов в минуту)
function updateWPM() {
    if (!startTime) return;
    
    const now = new Date().getTime();
    const timeElapsedMinutes = (now - startTime) / 60000; 

    if (timeElapsedMinutes > 0) {
        // 5 правильных символов = 1 слово (международный стандарт)
        let wpm = Math.round((correctChars / 5) / timeElapsedMinutes);
        wpmElement.innerText = wpm > 0 && wpm !== Infinity ? wpm : 0;
    }
}

// Кнопка рестарта
function resetGame() {
    clearInterval(statsInterval);
    startTime = null;
    isTyping = false;
    totalTypedChars = 0;
    correctChars = 0;
    mistakes = 0;
    
    textInput.value = "";
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    
    loadText();
    textInput.focus();
}

textInput.addEventListener('input', processTyping);
restartBtn.addEventListener('click', resetGame);

// Инициализация при загрузке
loadText();