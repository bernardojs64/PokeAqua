// ============================================
// POKEAQUA STORE - JAVASCRIPT V.02
// Sistema completo de funcionalidades
// ============================================

// ============================================
// CONFIGURAÇÕES GLOBAIS
// ============================================
const CONFIG = {
    FRETE_GRATIS_ACIMA: 200,
    VALOR_FRETE: 15.00,
    DESCONTO_PIX: 0.05,
    STORAGE_KEY: 'pokeaqua_carrinho'
};

// ============================================
// CLASSE CARRINHO
// ============================================
class Carrinho {
    constructor() {
        this.itens = this.carregarCarrinho();
        this.inicializar();
    }

    // Carregar carrinho do localStorage
    carregarCarrinho() {
        const dados = localStorage.getItem(CONFIG.STORAGE_KEY);
        return dados ? JSON.parse(dados) : [];
    }

    // Salvar carrinho no localStorage
    salvarCarrinho() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.itens));
        this.atualizarContador();
    }

    // Adicionar produto ao carrinho
    adicionar(produto) {
        const itemExistente = this.itens.find(item => item.id === produto.id);
        
        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            this.itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                descricao: produto.descricao,
                quantidade: 1
            });
        }
        
        this.salvarCarrinho();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, 'sucesso');
        this.renderizar();
    }

    // Remover produto do carrinho
    remover(id) {
        this.itens = this.itens.filter(item => item.id !== id);
        this.salvarCarrinho();
        this.mostrarNotificacao('Produto removido do carrinho', 'info');
        this.renderizar();
    }

    // Atualizar quantidade
    atualizarQuantidade(id, novaQuantidade) {
        const item = this.itens.find(item => item.id === id);
        if (item) {
            if (novaQuantidade <= 0) {
                this.remover(id);
            } else {
                item.quantidade = novaQuantidade;
                this.salvarCarrinho();
                this.renderizar();
            }
        }
    }

    // Calcular subtotal
    calcularSubtotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    // Calcular frete
    calcularFrete() {
        const subtotal = this.calcularSubtotal();
        return subtotal >= CONFIG.FRETE_GRATIS_ACIMA ? 0 : CONFIG.VALOR_FRETE;
    }

    // Calcular total
    calcularTotal(formaPagamento = 'credito') {
        const subtotal = this.calcularSubtotal();
        const frete = this.calcularFrete();
        let total = subtotal + frete;
        
        if (formaPagamento === 'pix') {
            total = total * (1 - CONFIG.DESCONTO_PIX);
        }
        
        return total;
    }

    // Atualizar contador do carrinho
    atualizarContador() {
        const contador = document.querySelector('.cart-count');
        const totalItens = this.itens.reduce((total, item) => total + item.quantidade, 0);
        
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    }

    // Renderizar carrinho
    renderizar() {
        const containerItens = document.querySelector('.cart-items');
        const containerVazio = document.querySelector('.empty-cart');
        const resumo = document.querySelector('.cart-summary');
        
        if (!containerItens) return;
        
        if (this.itens.length === 0) {
            if (containerVazio) containerVazio.style.display = 'block';
            if (resumo) resumo.style.display = 'none';
            containerItens.innerHTML = '';
            return;
        }
        
        if (containerVazio) containerVazio.style.display = 'none';
        if (resumo) resumo.style.display = 'block';
        
        containerItens.innerHTML = this.itens.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.nome}</h3>
                    <p class="cart-item-description">${item.descricao}</p>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="carrinho.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                            <span class="quantity">${item.quantidade}</span>
                            <button class="quantity-btn" onclick="carrinho.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                        </div>
                        <button class="remove-btn" onclick="carrinho.remover('${item.id}')">Remover</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span class="price">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
        
        this.atualizarResumo();
    }

    // Atualizar resumo do pedido
    atualizarResumo() {
        const subtotal = this.calcularSubtotal();
        const frete = this.calcularFrete();
        const formaPagamento = document.querySelector('input[name="pagamento"]:checked')?.value || 'credito';
        const total = this.calcularTotal(formaPagamento);
        
        const subtotalEl = document.querySelector('.summary-line:nth-child(2) span:last-child');
        const freteEl = document.querySelector('.summary-line:nth-child(3) span:last-child');
        const totalEl = document.querySelector('.summary-line.total span:last-child');
        
        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (freteEl) {
            freteEl.textContent = frete === 0 ? 'GRÁTIS' : `R$ ${frete.toFixed(2)}`;
            freteEl.style.color = frete === 0 ? '#27ae60' : '#2c3e50';
        }
        if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'info') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.textContent = mensagem;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => notificacao.classList.add('show'), 100);
        
        setTimeout(() => {
            notificacao.classList.remove('show');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    // Inicializar eventos
    inicializar() {
        this.atualizarContador();
        
        if (window.location.pathname.includes('carrinho.html')) {
            this.renderizar();
            this.configurarPagamento();
        }
    }

    // Configurar sistema de pagamento
    configurarPagamento() {
        const radios = document.querySelectorAll('input[name="pagamento"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => this.atualizarResumo());
        });
    }

    // Limpar carrinho
    limpar() {
        this.itens = [];
        this.salvarCarrinho();
        this.renderizar();
    }
}

