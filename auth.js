const USERS_KEY = 'pokeaqua_users';
const SESSION_KEY = 'pokeaqua_session';

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loginUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('cadNome').value;
            const email = document.getElementById('cadEmail').value;
            const senha = document.getElementById('cadSenha').value;
            const senha2 = document.getElementById('cadSenha2').value;

            if (senha !== senha2) {
                alert('As senhas não coincidem.');
                return;
            }

            const users = getUsers();

            if (users.find(u => u.email === email)) {
                alert('Email já cadastrado.');
                return;
            }

            const novo = { nome, email, senha };

            users.push(novo);
            saveUsers(users);

            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;

            const users = getUsers();
            const user = users.find(u => u.email === email && u.senha === senha);

            if (!user) {
                alert('Email ou senha incorretos.');
                return;
            }

            loginUser(user);
            alert(`Bem-vindo, ${user.nome}!`);
            window.location.href = 'index.html';
        });
    }
});
