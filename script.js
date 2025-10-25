import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut, deleteUser }
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc }
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setLogLevel }
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Habilita logs de debug do
// Firestore
setLogLevel('Debug'); //

// --- VARIÁVEIS GLOBAIS (Obrigatórias) ---

// Importe as funções que você precisa dos SDKs que você precisa
import { initializeApp } from "firebase/app";
// TODO: Adicionar SDKs para produtos Firebase que você deseja usar
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuração do Firebase do aplicativo na web
/*const firebaseConfig = {
    apiKey: "AIzaSyAH22ZeSzEFrTEF5LbvKq1_9gLixgMIkD0",
    authDomain: "iesporte-movimento-inteligente.firebaseapp.com",
    projectId: "iesporte-movimento-inteligente",
    storageBucket: "iesporte-movimento-inteligente.firebasestorage.app",
    messagingSenderId: "502338413071",
    appId: "1:502338413071:web:094e55b0b3b08a8ff7f97a"
};*/

import { DatabaseFacade } from "./databaseFacade.js";

const usuarios = await DatabaseFacade.listarUsuarios();
console.log("Usuários cadastrados:", usuarios);


// Initialize Firebase

//const appId = "1:502338413071:web:094e55b0b3b08a8ff7f97a".appId.split(':')[2] || 'default-app-id';
//const firebaseConfig = Object.keys("1:502338413071:web:094e55b0b3b08a8ff7f97a").length > 0 ? REAL_FIREBASE_CONFIG : JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
//const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

//const app = initializeApp(firebaseConfig);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
//const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- INICIALIZAÇÃO FIREBASE ---

let app, auth, db;
let currentUserId = null;
let firebaseInitialized = false;
let isLoggingOut = false; // NOVO: VARIÁVEL DE CONTROLE DE LOGOUT

try {
    if (Object.keys(firebaseConfig).length > 0) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        firebaseInitialized = true;
    } else {
        console.error("Erro: Configuração do Firebase não encontrada. Rodando em modo de simulação.");
    }
} catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
}

// --- ELEMENTOS DOM PRINCIPAIS ---
const loadingIndicator = document.getElementById('loading-indicator');

const authView = document.getElementById('auth-view');

const mainContent = document.getElementById('main-content');

const authMessage = document.getElementById('auth-message');

const userDisplay = document.getElementById('user-display');
// --- ESTADO DA UI ---
let isInitialized = false;
const showMessage = (msg, isError = true) => {
    authMessage.textContent = msg;
    authMessage.classList.remove('hidden');
    authMessage.classList.toggle('text-red-500', isError);
    authMessage.classList.toggle('text-green-500', !isError);
};
/**
 * Alterna entre a visão de Login (Auth) e a Dashboard (Main Content).
 * @param {boolean} isLoggedIn - Indica se o usuário está autenticado.
 * @param {object} [user=null] - Objeto do usuário autenticado.
 */
