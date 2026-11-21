const authScreen = document.querySelector('#auth-screen');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const authError = document.querySelector('#auth-error');
const authTitle = document.querySelector('#auth-title');
const authSubtitle = document.querySelector('#auth-subtitle');
const authKicker = document.querySelector('#auth-kicker');
const authSwitch = document.querySelector('#auth-switch');
const showRegister = document.querySelector('#show-register');
let isRegisterMode = false;

const testSelectors = {
  authScreen,
  loginForm,
  registerForm,
  loginEmail: loginForm.elements.email,
  loginPassword: loginForm.elements.password,
  loginSubmit: loginForm.querySelector('button[type="submit"]'),
  registerName: registerForm.elements.name,
  registerEmail: registerForm.elements.email,
  registerPassword: registerForm.elements.password,
  registerSubmit: registerForm.querySelector('button[type="submit"]'),
  showRegister,
  authError,
  logout: document.querySelector('#logout'),
  pageTitle: document.querySelector('#page-title'),
  profileEmail: document.querySelector('.profile small'),
};

Object.entries(testSelectors).forEach(([name, element]) => element.setAttribute('data-cy', name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)));

function setMode(registerMode) {
  isRegisterMode = registerMode;
  loginForm.classList.toggle('hidden', registerMode);
  registerForm.classList.toggle('hidden', !registerMode);
  authTitle.textContent = registerMode ? 'Crie sua conta' : 'Boas-vindas de volta';
  authSubtitle.textContent = registerMode ? 'Preencha seus dados para começar.' : 'Entre com seus dados para continuar.';
  authKicker.textContent = registerMode ? 'PRIMEIRO ACESSO' : 'ACESSO À PLATAFORMA';
  authSwitch.innerHTML = registerMode ? 'Já possui uma conta? <button type="button" data-cy="show-login">Entrar</button>' : 'Ainda não possui uma conta? <button type="button" data-cy="show-register">Criar conta</button>';
  authSwitch.querySelector('button').addEventListener('click', () => setMode(!registerMode));
  authError.textContent = '';
}

function showAuthenticated(user, token) {
  sessionStorage.setItem('locapro_token', token);
  sessionStorage.setItem('locapro_user', JSON.stringify(user));
  document.querySelector('.profile strong').textContent = user.name;
  document.querySelector('.profile small').textContent = user.email;
  authScreen.classList.add('hidden');
}

async function authenticate(endpoint, form) {
  authError.textContent = '';
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Aguarde...';
  try {
    const response = await fetch(`/api/auth/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || 'Não foi possível concluir a autenticação.');
    showAuthenticated(payload.user, payload.token);
  } catch (error) {
    authError.textContent = error.message;
  } finally {
    submit.disabled = false;
    submit.textContent = endpoint === 'register' ? 'Criar conta e entrar' : 'Entrar na plataforma';
  }
}

loginForm.addEventListener('submit', (event) => { event.preventDefault(); authenticate('login', loginForm); });
registerForm.addEventListener('submit', (event) => { event.preventDefault(); authenticate('register', registerForm); });
showRegister.addEventListener('click', () => setMode(true));
testSelectors.logout.addEventListener('click', () => { sessionStorage.removeItem('locapro_token'); sessionStorage.removeItem('locapro_user'); loginForm.reset(); registerForm.reset(); authScreen.classList.remove('hidden'); setMode(false); });
const savedUser = sessionStorage.getItem('locapro_user');
const savedToken = sessionStorage.getItem('locapro_token');
if (savedUser && savedToken) showAuthenticated(JSON.parse(savedUser), savedToken);
