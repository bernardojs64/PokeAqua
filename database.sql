-- ============================================
-- BANCO DE DADOS POKEAQUA STORE
-- Sistema de E-commerce para Pokémons de Água
-- ============================================

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS pokeaqua_store;
USE pokeaqua_store;

-- ============================================
-- TABELA: categorias
-- Armazena as categorias de produtos
-- ============================================
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: produtos
-- Armazena todos os produtos da loja
-- ============================================
CREATE TABLE produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    nome_produto VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT DEFAULT 0,
    id_categoria INT,
    imagem_url VARCHAR(255),
    pokemon_nome VARCHAR(100),
    tipo_pokemon VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- ============================================
-- TABELA: clientes
-- Armazena informações dos clientes
-- ============================================
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: enderecos
-- Armazena endereços dos clientes
-- ============================================
CREATE TABLE enderecos (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    tipo_endereco ENUM('entrega', 'cobranca', 'ambos') DEFAULT 'entrega',
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    pais VARCHAR(50) DEFAULT 'Brasil',
    endereco_principal BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

-- ============================================
-- TABELA: formas_pagamento
-- Armazena as formas de pagamento disponíveis
-- ============================================
CREATE TABLE formas_pagamento (
    id_forma_pagamento INT PRIMARY KEY AUTO_INCREMENT,
    nome_forma VARCHAR(50) NOT NULL,
    descricao TEXT,
    taxa_adicional DECIMAL(5, 2) DEFAULT 0.00,
    desconto_percentual DECIMAL(5, 2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    icone_url VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: pedidos
-- Armazena os pedidos realizados
-- ============================================
CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_endereco INT NOT NULL,
    id_forma_pagamento INT NOT NULL,
    status_pedido ENUM('pendente', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
    subtotal DECIMAL(10, 2) NOT NULL,
    valor_frete DECIMAL(10, 2) DEFAULT 0.00,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    valor_total DECIMAL(10, 2) NOT NULL,
    observacoes TEXT,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_endereco) REFERENCES enderecos(id_endereco),
    FOREIGN KEY (id_forma_pagamento) REFERENCES formas_pagamento(id_forma_pagamento)
);

-- ============================================
-- TABELA: itens_pedido
-- Armazena os itens de cada pedido
-- ============================================
CREATE TABLE itens_pedido (
    id_item_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- ============================================
-- TABELA: carrinho
-- Armazena itens no carrinho (temporário)
-- ============================================
CREATE TABLE carrinho (
    id_carrinho INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    id_produto INT NOT NULL,
    quantidade INT DEFAULT 1,
    sessao_id VARCHAR(100),
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

-- ============================================
-- TABELA: contatos
-- Armazena mensagens de contato
-- ============================================
CREATE TABLE contatos (
    id_contato INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    assunto VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    status_contato ENUM('novo', 'lido', 'respondido', 'arquivado') DEFAULT 'novo',
    aceita_comunicacao BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMP NULL
);

-- ============================================
-- TABELA: avaliacoes
-- Armazena avaliações de produtos
-- ============================================
CREATE TABLE avaliacoes (
    id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INT NOT NULL,
    id_cliente INT NOT NULL,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aprovado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- ============================================
-- INSERÇÃO DE DADOS INICIAIS
-- ============================================

-- Inserir categorias
INSERT INTO categorias (nome_categoria, descricao, imagem_url) VALUES
('Pelúcias', 'Pelúcias fofas dos seus Pokémons de água favoritos', '/img/OSHAWOTT PLUSHIE__!__!_!_!__.jpeg'),
('Cards', 'Cartas colecionáveis de Pokémons aquáticos', '/img/Zorua N.jpeg'),
('Produtos TCG', 'Boosters, decks e acessórios para o jogo', '/img/elite trainer.jpeg');

-- Inserir produtos
INSERT INTO produtos (nome_produto, descricao, preco, estoque, id_categoria, imagem_url, pokemon_nome, tipo_pokemon, destaque) VALUES
-- Pelúcias
('Pelúcia Mudkip', 'Pelúcia super fofa do nosso mascote Mudkip, feita com materiais de alta qualidade.', 89.90, 50, 1, '/img/Mudkip Happy.jpeg', 'Mudkip', 'Água', TRUE),
('Pelúcia Squirtle', 'Pelúcia do clássico Squirtle, perfeita para colecionadores e fãs.', 79.90, 35, 1, '/img/squirtle de oculos.jpeg', 'Squirtle', 'Água', TRUE),
('Pelúcia Psyduck', 'Pelúcia do adorável Psyduck, com sua expressão característica.', 74.90, 40, 1, '/img/nerd psyduck icon.jpeg', 'Psyduck', 'Água', FALSE),
('Pelúcia Oshawott', 'Pelúcia fofa do Oshawott, Pokémon de água da região de Unova.', 84.90, 25, 1, '/img/OSHAWOTT PLUSHIE__!__!_!_!__.jpeg', 'Oshawott', 'Água', FALSE),

-- Cards
('Card Mudkip Holográfico Equipe Rocket', 'Carta holográfica rara do Mudkip, perfeita para sua coleção.', 2244.90, 5, 2, '/img/mudkip pokemon card.jpeg', 'Mudkip', 'Água', TRUE),
('Coleção Cards Água', 'Set completo com 20 cartas de Pokémons do tipo água.', 129.90, 20, 2, '/img/Fan made Kyogre card.jpeg', 'Kyogre', 'Água', FALSE),
('Card Gyarados EX', 'Carta especial do poderoso Gyarados, edição limitada.', 89.90, 15, 2, '/img/gyarados.jpg', 'Gyarados', 'Água/Voador', TRUE),
('Card Zorua N', 'Carta especial do Zorua com o treinador N.', 45.90, 30, 2, '/img/Zorua N.jpeg', 'Zorua', 'Sombrio', FALSE),

-- Produtos TCG
('Lata Kyogre', 'Lata com 36 cartas aleatórias focadas em Pokémons de água, com uma promo de Kyogre.', 84.90, 18, 3, '/img/kyogre.webp', 'Kyogre', 'Água', FALSE),
('Deck Box Temático Oceano', 'Deck pré-construído com estratégias focadas em Pokémons aquáticos.', 69.90, 22, 3, '/img/deck box.webp', 'Vários', 'Água', FALSE),
('Playmat Marnie', 'Tapete de jogo com design exclusivo de Pokémons de água.', 39.90, 45, 3, '/img/playmat.webp', 'Marnie', 'Treinadora', FALSE),
('Elite Trainer Box Mimikyu', 'Caixa completa com boosters, energias e acessórios.', 244.90, 12, 3, '/img/elite trainer.jpeg', 'Mimikyu', 'Fantasma/Fada', TRUE);

-- Inserir formas de pagamento
INSERT INTO formas_pagamento (nome_forma, descricao, taxa_adicional, desconto_percentual, icone_url) VALUES
('PIX', 'Pagamento instantâneo via PIX com 5% de desconto', 0.00, 5.00, '/img/pix-icon.png'),
('Cartão de Crédito', 'Parcelamento em até 12x sem juros', 0.00, 0.00, '/img/credit-card-icon.png'),
('Cartão de Débito', 'Pagamento à vista no débito', 0.00, 0.00, '/img/debit-card-icon.png'),
('Boleto Bancário', 'Pagamento via boleto com 2 dias úteis para compensação', 0.00, 0.00, '/img/boleto-icon.png');

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Produtos em destaque
CREATE VIEW produtos_destaque AS
SELECT p.*, c.nome_categoria
FROM produtos p
JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.destaque = TRUE AND p.ativo = TRUE;

-- View: Produtos por categoria
CREATE VIEW produtos_por_categoria AS
SELECT c.nome_categoria, COUNT(p.id_produto) as total_produtos, 
       SUM(p.estoque) as estoque_total
FROM categorias c
LEFT JOIN produtos p ON c.id_categoria = p.id_categoria
WHERE p.ativo = TRUE
GROUP BY c.id_categoria, c.nome_categoria;

-- View: Resumo de pedidos
CREATE VIEW resumo_pedidos AS
SELECT p.id_pedido, c.nome_completo, p.status_pedido, 
       p.valor_total, p.data_pedido, fp.nome_forma
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
JOIN formas_pagamento fp ON p.id_forma_pagamento = fp.id_forma_pagamento
ORDER BY p.data_pedido DESC;

-- ============================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- ============================================

CREATE INDEX idx_produtos_categoria ON produtos(id_categoria);
CREATE INDEX idx_produtos_destaque ON produtos(destaque, ativo);
CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_status ON pedidos(status_pedido);
CREATE INDEX idx_carrinho_cliente ON carrinho(id_cliente);
CREATE INDEX idx_carrinho_sessao ON carrinho(sessao_id);
CREATE INDEX idx_itens_pedido ON itens_pedido(id_pedido);

-- ============================================
-- PROCEDURES ÚTEIS
-- ============================================

-- Procedure: Adicionar item ao carrinho
DELIMITER //
CREATE PROCEDURE adicionar_ao_carrinho(
    IN p_id_cliente INT,
    IN p_id_produto INT,
    IN p_quantidade INT,
    IN p_sessao_id VARCHAR(100)
)
BEGIN
    DECLARE v_existe INT;
    
    SELECT COUNT(*) INTO v_existe
    FROM carrinho
    WHERE (id_cliente = p_id_cliente OR sessao_id = p_sessao_id)
    AND id_produto = p_id_produto;
    
    IF v_existe > 0 THEN
        UPDATE carrinho
        SET quantidade = quantidade + p_quantidade,
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE (id_cliente = p_id_cliente OR sessao_id = p_sessao_id)
        AND id_produto = p_id_produto;
    ELSE
        INSERT INTO carrinho (id_cliente, id_produto, quantidade, sessao_id)
        VALUES (p_id_cliente, p_id_produto, p_quantidade, p_sessao_id);
    END IF;
END //
DELIMITER ;

-- Procedure: Calcular total do carrinho
DELIMITER //
CREATE PROCEDURE calcular_total_carrinho(
    IN p_id_cliente INT,
    IN p_sessao_id VARCHAR(100),
    OUT p_total DECIMAL(10,2)
)
BEGIN
    SELECT SUM(p.preco * c.quantidade) INTO p_total
    FROM carrinho c
    JOIN produtos p ON c.id_produto = p.id_produto
    WHERE (c.id_cliente = p_id_cliente OR c.sessao_id = p_sessao_id);
    
    IF p_total IS NULL THEN
        SET p_total = 0.00;
    END IF;
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Atualizar estoque após pedido
DELIMITER //
CREATE TRIGGER atualizar_estoque_pedido
AFTER INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE produtos
    SET estoque = estoque - NEW.quantidade
    WHERE id_produto = NEW.id_produto;
END //
DELIMITER ;

-- Trigger: Calcular subtotal do item
DELIMITER //
CREATE TRIGGER calcular_subtotal_item
BEFORE INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.quantidade * NEW.preco_unitario;
END //
DELIMITER ;