// ============================================
// PRODUTOS
// ============================================
const PRODUTOS = [
    // Pelúcias
    { id: 'pelucia-mudkip', nome: 'Pelúcia Mudkip', preco: 89.90, imagem: '/img/Mudkip Happy.jpeg', descricao: 'Pelúcia super fofa do nosso mascote', categoria: 'pelucias' },
    { id: 'pelucia-squirtle', nome: 'Pelúcia Squirtle', preco: 79.90, imagem: '/img/squirtle de oculos.jpeg', descricao: 'Pelúcia do clássico Squirtle', categoria: 'pelucias' },
    { id: 'pelucia-psyduck', nome: 'Pelúcia Psyduck', preco: 74.90, imagem: '/img/nerd psyduck icon.jpeg', descricao: 'Pelúcia do adorável Psyduck', categoria: 'pelucias' },
    
    // Cards
    { id: 'card-mudkip', nome: 'Card Mudkip Holográfico Equipe Rocket', preco: 2244.90, imagem: '/img/mudkip pokemon card.jpeg', descricao: 'Carta holográfica rara do Mudkip', categoria: 'cards' },
    { id: 'card-colecao', nome: 'Coleção Cards Água', preco: 129.90, imagem: '/img/Fan made Kyogre card.jpeg', descricao: 'Set completo com 20 cartas', categoria: 'cards' },
    { id: 'card-gyarados', nome: 'Card Gyarados EX', preco: 89.90, imagem: '/img/gyarados.jpg', descricao: 'Carta especial do Gyarados', categoria: 'cards' },
    
    // TCG
    { id: 'tcg-kyogre', nome: 'Lata Kyogre', preco: 84.90, imagem: '/img/kyogre.webp', descricao: 'Lata com 36 cartas aleatórias', categoria: 'tcg' },
    { id: 'tcg-deck', nome: 'Deck Box Temático Oceano', preco: 69.90, imagem: '/img/deck box.webp', descricao: 'Deck pré-construído', categoria: 'tcg' },
    { id: 'tcg-playmat', nome: 'Playmat Marnie', preco: 39.90, imagem: '/img/playmat.webp', descricao: 'Tapete de jogo exclusivo', categoria: 'tcg' },
    { id: 'tcg-elite', nome: 'Elite Trainer Box Mimikyu', preco: 244.90, imagem: '/img/elite trainer.jpeg', descricao: 'Pacote com 15 cartas aleatórias', categoria: 'tcg' }
];

// ============================================
// MENU MOBILE
// ============================================
function inicializarMenuMobile() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const links = menu.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
}

// ============================================
// ROLAGEM SUAVE
// ============================================
function inicializarRolagemSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// BOTÃO VOLTAR AO TOPO
// ============================================
function inicializarBotaoTopo() {
    const botao = document.createElement('button');
    botao.className = 'btn-topo';
    botao.innerHTML = '↑';
    botao.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(botao);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            botao.classList.add('show');
        } else {
            botao.classList.remove('show');
        }
    });
    
    botao.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// ADICIONAR PRODUTOS AO CARRINHO
// ============================================
function inicializarBotoesProdutos() {
    const botoes = document.querySelectorAll('.btn-primary');
    
    botoes.forEach(botao => {
        if (botao.textContent.includes('Adicionar ao Carrinho')) {
            botao.addEventListener('click', function(e) {
                e.preventDefault();
                
                const card = this.closest('.product-card');
                const nome = card.querySelector('.product-name').textContent;
                const precoTexto = card.querySelector('.product-price').textContent;
                const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
                const imagem = card.querySelector('.product-image').src;
                const descricao = card.querySelector('.product-description').textContent;
                
                const produto = PRODUTOS.find(p => p.nome === nome) || {
                    id: `produto-${Date.now()}`,
                    nome,
                    preco,
                    imagem,
                    descricao
                };
                
                carrinho.adicionar(produto);
            });
        }
    });
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================
function inicializarFormularioContato() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value;
            
            // Aqui você pode enviar os dados para o servidor
            console.log('Formulário enviado:', { nome, email, assunto, mensagem });
            
            carrinho.mostrarNotificacao('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'sucesso');
            form.reset();
        });
    }
}

