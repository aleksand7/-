// Автоматическое определение URL сервера
function getServerBaseUrl() {
    // Если на хостинге, используем тот же домен
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return window.location.origin;
    }
    // Для локальной разработки
    return 'http://localhost:3001';
}

// Обновленная функция отправки данных
async function sendCredentialsEmail(userData) {
    const statusElement = document.getElementById('registerStatus');
    const serverUrl = getServerBaseUrl();
    
    try {
        showLoading(statusElement, '📧 Создаем ваш аккаунт...');
        
        const response = await fetch(`${serverUrl}/api/send-credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        
        if (result.success) {
            if (result.credentials) {
                // Показываем данные в интерфейсе
                showSuccess(statusElement, '✅ Аккаунт создан! Сохраните данные ниже.');
                return { 
                    success: true, 
                    message: 'show_in_modal',
                    credentials: result.credentials
                };
            } else {
                showSuccess(statusElement, '✅ Аккаунт создан! Данные отправлены на вашу почту.');
                return { success: true, message: 'sent_to_email' };
            }
        } else {
            showError(statusElement, '❌ ' + (result.message || 'Ошибка создания аккаунта'));
            return { success: false, message: result.message };
        }
        
    } catch (error) {
        console.error('❌ Ошибка подключения:', error);
        showError(statusElement, '❌ Ошибка подключения к серверу');
        return { 
            success: false, 
            message: 'Ошибка подключения к серверу' 
        };
    }
}
// Основные функции работы с пользователями
function getUsers() {
    return JSON.parse(localStorage.getItem('learnpro_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('learnpro_users', JSON.stringify(users));
}

function generateLogin(firstName, lastName) {
    const namePart = firstName.toLowerCase().slice(0, 3);
    const randomNum = Math.floor(Math.random() * 1000);
    return `${namePart}${lastName.toLowerCase().slice(0, 2)}${randomNum}`;
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function sendCredentialsEmail(userData) {
    const statusElement = document.getElementById('registerStatus');
    
    try {
        showLoading(statusElement, '📧 Отправляем данные на вашу почту...');
        
        const response = await fetch('http://localhost:3001/api/send-credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        
        if (result.success) {
            showSuccess(statusElement, '✅ Аккаунт создан! Данные отправлены на вашу почту.');
            console.log('✅ Email отправлен:', result);
            return { success: true, message: '✅ Данные отправлены на почту!' };
        } else {
            showError(statusElement, '⚠️ Аккаунт создан, но ошибка отправки email.');
            console.warn('⚠️ Ошибка отправки email:', result);
            return { success: false, message: 'Аккаунт создан, но email не отправлен.' };
        }
    } catch (error) {
        console.error('❌ Ошибка подключения к серверу:', error);
        showError(statusElement, '⚠️ Проблемы с подключением, но аккаунт создан.');
        return { 
            success: false, 
            message: 'Проблемы с подключением, но аккаунт создан.' 
        };
    }
}
// Добавьте эти функции в script.js (если их там нет)

// Функции для работы с пользователями (должны быть в script.js)
function getUsers() {
    return JSON.parse(localStorage.getItem('learnpro_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('learnpro_users', JSON.stringify(users));
}

// Функции управления модальными окнами (должны быть в script.js)
function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
}

function enableBodyScroll() {
    document.body.style.overflow = '';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    enableBodyScroll();
}
// Управление модальными окнами
let isModalOpen = false;

function disableBodyScroll() {
    if (isModalOpen) return;
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    isModalOpen = true;
}

function enableBodyScroll() {
    if (!isModalOpen) return;
    const scrollY = document.body.dataset.scrollY;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, parseInt(scrollY || '0'));
    isModalOpen = false;
}

function showRegisterModal() {
    closeAllModals();
    disableBodyScroll();
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerForm').reset();
    document.getElementById('registerStatus').innerHTML = '';
    enableBodyScroll();
}

function showLoginModal() {
    closeAllModals();
    disableBodyScroll();
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('loginStatus').innerHTML = '';
    enableBodyScroll();
}

function showCredentialsModal(login, password, email, emailResult) {
    closeAllModals();
    disableBodyScroll();
    
    document.getElementById('displayLogin').textContent = login;
    document.getElementById('displayPassword').textContent = password;
    document.getElementById('displayEmail').textContent = email;
    
    const statusElement = document.getElementById('credentialsStatus');
    statusElement.className = 'status-message status-success';
    statusElement.innerHTML = '✅ Аккаунт успешно создан! Сохраните данные ниже.';
    
    document.getElementById('credentialsModal').style.display = 'block';
}

function closeCredentialsModal() {
    document.getElementById('credentialsModal').style.display = 'none';
    enableBodyScroll();
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    enableBodyScroll();
}

// Вспомогательные функции
function showError(element, message) {
    element.className = 'status-message status-error';
    element.innerHTML = message;
}

function showSuccess(element, message) {
    element.className = 'status-message status-success';
    element.innerHTML = message;
}

function showLoading(element, message) {
    element.className = 'status-message status-loading';
    element.innerHTML = message;
}

// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const statusElement = document.getElementById('registerStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Валидация
    if (!firstName || !lastName || !email) {
        showError(statusElement, '❌ Заполните все поля');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(statusElement, '❌ Введите корректный email');
        return;
    }
    
    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Создаем аккаунт...';
    showLoading(statusElement, '⏳ Создаем ваш аккаунт...');
    
    try {
        // Генерируем логин и пароль
        const login = generateLogin(firstName, lastName);
        const password = generatePassword();
        
        // Создаем объект пользователя
        const userData = {
            firstName,
            lastName,
            email,
            login,
            password,
            registeredAt: new Date().toISOString(),
            courses: ['fullstack', 'mobile'], // Добавляем тестовые курсы
            emailSent: false
        };
        
        // Сохраняем пользователя
        const users = getUsers();
        
        // Проверяем, нет ли уже пользователя с таким email
        if (users.find(u => u.email === email)) {
            showError(statusElement, '❌ Пользователь с таким email уже существует');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Создать аккаунт';
            return;
        }
        
        users.push(userData);
        saveUsers(users);
        
        // "Отправляем" email
        const emailResult = await sendCredentialsEmail(userData);
        
        showSuccess(statusElement, '✅ Аккаунт создан! Открываем данные для входа...');
        
        // Показываем модальное окно с данными
        setTimeout(() => {
            closeRegisterModal();
            showCredentialsModal(login, password, email, emailResult);
        }, 1500);
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showError(statusElement, '❌ Ошибка при создании аккаунта');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Создать аккаунт';
    }
});

// Обработка формы входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const statusElement = document.getElementById('loginStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        showSuccess(statusElement, '✅ Вход выполнен! Перенаправляем...');
        
        // Сохраняем текущего пользователя
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Перенаправление в личный кабинет
        setTimeout(() => {
            closeLoginModal();
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showError(statusElement, '❌ Неверный email или пароль');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
    }
});

// Обработчики закрытия модальных окон
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeAllModals();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAllModals();
    }
});

document.querySelectorAll('.modal-content').forEach(modalContent => {
    modalContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Плавный скролл для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Эффект при скролле для хедера
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LearnPro инициализирован');
    
    // Обработчики для кнопок выбора курса
    document.querySelectorAll('.course-btn').forEach(button => {
        button.addEventListener('click', function() {
            showRegisterModal();
        });
    });
    
    // Обработчик для CTA кнопки
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            showRegisterModal();
        });
    }
});