// Проверка авторизации
function checkAuth() {
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(userData);
}

// Загрузка данных пользователя
function loadUserData() {
    const user = checkAuth();
    if (!user) return;

    // Заполняем данные в интерфейсе
    document.getElementById('userAvatar').textContent = 
        user.firstName.charAt(0) + user.lastName.charAt(0);
    document.getElementById('welcomeTitle').textContent = 
        `Добро пожаловать, ${user.firstName}!`;
    document.getElementById('userEmail').textContent = user.email;
    
    document.getElementById('profileName').textContent = 
        `${user.firstName} ${user.lastName}`;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileLogin').textContent = user.login;
    document.getElementById('profileDate').textContent = 
        new Date(user.registeredAt).toLocaleDateString('ru-RU');

    // Загружаем курсы пользователя
    loadUserCourses(user);
}

// Загрузка курсов пользователя
function loadUserCourses(user) {
    const container = document.getElementById('userCoursesContainer');
    
    if (!user.courses || user.courses.length === 0) {
        container.innerHTML = `
            <div class="empty-courses-state">
                <div class="empty-icon">📚</div>
                <h3>У вас пока нет курсов</h3>
                <p>Выберите курсы из каталога чтобы начать обучение</p>
                <a href="courses.html" class="browse-courses-btn">Перейти к каталогу</a>
            </div>
        `;
        return;
    }

    // Получаем данные о курсах
    const userCourseData = getUserCourseData(user.courses);
    
    container.innerHTML = `
        <div class="user-courses-grid">
            ${userCourseData.map(course => createCourseCard(course)).join('')}
        </div>
    `;
}

// Получаем данные о курсах пользователя
function getUserCourseData(courseIds) {
    const coursesData = {
        'fullstack': {
            id: 'fullstack',
            title: 'Fullstack-разработка',
            icon: '💻',
            description: 'JavaScript, React, Node.js, MongoDB',
            progress: 30,
            lessonsTotal: 120,
            lessonsCompleted: 36,
            nextLesson: 'React Components',
            lastActivity: '2 часа назад'
        },
        'mobile': {
            id: 'mobile',
            title: 'Мобильная разработка',
            icon: '📱',
            description: 'React Native, iOS & Android',
            progress: 15,
            lessonsTotal: 100,
            lessonsCompleted: 15,
            nextLesson: 'Настройка окружения',
            lastActivity: 'вчера'
        },
        'design': {
            id: 'design',
            title: 'UI/UX Дизайн',
            icon: '🎨',
            description: 'Figma, Adobe XD, Прототипирование',
            progress: 0,
            lessonsTotal: 80,
            lessonsCompleted: 0,
            nextLesson: 'Введение в дизайн',
            lastActivity: 'еще не начат'
        },
        'python': {
            id: 'python',
            title: 'Python & Data Science',
            icon: '🐍',
            description: 'Анализ данных и машинное обучение',
            progress: 0,
            lessonsTotal: 140,
            lessonsCompleted: 0,
            nextLesson: 'Основы Python',
            lastActivity: 'еще не начат'
        },
        'java': {
            id: 'java',
            title: 'Java разработка',
            icon: '☕',
            description: 'Enterprise разработка на Java',
            progress: 0,
            lessonsTotal: 110,
            lessonsCompleted: 0,
            nextLesson: 'Java Core',
            lastActivity: 'еще не начат'
        }
    };

    return courseIds.map(courseId => coursesData[courseId] || {
        id: courseId,
        title: courseId,
        icon: '📚',
        description: 'Курс в разработке',
        progress: 0,
        lessonsTotal: 0,
        lessonsCompleted: 0,
        nextLesson: 'Скоро',
        lastActivity: 'ожидается'
    });
}

// Создание карточки курса
function createCourseCard(course) {
    const progressWidth = course.progress > 0 ? course.progress : 0;
    
    return `
        <div class="user-course-card" data-course-id="${course.id}">
            <div class="course-card-header">
                <div class="course-icon">${course.icon}</div>
                <div class="course-status ${course.progress > 0 ? 'active' : 'not-started'}">
                    ${course.progress > 0 ? 'В процессе' : 'Не начат'}
                </div>
            </div>
            
            <div class="course-card-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                
                <div class="course-progress">
                    <div class="progress-info">
                        <span>Прогресс:</span>
                        <span class="progress-percent">${course.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressWidth}%"></div>
                    </div>
                    <div class="progress-stats">
                        <span>${course.lessonsCompleted}/${course.lessonsTotal} уроков</span>
                    </div>
                </div>
                
                <div class="course-next-lesson">
                    <strong>Следующий урок:</strong> ${course.nextLesson}
                </div>
                
                <div class="course-last-activity">
                    Последняя активность: ${course.lastActivity}
                </div>
            </div>
            
            <div class="course-card-actions">
                ${course.progress > 0 ? `
                    <button class="continue-btn" onclick="continueCourse('${course.id}')">
                        🎯 Продолжить
                    </button>
                ` : `
                    <button class="start-btn" onclick="startCourse('${course.id}')">
                        🚀 Начать обучение
                    </button>
                `}
                <button class="course-details-btn" onclick="showCourseDetails('${course.id}')">
                    ℹ️ Подробнее
                </button>
            </div>
        </div>
    `;
}