// ============================================
// SISTEMA DE PAGAMENTO
// ============================================
function inicializarSistemaPagamento() {
    const resumo = document.querySelector('.summary-card');
    
    if (resumo && !document.querySelector('.payment-options')) {
        const paymentHTML = `
            <div class="payment-options">
                <h4 style="margin: 1rem 0; color: #2c3e50;">Forma de Pagamento</h4>
                <label class="payment-option">
                    <input type="radio" name="pagamento" value="pix" checked>
                    <span>PIX (5% de desconto)</span>
                </label>
                <label class="payment-option">
                    <input type="radio" name="pagamento" value="credito">
                    <span>Cartão de Crédito</span>
                </label>
                <label class="payment-option">
                    <input type="radio" name="pagamento" value="debito">
                    <span>Cartão de Débito</span>
                </label>
                <label class="payment-option">
                    <input type="radio" name="pagamento" value="boleto">
                    <span>Boleto Bancário</span>
                </label>
            </div>
        `;
        
        const summaryTitle = resumo.querySelector('.summary-title');
        summaryTitle.insertAdjacentHTML('afterend', paymentHTML);
        
        carrinho.configurarPagamento();
    }
}

// ============================================
// FINALIZAR COMPRA
// ============================================
function inicializarFinalizarCompra() {
    const botaoFinalizar = document.querySelector('.btn-primary.btn-full');
    
    if (botaoFinalizar && botaoFinalizar.textContent.includes('Finalizar Compra')) {
        botaoFinalizar.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (carrinho.itens.length === 0) {
                carrinho.mostrarNotificacao('Seu carrinho está vazio!', 'erro');
                return;
            }
            
            const formaPagamento = document.querySelector('input[name="pagamento"]:checked')?.value || 'pix';
            const total = carrinho.calcularTotal(formaPagamento);
            
            // Aqui você pode processar o pedido
            console.log('Pedido finalizado:', {
                itens: carrinho.itens,
                formaPagamento,
                total
            });
            
            carrinho.mostrarNotificacao('Pedido realizado com sucesso! Redirecionando...', 'sucesso');
            
            setTimeout(() => {
                carrinho.limpar();
                window.location.href = 'index.html';
            }, 2000);
        });
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
let carrinho;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrinho
    carrinho = new Carrinho();
    
    // Inicializar funcionalidades
    inicializarMenuMobile();
    inicializarRolagemSuave();
    inicializarBotaoTopo();
    inicializarBotoesProdutos();
    inicializarFormularioContato();
    inicializarSistemaPagamento();
    inicializarFinalizarCompra();
    
    console.log('PokeAqua Store inicializado com sucesso!');
});

// ============================================
// ESTILOS ADICIONAIS PARA JAVASCRIPT
// ============================================
const estilosAdicionais = `
    /* Notificações */
    .notificacao {
        position: fixed;
        top: 20px;
        right: -300px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transition: right 0.3s ease;
        max-width: 300px;
    }
    
    .notificacao.show {
        right: 20px;
    }
    
    .notificacao-sucesso {
        border-left: 4px solid #27ae60;
    }
    
    .notificacao-erro {
        border-left: 4px solid #e74c3c;
    }
    
    .notificacao-info {
        border-left: 4px solid #3498db;
    }
    
    /* Botão voltar ao topo */
    .btn-topo {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .btn-topo.show {
        opacity: 1;
        visibility: visible;
    }
    
    .btn-topo:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    /* Menu mobile ativo */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            flex-direction: column;
            padding: 2rem;
            transition: left 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    /* Opções de pagamento */
    .payment-options {
        margin: 1.5rem 0;
        padding: 1rem 0;
        border-top: 1px solid #ecf0f1;
        border-bottom: 1px solid #ecf0f1;
    }
    
    .payment-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .payment-option:hover {
        border-color: #3498db;
        background-color: #f8f9fa;
    }
    
    .payment-option input[type="radio"] {
        cursor: pointer;
    }
    
    .payment-option input[type="radio"]:checked + span {
        color: #3498db;
        font-weight: 600;
    }
    
    /* Contador do carrinho */
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosAdicionais;
document.head.appendChild(styleSheet);