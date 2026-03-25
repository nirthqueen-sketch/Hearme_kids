// spelling.js - خاص بـ spelling.html (لعبة تهجئة الكلمات)

// ============== الدوال المساعدة (يجب تكرارها في كل ملف) ==============
const correctSound = new Audio('correct.wav');
const wrongSound   = new Audio('wrong.wav');

// 2. دالة النطق الصوتي (Text-to-Speech)
const speakWord = (text) => {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; 
    window.speechSynthesis.speak(utterance);
};

// ===================================================================

// قاعدة كلمات اللعبة
const spellingWords = [
    { word: "تفاحة", hint: "فاكهة حمراء أو خضراء" },
    { word: "مدرسة", hint: "مكان نتعلم فيه" },
    { word: "كمبيوتر", hint: "جهاز ذكي يستخدم للدراسة" },
    { word: "طائرة", hint: "وسيلة نقل تطير في السماء" },
    { word: "منزل", hint: "مكان نعيش فيه" }
];

let currentWord = {}; 
let challengeWordDisplay = document.getElementById('word-challenge');

document.addEventListener('DOMContentLoaded', () => {
    
    // تحديد العناصر من spelling.html باستخدام IDs المصححة
    const playSoundBtn = document.getElementById('play-sound'); 
    const answerInput = document.getElementById('answer');
    const checkButton = document.getElementById('startGame'); // **تم التصحيح هنا**
    const feedbackText = document.getElementById('feedback');
    
    // 1. دالة لبدء جولة جديدة
    const startNewRound = () => {
        const randomIndex = Math.floor(Math.random() * spellingWords.length);
        currentWord = spellingWords[randomIndex];
        
        answerInput.value = ''; 
        feedbackText.textContent = 'استمع إلى الكلمة واكتبها في المربع.';
        challengeWordDisplay.textContent = 'الكلمة الجديدة جاهزة! اضغط استمع.';
    };

    // 2. معالج حدث "اسمع الكلمة"
    if (playSoundBtn) {
        playSoundBtn.addEventListener('click', () => {
            if (currentWord.word) {
                speakWord(currentWord.word); 
            } else {
                startNewRound();
            }
        });
    }

    // 3. معالج حدث "تحقق من الإجابة"
    if (checkButton) {
        checkButton.addEventListener('click', () => {
            const userAnswer = answerInput.value.trim();
            
            if (!userAnswer || !currentWord.word) {
                feedbackText.textContent = 'من فضلك، اكتب الكلمة أولاً واضغط اسمع.';
                return;
            }
            
            const cleanedAnswer = userAnswer.toLowerCase().trim();
            const cleanedCorrectWord = currentWord.word.toLowerCase().trim();

            if (cleanedAnswer === cleanedCorrectWord) {
                correctSound.currentTime = 0;
correctSound.play();

                feedbackText.textContent = `✅ ممتاز! ${currentWord.word} هي الإجابة الصحيحة.`;
                challengeWordDisplay.textContent = `أحسنت! الإجابة الصحيحة هي: ${currentWord.word}`;
                saveWordToReview(currentWord.word, "لعبة تهجئة");
                addCoins(10); // إضافة 10 كوينز عند الإجابة الصحيحة
                
                setTimeout(startNewRound, 2000); 
            } else {
                wrongSound.currentTime = 0;
wrongSound.play();

                feedbackText.textContent = `❌ حاول مرة أخرى. إجابتك خاطئة.`;
                speakWord(currentWord.word);
            }
        });
    }

    // بدء أول جولة عند تحميل الصفحة
    startNewRound();
});
