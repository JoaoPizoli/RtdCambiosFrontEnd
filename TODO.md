# Plano de Refatoração Front-End (RTD Câmbios)

Guia passo a passo para organizar e evoluir o projeto de forma segura e incremental. Marque as tarefas conforme concluir.

---
## Fase 0 – Preparação / Segurança
- [X] Criar branch `refactor/estrutura-inicial`
- [X] Fazer backup (zip) da pasta atual
- [X] Anotar URL base atual da API (`http://172.16.5.57:3000`)
- [X] Listar páginas ativas (login, painel, registros, troca óleo, trocas registradas)

## Fase 1 – Base de Configuração
- [X] Criar `src/core/config.js` com `export const API_BASE = 'http://172.16.5.57:3000';`
- [X] Criar `src/core/http.js` (função `api(path, options)` centralizando fetch + token)
- [X] Criar `src/core/auth.js` (login, logout, getToken, isAuthenticated)
- [X] Criar `src/core/guard.js` (função `ensureAuth(redirect='login.html')`)

## Fase 2 – Serviços (API Layer)
- [X] Criar `src/services/clientesService.js` (listar, registrar)
- [X] Criar `src/services/carrosService.js` (listarPorCliente, cadastrar)
- [X] Criar `src/services/oleoService.js` (registrar, listarPorCarro)
- [ ] Substituir chamadas diretas de fetch por serviços nas páginas UMA de cada vez

## Fase 3 – Utilidades & Helpers
- [X] Criar `src/utils/formatters.js` (formatarDataBrasileira, etc.)
- [X] Criar `src/utils/autofillFix.js` (unificar lógica de correção de autofill)
- [ ] Criar `src/utils/dom.js` (qs, qsa, createEl, setLoading)
- [X] Remover duplicações de código de autofill

## Fase 4 – Componentização Simples
- [X] Criar `src/components/header.js` (gera o <header> dinâmico conforme página)
- [ ] Criar `src/components/nav.js` (links condicionalmente ativos)
- [X] Substituir headers inline em todas as páginas por container + script que injeta
- [X] Centralizar lógica de logout em `auth.logout()` dentro do header

## Fase 5 – Scripts por Página
- [ ] Criar pasta `src/pages/login/` com `login.js` (migrar lógica atual)
- [ ] Ajustar `login.html` para usar `<script type="module" src="./src/pages/login/login.js"></script>`
- [ ] Criar pasta `src/pages/painel/` com `painel.js` (somente lógica de animação + guard)
- [ ] Criar pasta `src/pages/registros/` dividir em `clientesForm.js` e `carrosForm.js`
- [ ] Criar pasta `src/pages/troca/` (`selecionar.js`, `registrarTroca.js`)
- [ ] Criar pasta `src/pages/trocas-registradas/` (`filtros.js`, `lista.js`, `modais.js`)
- [ ] Remover scripts inline dos HTML (painel, registros, troca, trocas registradas)

## Fase 6 – CSS Modular
- [ ] Criar `src/assets/styles/variables.css` (cores, espaçamentos, fontes)
- [ ] Criar `src/assets/styles/base.css` (reset/normalize + body/html)
- [ ] Criar `src/assets/styles/layout.css` (containers, grids)
- [ ] Criar `src/assets/styles/components.css` (cards, botões, header, badges)
- [ ] Criar `src/assets/styles/forms.css` (inputs, estados, autofill)
- [ ] Mover estilos específicos de páginas para `src/assets/styles/pages/` (login.css, painel.css...)
- [ ] Atualizar HTMLs para importar somente um `main.css` consolidado (posterior)

## Fase 7 – Padronização & Nomenclatura
- [ ] Corrigir variáveis inconsistentes (KmProximaTroca → kmProximaTroca)
- [ ] Padronizar funções com verbos (`carregarClientes`, `popularSelect`, `registrarTroca`)
- [ ] Remover comentários desatualizados / console.log supérfluos
- [ ] Criar lint rule simples (opcional futuro)

## Fase 8 – Estados de UI
- [ ] Implementar loading spinner ou texto em listas (clientes, veículos, trocas)
- [ ] Implementar mensagem de lista vazia reutilizável
- [ ] Padronizar erros (alert → modal/toast futuro) – por ora, função `showError(msg)`

## Fase 9 – Melhoria de Experiência
- [ ] Auto preenchimento de datas (já existe para hoje → extrair para util)
- [ ] Auto cálculo km próxima troca (5000) – extrair função para util
- [ ] Feedback de sucesso consistente (`showSuccess(msg)`)

## Fase 10 – Preparar Build (Opcional Agora)
- [ ] Adicionar `package.json`
- [ ] Instalar Vite (`npm create vite@latest front -- --template vanilla` ou integrar na pasta)
- [ ] Configurar alias `@` apontando para `src`
- [ ] Ajustar imports relativos → absolutos com alias
- [ ] Criar script de build e preview

## Fase 11 – Documentação
- [ ] Criar/atualizar `README.md` com estrutura explicada
- [ ] Adicionar seção Convenções (nomes, pasta, serviços, componentes)
- [ ] Adicionar instruções de execução local (live server ou Vite)

## Fase 12 – Testes (Futuro / Opcional)
- [ ] Escolher ferramenta (Vitest + jsdom ou Playwright para e2e)
- [ ] Testar serviço clientesService.listarClientes()
- [ ] Testar form login (sucesso + erro 401)
- [ ] Testar fluxo registrar troca (mock API)

## Fase 13 – Melhorias Futuras Possíveis
- [ ] Migrar para framework (React/Vue/Svelte) se complexidade crescer
- [ ] Adicionar sistema de design (tokens + componentes)
- [ ] Internacionalização (i18n)
- [ ] Cache leve (clientes já carregados)
- [ ] Dark/Light mode toggle

---
## Ordem Recomendada de Commits
1. chore: add core config & http wrapper
2. feat: add auth service + guard
3. refactor: migrate login page to modules
4. refactor: extract services (clientes, carros, oleo)
5. refactor: remove inline scripts painel/registros
6. feat: add header component + centralized logout
7. style: modularize css base/components/forms
8. refactor: unify autofill logic
9. feat: add loading & empty states
10. docs: update README

## Checklist de Qualidade Antes do Merge
- [ ] Todas páginas funcionam (login → painel → cadastros → trocas → histórico)
- [ ] Nenhuma chamada direta de fetch fora de /core ou /services
- [ ] Nenhum script inline remanescente
- [ ] Console sem erros
- [ ] CSS sem duplicações gritantes
- [ ] Imports usando caminhos limpos

## Notas Rápidas
- Refatore em incrementos pequenos → testar após cada página migrada.
- Não misture reorganização estrutural com mudança visual grande no mesmo commit.
- Mantenha o projeto funcional a cada passo (evitar branch longa demais sem merge).

Se quiser, posso iniciar automatizando as primeiras fases. É só pedir.



ESTOU CONSGUINDO SELECIONAR O VEICULO SEM SELECIONAR O PROPRIETARIO DELE