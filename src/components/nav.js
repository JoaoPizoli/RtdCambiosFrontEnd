// Lista dos links principais do sistema
const navigationLinks = [
    { 
        name: 'Painel', 
        url: 'painel.html', 
        icon: 'fas fa-home',
        page: 'painel'
    },
    { 
        name: 'Registros', 
        url: 'registros.html', 
        icon: 'fas fa-users',
        page: 'registros'
    },
    { 
        name: 'Troca de Óleo', 
        url: 'trocaOleo.html', 
        icon: 'fas fa-oil-can',
        page: 'trocaOleo'
    },
    { 
        name: 'Histórico', 
        url: 'trocasRegistradas.html', 
        icon: 'fas fa-list-check',
        page: 'trocasRegistradas'
    }
];

// Detecta qual página está ativa atualmente
function getCurrentPage() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();
    return currentFile.replace('.html', '');
}

// Função principal para renderizar a navegação
export function renderNav({ showLinks = navigationLinks, customClass = 'main-nav' } = {}) {
    const currentPage = getCurrentPage();
    
    const navHTML = `
        <link rel="stylesheet" href="../styles/nav.css">
        <nav class="${customClass}">
            <div class="nav-container">
                ${showLinks.map(link => `
                    <a href="${link.url}" class="nav-item ${currentPage === link.page ? 'active' : ''}">
                        <i class="${link.icon}"></i>
                        <span>${link.name}</span>
                    </a>
                `).join('')}
            </div>
        </nav>
    `;

    // Procura pelo container de navegação
    const navContainer = document.querySelector('[data-nav]');
    if (navContainer) {
        navContainer.innerHTML = navHTML;
    }
}

// Função para renderizar navegação personalizada
export function renderCustomNav(customLinks, options = {}) {
    renderNav({ 
        showLinks: customLinks, 
        ...options 
    });
}
