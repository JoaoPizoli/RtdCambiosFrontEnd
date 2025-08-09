import { logout } from '../core/auth.js'

export function renderHeader({ showHome = true, showNav = true, customLinks = [] } = {}){
  const headerHTML = `
    <header>
      <img class="logo" src="images/logo.png" alt="Logo" onclick="redirectTo('painel.html')" style="cursor: pointer;">
      <div class="header-nav">
        ${customLinks.map(link => `<a href="${link.url}" class="nav-link"> 
            <i class="${link.iClass}"></i>
            <span>${link.text}</span>
            </a>`)
            .join('')}
        ${showHome ? '<a href="painel.html" class="home-btn"><i class="fas fa-home"></i>Início</a>' : ''}
        ${showNav ? '<a href="#" class="sair" id="btn-sair">Sair</a>' : ''}
      </div>
    </header>
  `;

  const headerContainer = document.querySelector('[data-header]')
  if(headerContainer){
    headerContainer.innerHTML = headerHTML
  }

  setupHeaderEvents()

}

function setupHeaderEvents(){
    const logoutBtn = document.getElementById('btn-sair')
    if(logoutBtn){
        logoutBtn.addEventListener('click', async(event)=>{
            event.preventDefault()
            await logout()
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-header]')) {
    renderHeader();
  }
});