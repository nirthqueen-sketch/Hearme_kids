// review.js - خاص بـ review.html (مراجعة كلماتي)

// ============== الدوال المساعدة (مدمجة هنا) ==============

const STORAGE_KEY = 'userLearnedWords';

// 1. دالة حفظ الكلمة للمراجعة
const saveWordToReview = (word, source) => {
    const wordsJson = localStorage.getItem(STORAGE_KEY);
    const wordsArray = wordsJson ? JSON.parse(wordsJson) : [];


    
    const newWordEntry = {
        word: word,
        source: source, 
        date: new Date().toLocaleDateString('ar-EG'),
        timestamp: Date.now()
    };
    
    if (!wordsArray.some(item => item.word === word)) {
        wordsArray.push(newWordEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wordsArray));
    }
};

// 2. دالة النطق الصوتي (Text-to-Speech)
const speakWord = (text) => {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; 
    window.speechSynthesis.speak(utterance);
};
// =======================================================


document.addEventListener('DOMContentLoaded', () => {
    
    const wordsList = document.getElementById('reviewed-words');
    const clearBtn = document.getElementById('clear-list-btn');
    
    // العناصر الجديدة للبحث
    const searchWordInput = document.getElementById('search-word'); 
    const searchBtn = document.getElementById('search-btn'); 
    
    // دالة مساعدة لجلب جميع الكلمات المحفوظة
    const getSavedWords = () => {
        const wordsJson = localStorage.getItem(STORAGE_KEY);
        // الترتيب حسب الأحدث أولاً
        return wordsJson ? JSON.parse(wordsJson).sort((a, b) => b.timestamp - a.timestamp) : [];
    };

    // دالة تحديث وعرض الكلمات بناءً على مصفوفة مُفلترة
    const renderWordsList = (wordsArray) => {
        wordsList.innerHTML = ''; 

        if (wordsArray.length === 0) {
            wordsList.innerHTML = '<li>لا توجد كلمات محفوظة تطابق ما تبحث عنه.</li>';
            return;
        }
        
        wordsArray.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="word-text">**${item.word}**</span> 
                <span class="source-info">(${item.source})</span> - 
                <span class="date-info">تاريخ: ${item.date}</span>
                <button class="review-play-btn" data-word="${item.word}">🔊 اسمع النطق</button>
            `;
            wordsList.appendChild(listItem);
        });

        // إعادة ربط مستمعي الأحداث لزر النطق لكل عنصر جديد
        document.querySelectorAll('.review-play-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                speakWord(e.target.dataset.word);
            });
        });
    };

    // دالة معالجة البحث والتصفية
    const filterAndDisplayWords = () => {
        const searchQuery = searchWordInput.value.trim().toLowerCase();
        const allWords = getSavedWords();
        
        let wordsToDisplay = allWords;

        if (searchQuery) {
            // تصفية الكلمات: البحث عن الكلمة التي تبدأ أو تحتوي على نص البحث
            wordsToDisplay = allWords.filter(item => 
                item.word.toLowerCase().includes(searchQuery)
            );
        }
        
        renderWordsList(wordsToDisplay);

        // إخفاء/إظهار زر المسح: يظهر فقط عند عرض القائمة الكاملة
        if (searchQuery === '' && allWords.length > 0) {
            clearBtn.style.display = 'inline-block';
        } else {
            clearBtn.style.display = 'none';
        }
    };
    

    const loadInitialWords = () => {
        const allWords = getSavedWords();
        if (allWords.length === 0) {
            wordsList.innerHTML = '<li>لم تقم بتعلم أو نطق أي كلمات بعد! ابدأ اللعب أو الاستماع.</li>';
            clearBtn.style.display = 'none';
        } else {
            renderWordsList(allWords);
            clearBtn.style.display = 'inline-block';
        }
    };


    // 3. ربط الأحداث بـ أزرار البحث والمدخل:
    searchBtn.addEventListener('click', filterAndDisplayWords);
    searchWordInput.addEventListener('input', filterAndDisplayWords);


    // 4. معالج حدث "مسح القائمة"
    clearBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح كل الكلمات المحفوظة؟')) {
            localStorage.removeItem(STORAGE_KEY);
            searchWordInput.value = ''; 
            loadInitialWords(); 
        }
    });

    // تحميل الكلمات عند بدء تشغيل الصفحة
    loadInitialWords();
});