const toggleMainView = (isLoggedIn, user = null) => {
    if (isLoggedIn) {
        authView.classList.add('hidden');
        mainContent.classList.remove('hidden');
        currentUserId = user.uid;
        userDisplay.textContent = user.uid.substring(0, 8);

        if (!isInitialized) {
            renderOverviewChart();
            renderMarketChart();
            renderExerciseFilters();
            renderExerciseGrid();
            isInitialized = true;
        }
    } else {
        mainContent.classList.add('hidden');
        authView.classList.remove('hidden');
        currentUserId = null;
        authMessage.textContent = '';

        // NOVO: Limpa campos de formulário para segurança
        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();
    }
    loadingIndicator.classList.add('hidden');
};
// --- AUTENTICAÇÃO FIREBASE ---
if (firebaseInitialized) {
    // 1. Tenta autenticar via Custom Token ou Anonimamente
    onAuthStateChanged(auth, async(user) => {
        if (user) {
            // Usuário autenticado
            toggleMainView(true, user);
        } else {
            // Usuário deslogado
            if (isLoggingOut) {
                // Se o logout foi manual, não tenta autenticar novamente.
                isLoggingOut = false;
                toggleMainView(false); // Mostra a tela de login vazia.
                return;
            }

            // 2. Se não estiver logado, tenta o token inicial ou login anônimo (comportamento padrão)
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                } catch (error) {
                    console.error("Erro ao fazer login com token customizado:", error);
                    try {
                        await signInAnonymously(auth);
                    } catch (anonError) {
                        console.error("Erro ao fazer login anonimamente:", anonError);
                        toggleMainView(false);
                    }
                }
            } else {
                // Tenta login anônimo (padrão do ambiente)
                try {
                    await signInAnonymously(auth);
                } catch (anonError) {
                    console.error("Erro ao fazer login anonimamente:", anonError);
                    toggleMainView(false);
                }
            }
        }
    });
} else {
    // NOVO: FALLBACK IMEDIATO
    console.warn("Firebase não foi configurado. Exibindo tela de login no modo de simulação.");
    toggleMainView(false);
}
// Função Simulada de Login (usando Anonymous Auth como fallback)
document.getElementById('login-form').addEventListener('submit', async(e) => {
    e.preventDefault();
    // Em um ambiente real, usaria signInWithEmailAndPassword.
    // Aqui, simulamos o login anônimo ou persistimos no estado se a UI for exibida.
    showMessage("A autenticação via Email/Senha está simulada. Entrando anonimamente...", false);
    try {
        // APENAS TENTA O LOGIN ANÔNIMO SE O FIREBASE INICIALIZOU
        if (firebaseInitialized) {
            await signInAnonymously(auth);
        } else {
            // Simulação de login bem-sucedido para testes locais
            toggleMainView(true, { uid: 'simulated-user-id' });
        }
    } catch (error) {
        showMessage("Erro ao tentar login. Tente novamente.", true);
    }
});
// Função Simulada de Cadastro (usando Anonymous Auth + Firestore para simular dados)
document.getElementById('signup-form').addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const acceptedTerms = document.getElementById('aceite-termos-signup').checked;
    if (!acceptedTerms) {
        showMessage("Você deve aceitar os Termos de Uso para criar uma conta.", true);
        return;
    }
    if (password.length < 6) {
        showMessage("A senha deve ter no mínimo 6 caracteres.", true);
        return;
    }
    showMessage("Processando cadastro e login anônimo...", false);
    try {
        if (firebaseInitialized) {
            // 1. Simula o cadastro e login via método anônimo
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;
            // 2. Salva o aceite dos termos no Firestore (simulação de dados de usuário)
            const userDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}/user_data/profile`);
            await setDoc(userDocRef, {
                email: email, // Armazena o email fornecido (simulado)
                termsAccepted: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            });
            showMessage("Conta criada e Termos aceitos. Redirecionando...", false);
            // onAuthStateChanged cuidará da transição da view
        } else {
            // Simulação de cadastro e login bem-sucedido para testes locais
            showMessage("Conta criada em modo de simulação. Redirecionando...", false);
            toggleMainView(true, { uid: 'simulated-user-id' });
        }
    } catch (error) {
        showMessage(`Erro ao criar conta: ${error.message}.`, true);
    }
});
// Função de Logout (Corrigida)
document.getElementById('sign-out-btn').addEventListener('click', async() => {
    isLoggingOut = true; // Define o estado de logout manual
    try {
        if (firebaseInitialized) {
            await signOut(auth);
        }
        showMessage("Você saiu da conta.", false);
        toggleMainView(false); // Garante a volta à tela de login e limpeza dos campos
    } catch (error) {
        console.error("Erro ao sair:", error);
        toggleMainView(false); // Garante a exibição da tela de login mesmo em caso de erro
    } finally {
        // O estado isLoggingOut será resetado dentro do onAuthStateChanged.
    }
});
// Função de Excluir Conta (Required)
const deleteAccountBtn = document.getElementById('delete-account-btn');
deleteAccountBtn.addEventListener('click', (e) => openModal(e, 'delete'));

const handleDeleteAccount = async() => {
    isLoggingOut = true; // Também impede login automático após exclusão
    if (firebaseInitialized) {
        // CÓDIGO DE EXCLUSÃO REAL
        const user = auth.currentUser;
        if (!user) {
            console.error("Nenhum usuário logado para excluir.");
            return;
        }
        try {
            // 1. Exclui a coleção de dados do usuário (opcional, dependendo das regras de segurança)
            const userDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}/user_data/profile`);
            await deleteDoc(userDocRef);
            console.log(`Dados do usuário ${user.uid} excluídos (simulação).`);
            // 2. Exclui a conta do usuário
            await deleteUser(user);
            showMessage("Conta excluída permanentemente. Você foi desconectado.", false);
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                showMessage("Por favor, saia e entre novamente antes de excluir sua conta.", true);
            } else {
                showMessage(`Erro ao excluir conta: ${error.message}.`, true);
            }
        }
    } else {
        // SIMULAÇÃO DE EXCLUSÃO
        showMessage("Conta excluída em modo de simulação. Você foi desconectado.", false);
    }
    // Garante que o modal feche e a tela de login apareça
    closeModal();
    toggleMainView(false);
};
// --- NAVEGAÇÃO E GRÁFICOS (Chart.js) ---
// Funções de Toggle (Login/Signup)
document.getElementById('show-login-btn').addEventListener('click', () => {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('show-login-btn').classList.add('active-tab', 'border-[#6B8E23]', 'text-gray-700');
    document.getElementById('show-login-btn').classList.remove('border-transparent', 'text-gray-500');
    document.getElementById('show-signup-btn').classList.remove('active-tab', 'border-[#6B8E23]', 'text-gray-700');
    document.getElementById('show-signup-btn').classList.add('border-transparent', 'text-gray-500');
    authMessage.classList.add('hidden');
});

