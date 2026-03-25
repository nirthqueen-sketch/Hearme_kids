// account_switcher.js

document.addEventListener('DOMContentLoaded', () => {

    const studentListContainer = document.getElementById('student-list');
    const parentLoginArea = document.getElementById('parent-login-area');
    const parentLoginForm = document.getElementById('parent-login-form');
    const parentPassInput = document.getElementById('parent-pass-input');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const addStudentBtn = document.getElementById('add-student-btn');

    // ===================================
    // 1. تحميل البيانات
    // ===================================
    const loadData = () => {
        const students = JSON.parse(localStorage.getItem('allStudents'));
        const activeStudentId = localStorage.getItem('activeStudentId');
        const parentAccount = localStorage.getItem('parentAccount');

        if (!parentAccount) {
            studentListContainer.innerHTML =
                '<p style="color:red; font-weight:bold;">لا يوجد حساب ولي أمر مسجل. يرجى البدء من <a href="login.html">صفحة التسجيل</a>.</p>';
            addStudentBtn.textContent = "ابدأ التسجيل";
            return null;
        }

        return {
            students,
            activeStudentId,
            parentAccount: JSON.parse(parentAccount)
        };
    };

    // ===================================
    // 2. عرض قائمة الأبناء
    // ===================================
    const renderStudentList = (students, activeId) => {
        studentListContainer.innerHTML = '';

        if (!students || students.length === 0) {
            studentListContainer.innerHTML =
                '<p style="color:#0077b6;">لم يتم تسجيل أي طالب بعد. اضغط "إضافة طالب جديد".</p>';
            return;
        }

        students.forEach(student => {
            const isActive = student.id === activeId;

            const studentCard = document.createElement('div');
            studentCard.className = `student-card ${isActive ? 'active-student' : ''}`;
            studentCard.style.cssText = `
                padding:15px;
                border-radius:10px;
                margin:10px;
                cursor:pointer;
                border:3px solid ${isActive ? '#E3A656' : '#ccc'};
                background-color:${isActive ? '#fff3e0' : '#fff'};
                box-shadow:0 2px 5px rgba(0,0,0,0.1);
            `;

            studentCard.innerHTML = `
                <h3>${student.name} ${isActive ? '(يلعب الآن)' : ''}</h3>
                <p>العمر: ${student.age} سنة | الكوينز: ${student.coins}</p>
            `;

            studentCard.addEventListener('click', () => handleStudentSwitch(student.id));
            studentListContainer.appendChild(studentCard);
        });
    };

    // ===================================
    // 3. تبديل الطالب
    // ===================================
    const handleStudentSwitch = (studentId) => {
        if (localStorage.getItem('activeStudentId') === studentId) {
            alert('هذا الطالب هو المستخدم النشط بالفعل!');
            return;
        }

        localStorage.setItem('activeStudentId', studentId);
        alert('تم تبديل المستخدم بنجاح.');
        window.location.href = 'main.html';
    };

    // ===================================
    // 4. تسجيل دخول ولي الأمر
    // ===================================
    const handleParentLogin = (e) => {
        e.preventDefault();
        const data = loadData();
        if (!data) return;

        if (parentPassInput.value === data.parentAccount.password) {
            sessionStorage.setItem('isParentActive', 'true');
            alert('تم تسجيل الدخول كولي أمر بنجاح');
            parentLoginArea.classList.add('hidden');
        } else {
            loginErrorMsg.textContent = 'كلمة المرور غير صحيحة';
        }

        parentPassInput.value = '';
    };

    // ===================================
    // 5. تهيئة الصفحة
    // ===================================
    const data = loadData();

    if (data) {
        renderStudentList(data.students, data.activeStudentId);
        parentLoginArea.classList.remove('hidden');
        parentLoginForm.addEventListener('submit', handleParentLogin);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'parentlogin') {
            parentLoginArea.scrollIntoView({ behavior: 'smooth' });
        }
    }
});