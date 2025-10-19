const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// API для регистрации
app.post('/api/send-credentials', (req, res) => {
    try {
        const { firstName, lastName, email, login, password } = req.body;
        
        console.log('📝 Новый пользователь:', { email, login });
        
        // В режиме разработки всегда возвращаем данные в интерфейсе
        res.json({
            success: true,
            message: '✅ Аккаунт успешно создан! Сохраните ваши данные.',
            credentials: {
                login: login,
                password: password,
                email: email
            }
        });
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
});

// Health check endpoint (обязательно для Render)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'LearnPro Platform',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve HTML files for different routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'courses.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/reset-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reset-password.html'));
});

// Fallback for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Обработка ошибок
app.use((error, req, res, next) => {
    console.error('🚨 Server Error:', error);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🎓 LearnPro Platform запущен!
📍 Порт: ${PORT}
🌐 Среда: ${process.env.NODE_ENV || 'development'}
🚀 Готов к работе!
    `);
});

console.log('✅ Server file loaded successfully');