document.getElementById('show-signup-btn').addEventListener('click', () => {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('show-signup-btn').classList.add('active-tab', 'border-[#6B8E23]', 'text-gray-700');
    document.getElementById('show-signup-btn').classList.remove('border-transparent', 'text-gray-500');
    document.getElementById('show-login-btn').classList.remove('active-tab', 'border-[#6B8E23]', 'text-gray-700');
    document.getElementById('show-login-btn').classList.add('border-transparent', 'text-gray-500');
    authMessage.classList.add('hidden');
});
// Scroll Suave para navegação interna
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Adiciona classe 'active' ao link clicado e remove dos outros
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });
});

// Funções de Gráfico (Chart.js)
const chartColors = {
    primary: '#6B8E23', // Verde Oliva
    secondary: '#4A7C59', // Verde Floresta
    tertiary: '#A3B18A', // Verde Claro
    gray: '#3D3B3A', // Cinza Carvão
    red: '#B22222', // Vermelho Forte
};
// Gráfico de Visão Geral (Donut/Doughnut Chart)
const renderOverviewChart = () => {
    const ctx = document.getElementById('overviewChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Análise Clínica', 'Educação e Engajamento', 'Posicionamento Estratégico'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.tertiary,
                ],
                hoverOffset: 10,
                borderWidth: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            weight: '500',
                        },
                        color: chartColors.gray,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            },
        },
    });
};
// Gráfico de Mercado (Bar Chart)
const renderMarketChart = () => {
    const ctx = document.getElementById('marketChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Eficiência Técnica', 'Eficácia Clínica'],
            datasets: [{
                    label: 'IEsporte',
                    data: [95, 90],
                    backgroundColor: chartColors.primary,
                },
                {
                    label: 'Concorrente A (Geral)',
                    data: [70, 50],
                    backgroundColor: chartColors.gray,
                },
                {
                    label: 'Concorrente B (Nicho)',
                    data: [80, 75],
                    backgroundColor: chartColors.secondary,
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Pontuação (%)',
                        color: chartColors.gray,
                    },
                    ticks: {
                        color: chartColors.gray,
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: chartColors.gray,
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                        },
                        color: chartColors.gray,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + '%';
                            }
                            return label;
                        }
                    }
                }
            },
        },
    });
};
// --- MÓDULO INTERATIVO DE EXERCÍCIOS ---
const exercisesData = [{
        id: 1,
        name: 'Elevação Pélvica',
        category: 'Força',
        focus: 'Glúteos, Lombares',
        duration: '3x 12 repetições',
        difficulty: 'Fácil',
        description: 'Deite-se de barriga para cima, joelhos dobrados, pés no chão. Levante o quadril até que o corpo forme uma linha reta dos ombros aos joelhos. Mantenha 2 segundos e desça lentamente.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224869/elevacao-pelvica-de-quadril_a7ynpp.webp',
    },
    {
        id: 2,
        name: 'Agachamento Unilateral',
        category: 'Estabilidade',
        focus: 'Quadríceps, Equilíbrio',
        duration: '3x 8 repetições (cada perna)',
        difficulty: 'Médio',
        description: 'Fique em uma perna, mantendo o abdômen contraído. Dobre o joelho de apoio como se fosse sentar em uma cadeira. Mantenha o joelho alinhado com o pé. Retorne à posição inicial.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224869/agachamento-unilateral-e-pistol-squat_d4ac7f.webp',
    },
    {
        id: 3,
        name: 'Prancha Lateral',
        category: 'Core',
        focus: 'Oblíquos, Estabilizadores',
        duration: '3x 30 segundos (cada lado)',
        difficulty: 'Médio',
        description: 'Apoie-se no antebraço e na lateral do pé. Levante o quadril do chão, formando uma linha reta da cabeça aos pés. Mantenha a posição.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224869/Pancha_Lateral_ua1kae.png',
    },
    {
        id: 4,
        name: 'Alongamento de Isquiotibiais',
        category: 'Flexibilidade',
        focus: 'Parte posterior da coxa',
        duration: '2x 30 segundos',
        difficulty: 'Fácil',
        description: 'Sente-se no chão com uma perna esticada e a outra dobrada. Incline o tronco para a frente em direção ao pé da perna esticada, mantendo as costas retas. Troque de lado.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224869/alongamento_isquiotibias_gnp7vu.jpg',
    },
    // NOVOS EXERCÍCIOS DE MOBILIDADE E POSTURA
    {
        id: 5,
        name: 'Mobilidade de Punhos',
        category: 'Mobilidade',
        focus: 'Punhos',
        duration: '30 segundos',
        difficulty: 'Fácil',
        description: 'Gire os punhos para um lado e para o outro com as mãos entrelaçadas ou com os braços esticados. Movimento suave e controlado.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224870/Mobilidade_Punhos_jtt5t3.png',
    },
    {
        id: 6,
        name: 'Círculos de Ombros',
        category: 'Mobilidade',
        focus: 'Ombros, Postura',
        duration: '10 repetições (para frente e para trás)',
        difficulty: 'Fácil',
        description: 'Faça círculos amplos com os ombros, primeiro para trás e depois para frente. Ajuda a aliviar a tensão na parte superior das costas.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224869/C%C3%ADrculo_de_Ombros_wqbkmb.avif',
    },
    {
        id: 7,
        name: 'Rotação de Tronco Sentado',
        category: 'Mobilidade',
        focus: 'Tronco, Coluna',
        duration: '3x 5 repetições (cada lado)',
        difficulty: 'Fácil',
        description: 'Sentado com a coluna ereta, rotacione suavemente o tronco para um lado, usando as mãos como apoio. Mantenha os quadris fixos.',
        image: 'https://res.cloudinary.com/dzxbhjdkj/image/upload/v1761224870/Rota%C3%A7%C3%A3o_de_Tronco_Sentado_rzl0vb.png',
    }
];