// Функции для кнопок курсов
function continueCourse(courseId) {
    alert(`Продолжаем курс "${courseId}"! 🎯`);
}

function startCourse(courseId) {
    alert(`Начинаем курс "${courseId}"! 🚀`);
}

function showCourseDetails(courseId) {
    alert(`Подробности курса "${courseId}" ℹ️`);
}

// Выход из системы
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
});
// Добавьте эти функции в dashboard.js

// Показать модальное окно удаления аккаунта
function showDeleteAccountModal() {
    const user = checkAuth();
    if (!user) return;
    
    // Сбрасываем форму
    document.getElementById('confirmEmail').value = '';
    document.getElementById('confirmDeleteBtn').disabled = true;
    document.getElementById('deleteStatus').innerHTML = '';
    
    // Добавляем обработчик для проверки email
    document.getElementById('confirmEmail').addEventListener('input', validateDeleteEmail);
    
    document.getElementById('deleteAccountModal').style.display = 'block';
    disableBodyScroll();
}

// Закрыть модальное окно удаления аккаунта
function closeDeleteAccountModal() {
    document.getElementById('deleteAccountModal').style.display = 'none';
    enableBodyScroll();
}

// Валидация email при удалении
function validateDeleteEmail() {
    const user = checkAuth();
    const confirmEmail = document.getElementById('confirmEmail').value.trim();
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const input = document.getElementById('confirmEmail');
    
    if (confirmEmail === user.email) {
        confirmBtn.disabled = false;
        input.classList.remove('error');
    } else {
        confirmBtn.disabled = true;
        if (confirmEmail && confirmEmail !== user.email) {
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    }
}
// Добавьте эти функции в dashboard.js (если их там нет)
function getUsers() {
    return JSON.parse(localStorage.getItem('learnpro_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('learnpro_users', JSON.stringify(users));
}

// Удаление аккаунта
function deleteAccount() {
    const user = checkAuth();
    const confirmEmail = document.getElementById('confirmEmail').value.trim();
    const statusElement = document.getElementById('deleteStatus');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // Временные функции (добавьте их)
    const getUsers = () => JSON.parse(localStorage.getItem('learnpro_users')) || [];
    const saveUsers = (users) => localStorage.setItem('learnpro_users', JSON.stringify(users));
    
    if (confirmEmail !== user.email) {
        showDeleteError(statusElement, 'Email не совпадает');
        document.getElementById('confirmEmail').classList.add('shake');
        setTimeout(() => {
            document.getElementById('confirmEmail').classList.remove('shake');
        }, 500);
        return;
    }
    // Показываем загрузку
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '⏳ Удаляем...';
    
    // Имитация задержки для подтверждения
    setTimeout(() => {
        try {
            // Получаем всех пользователей
            const users = getUsers();
            
            // Находим индекс текущего пользователя
            const userIndex = users.findIndex(u => u.email === user.email);
            
            if (userIndex !== -1) {
                // Удаляем пользователя из массива
                users.splice(userIndex, 1);
                
                // Сохраняем обновленный массив
                saveUsers(users);
                
                // Удаляем из sessionStorage
                sessionStorage.removeItem('currentUser');
                
                showDeleteSuccess(statusElement, '✅ Аккаунт успешно удален');
                
                // Перенаправляем на главную страницу
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error('Пользователь не найден');
            }
            
        } catch (error) {
            console.error('Ошибка удаления аккаунта:', error);
            showDeleteError(statusElement, '❌ Ошибка при удалении аккаунта');
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Удалить аккаунт';
        }
    }, 1500);
}
// Вспомогательные функции для сообщений
function showDeleteError(element, message) {
    element.className = 'status-message status-error';
    element.innerHTML = message;
}

function showDeleteSuccess(element, message) {
    element.className = 'status-message status-success';
    element.innerHTML = message;
}

// Добавьте эти функции управления прокруткой (если их нет)
function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
}

function enableBodyScroll() {
    const scrollY = document.body.dataset.scrollY;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, parseInt(scrollY || '0'));
}

// Обновите функцию closeAllModals (добавьте удаление аккаунта)
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    enableBodyScroll();
}

// Добавьте обработчики закрытия для модального окна удаления
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик клика по фону
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Обработчик Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Предотвращение закрытия при клике на контент
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});