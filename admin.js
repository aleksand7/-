// Admin panel functionality
let allUsers = [];
let currentUserToDelete = null;

// Load users from localStorage
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('learnpro_users')) || [];
    allUsers = users;
    displayUsers(users);
    updateStatistics(users);
}

// Display users in table
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="no-users">
                <div style="font-size: 4rem; margin-bottom: 1rem;">👥</div>
                <h3>Пользователи не найдены</h3>
                <p>На платформе еще нет зарегистрированных пользователей</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = users.map(user => {
        const registrationDate = new Date(user.registeredAt).toLocaleDateString('ru-RU');
        const coursesCount = user.courses ? user.courses.length : 0;
        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        
        return `
            <div class="table-row">
                <div class="user-info">
                    <div class="user-avatar-small">${initials}</div>
                    <div>
                        <strong>${user.firstName} ${user.lastName}</strong>
                        <div style="font-size: 0.8rem; color: var(--gray);">@${user.login}</div>
                    </div>
                </div>
                <div>
                    <div>${user.email}</div>
                    <div style="font-size: 0.8rem; color: var(--gray);">${user.login}</div>
                </div>
                <div class="mobile-hidden">
                    <span class="courses-count">${coursesCount} курсов</span>
                </div>
                <div class="mobile-hidden">${registrationDate}</div>
                <div>
                    <span style="color: var(--success); font-weight: 600;">✅ Активен</span>
                </div>
                <div>
                    <button class="delete-btn" onclick="showDeleteUserModal('${user.email}')">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update statistics
function updateStatistics(users) {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.length;
    
    const totalCourses = users.reduce((sum, user) => sum + (user.courses ? user.courses.length : 0), 0);
    document.getElementById('totalCourses').textContent = totalCourses;
    
    const today = new Date().toDateString();
    const todayRegistrations = users.filter(user => 
        new Date(user.registeredAt).toDateString() === today
    ).length;
    document.getElementById('todayRegistrations').textContent = todayRegistrations;
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        displayUsers(allUsers);
        return;
    }
    
    const filteredUsers = allUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.login.toLowerCase().includes(searchTerm)
    );
    
    displayUsers(filteredUsers);
}

// Show delete user modal
function showDeleteUserModal(userEmail) {
    const user = allUsers.find(u => u.email === userEmail);
    if (!user) return;
    
    currentUserToDelete = user;
    
    const userInfo = document.getElementById('userToDeleteInfo');
    userInfo.innerHTML = `
        <div style="background: var(--light); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div class="user-avatar-small">${user.firstName.charAt(0) + user.lastName.charAt(0)}</div>
                <div>
                    <strong>${user.firstName} ${user.lastName}</strong>
                    <div>${user.email}</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                <div><strong>Логин:</strong> ${user.login}</div>
                <div><strong>Курсов:</strong> ${user.courses ? user.courses.length : 0}</div>
                <div><strong>Дата регистрации:</strong> ${new Date(user.registeredAt).toLocaleDateString('ru-RU')}</div>
            </div>
        </div>
    `;
    
    document.getElementById('deleteUserStatus').innerHTML = '';
    document.getElementById('deleteUserModal').style.display = 'block';
    disableBodyScroll();
}

// Close delete user modal
function closeDeleteUserModal() {
    document.getElementById('deleteUserModal').style.display = 'none';
    currentUserToDelete = null;
    enableBodyScroll();
}

// Confirm user deletion
function confirmDeleteUser() {
    if (!currentUserToDelete) return;
    
    const statusElement = document.getElementById('deleteUserStatus');
    const confirmBtn = document.getElementById('confirmDeleteUserBtn');
    
    // Show loading
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '⏳ Удаляем...';
    
    setTimeout(() => {
        try {
            // Remove user from localStorage
            const users = JSON.parse(localStorage.getItem('learnpro_users')) || [];
            const updatedUsers = users.filter(user => user.email !== currentUserToDelete.email);
            localStorage.setItem('learnpro_users', JSON.stringify(updatedUsers));
            
            // Update UI
            allUsers = updatedUsers;
            displayUsers(updatedUsers);
            updateStatistics(updatedUsers);
            
            // Show success
            statusElement.className = 'status-message status-success';
            statusElement.innerHTML = '✅ Пользователь успешно удален';
            
            // Close modal after delay
            setTimeout(() => {
                closeDeleteUserModal();
            }, 1500);
            
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            statusElement.className = 'status-message status-error';
            statusElement.innerHTML = '❌ Ошибка при удалении пользователя';
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Удалить пользователя';
        }
    }, 1000);
}

// Export users data
function exportUsers() {
    const users = JSON.parse(localStorage.getItem('learnpro_users')) || [];
    
    if (users.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const csvContent = [
        ['Имя', 'Фамилия', 'Email', 'Логин', 'Курсы', 'Дата регистрации'],
        ...users.map(user => [
            user.firstName,
            user.lastName,
            user.email,
            user.login,
            user.courses ? user.courses.join(', ') : '',
            new Date(user.registeredAt).toLocaleDateString('ru-RU')
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `learnpro_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`✅ Экспортировано ${users.length} пользователей`);
}

// Show all users
function showAllUsers() {
    displayUsers(allUsers);
    document.getElementById('searchInput').value = '';
}

// Show recent users (last 7 days)
function showRecentUsers() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentUsers = allUsers.filter(user => 
        new Date(user.registeredAt) > weekAgo
    );
    
    displayUsers(recentUsers);
    document.getElementById('searchInput').value = '';
}

// Refresh users list
function refreshUsers() {
    loadUsers();
    alert('✅ Список пользователей обновлен');
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Scroll management functions (add if not exists)
function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
}

function enableBodyScroll() {
    document.body.style.overflow = '';
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    // Add event listeners for modal closing
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeDeleteUserModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDeleteUserModal();
        }
    });
});