// Renderiza os botões de filtro
const renderExerciseFilters = () => {
    const filtersContainer = document.getElementById('exercise-filters');
    const categories = ['Todos', ...new Set(exercisesData.map(e => e.category))];
    filtersContainer.innerHTML = categories.map(category => `
<button class="filter-btn bg-white text-gray-700 px-4 py-2 rounded-full font-semibold border border-gray-300 hover:border-[#6B8E23] transition-colors ${category === 'Todos' ? 'active' : ''}" data-category="${category}">
${category}
</button>
`).join('');
    // Adiciona o listener de clique
    filtersContainer.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            // Remove 'active' de todos e adiciona ao clicado
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterExercises(category);
        });
    });
};
// Renderiza a grade de exercícios com base no filtro
const renderExerciseGrid = (filteredData = exercisesData) => {
    const grid = document.getElementById('exercise-grid');
    grid.innerHTML = filteredData.map(exercise => `
<div class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] border-2 border-transparent hover:border-[#6B8E23] p-4" data-exercise-id="${exercise.id}">
<img src="${exercise.image}" alt="${exercise.name}" class="w-full h-36 object-cover rounded-lg mb-4">
<h3 class="text-xl font-bold text-[#3D3B3A] mb-1">${exercise.name}</h3>
<p class="text-sm text-gray-500">${exercise.category} | Foco: ${exercise.focus}</p>
</div>
`).join('');
    // Adiciona listener para abrir modal de detalhes
    grid.querySelectorAll('[data-exercise-id]').forEach(item => {
        item.addEventListener('click', (e) => openModal(e, 'exercise', parseInt(item.getAttribute('data-exercise-id'))));
    });
};
// Filtra os exercícios
const filterExercises = (category) => {
    if (category === 'Todos') {
        renderExerciseGrid(exercisesData);
    } else {
        const filtered = exercisesData.filter(e => e.category === category);
        renderExerciseGrid(filtered);
    }
};
// NOVA FUNÇÃO PARA RENDERIZAR RECOMENDAÇÕES IMPORTANTES
const renderImportantRecommendations = () => {
    const recommendationsContainer = document.createElement('div');
    recommendationsContainer.classList.add('max-w-3xl', 'mx-auto', 'mt-12', 'p-8', 'bg-white', 'rounded-2xl', 'shadow-lg', 'border-t-4', 'border-[#6B8E23]');
    recommendationsContainer.innerHTML = `
        <h3 class="text-2xl font-bold text-[#6B8E23] mb-4">Recomendações Importantes</h3>
        <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
                <span class="text-[#6B8E23] text-xl mr-3"></span>
                <div>
                    <strong class="text-[#3D3B3A]">Não force:</strong> Se sentir dor, desconforto ou dúvida sobre a execução, pare imediatamente.
                </div>
            </li>
            <li class="flex items-start">
                <span class="text-[#6B8E23] text-xl mr-3">✅</span>
                <div>
                    <strong class="text-[#3D3B3A]">Mantenha a postura:</strong> Mantenha a cabeça e a coluna eretas durante os exercícios.
                </div>
            </li>
            <li class="flex items-start">
                <span class="text-[#6B8E23] text-xl mr-3">✅</span>
                <div>
                    <strong class="text-[#3D3B3A]">Respire:</strong> Respire continuamente e evite prender o ar durante o movimento.
                </div>
            </li>
            <li class="flex items-start">
                <span class="text-[#6B8E23] text-xl mr-3">✅</span>
                <div>
                    <strong class="text-[#3D3B3A]">Priorize a segurança:</strong> Se necessário, apoie-se em um local seguro caso o exercício seja feito em pé.
                </div>
            </li>
            <li class="flex items-start">
                <span class="text-[#6B8E23] text-xl mr-3">✅</span>
                <div>
                    <strong class="text-[#3D3B3A]">Varie os treinos:</strong> O ideal é treinar no mínimo duas vezes por semana, alternando os dias de descanso para recuperação.
                </div>
            </li>
        </ul>
    `;
    const exercisesSection = document.getElementById('exercises');
    // Insere as recomendações após a grade de exercícios
    exercisesSection.appendChild(recommendationsContainer);
};
// --- FUNÇÕES DE MODAL ---
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

