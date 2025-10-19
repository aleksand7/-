// Проверяем наличие токена в URL
function checkResetToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        // Показываем форму установки нового пароля
        document.getElementById('requestResetSection').style.display = 'none';
        document.getElementById('setNewPasswordSection').style.display = 'block';
        document.getElementById('resetToken').value = token;
    }
}

// Запрос на сброс пароля
document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    const statusElement = document.getElementById('resetStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    if (!email) {
        showStatus(statusElement, 'error', 'Введите email');
        return;
    }
    
    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
    showStatus(statusElement, 'loading', 'Отправляем инструкции на email...');
    
    try {
        const response = await fetch('http://localhost:3001/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatus(statusElement, 'success', '✅ Инструкции отправлены на ваш email. Проверьте почту.');
            this.reset();
        } else {
            showStatus(statusElement, 'error', result.message || 'Ошибка отправки');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showStatus(statusElement, 'error', 'Ошибка подключения к серверу');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить инструкции';
    }
});

// Установка нового пароля
document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const token = document.getElementById('resetToken').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const statusElement = document.getElementById('newPasswordStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    if (!newPassword || !confirmPassword) {
        showStatus(statusElement, 'error', 'Заполните все поля');
        return;
    }
    
    if (newPassword.length < 6) {
        showStatus(statusElement, 'error', 'Пароль должен быть не менее 6 символов');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showStatus(statusElement, 'error', 'Пароли не совпадают');
        return;
    }
    
    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Обновляем...';
    showStatus(statusElement, 'loading', 'Обновляем пароль...');
    
    try {
        const response = await fetch('http://localhost:3001/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatus(statusElement, 'success', '✅ Пароль успешно изменен! Теперь вы можете войти с новым паролем.');
            
            // Перенаправляем на страницу входа через 3 секунды
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            showStatus(statusElement, 'error', result.message || 'Ошибка сброса пароля');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showStatus(statusElement, 'error', 'Ошибка подключения к серверу');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Установить новый пароль';
    }
});

// Вспомогательная функция для показа статуса
function showStatus(element, type, message) {
    element.className = 'status-message';
    element.textContent = message;
    
    if (type === 'success') {
        element.classList.add('status-success');
    } else if (type === 'error') {
        element.classList.add('status-error');
    } else if (type === 'loading') {
        element.classList.add('status-loading');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    checkResetToken();
});