const openModal = (e, type, id = null) => {
    e.preventDefault();
    modal.classList.add('opacity-100', 'visible');
    modal.classList.remove('invisible', 'opacity-0');
    modal.querySelector('.modal-content').classList.remove('scale-95');
    modal.querySelector('.modal-content').classList.add('scale-100');
    modalBody.innerHTML = '';
    if (type === 'exercise' && id !== null) {
        const exercise = exercisesData.find(e => e.id === id);
        if (exercise) {
            modalTitle.textContent = exercise.name;
            modalBody.innerHTML = `
<img src="${exercise.image}" alt="${exercise.name}" class="w-full h-auto object-cover rounded-lg mb-4">
<div class="bg-gray-50 p-4 rounded-lg space-y-2">
<p class="text-sm"><strong>Categoria:</strong> ${exercise.category}</p>
<p class="text-sm"><strong>Foco Principal:</strong> ${exercise.focus}</p>
<p class="text-sm"><strong>Duração/Séries:</strong> ${exercise.duration}</p>
<p class="text-sm"><strong>Dificuldade:</strong> ${exercise.difficulty}</p>
</div>
<p class="mt-4">${exercise.description}</p>
`;
        }
    } else if (type === 'delete') {
        modalTitle.textContent = "Confirmação de Exclusão de Conta";
        modalBody.innerHTML = `
<p class="text-lg font-semibold text-red-600">Atenção: Esta ação não pode ser desfeita.</p>
<p>Ao confirmar, todos os seus dados serão removidos. Você será deslogado e precisará criar uma nova conta para acessar.</p>
<div class="mt-6 flex justify-end space-x-4">
<button id="cancel-delete" class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
<button id="confirm-delete" class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Sim, Excluir Minha Conta</button>
</div>
`;
        // Adiciona listeners dentro do modal
        document.getElementById('cancel-delete').addEventListener('click', closeModal);
        document.getElementById('confirm-delete').addEventListener('click', handleDeleteAccount);
    }
};
const closeModal = () => {
    modal.querySelector('.modal-content').classList.remove('scale-100');
    modal.querySelector('.modal-content').classList.add('scale-95');
    modal.classList.add('invisible', 'opacity-0');
    modal.classList.remove('opacity-100', 'visible');
    // Remove listeners para evitar memory leaks (se necessário, mas neste caso não é estritamente obrigatório pois o modal-body é resetado)
    const confirmBtn = document.getElementById('confirm-delete');
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleDeleteAccount);
    }
    const cancelBtn = document.getElementById('cancel-delete');
    if (cancelBtn) {
        cancelBtn.removeEventListener('click', closeModal);
    }
};
document.getElementById('modal-close').addEventListener('click', closeModal);
// Fecha o modal ao clicar fora
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
// Remove this second declaration as it's already defined above

// Inicialização da view
window.addEventListener('load', () => {
    // A função onAuthStateChanged (no bloco de autenticação) já lida com a transição da view e remove o loading.
    // O loading é removido em toggleMainView.
    // A inicialização dos gráficos e exercícios é feita dentro de toggleMainView para garantir que o usuário esteja logado.
});