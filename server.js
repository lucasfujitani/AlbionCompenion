const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Configuração do Express
const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Lucas', // Substitua pelo seu usuário MySQL
    password: 'Castro-090604', // Substitua pela sua senha MySQL
    database: 'albion' // Nome do banco de dados
});

// Rota para cadastrar um novo produto na Tabela 1
app.post('/produtos', (req, res) => {
    const { produto, precoCompra, precoVenda, cidade } = req.body;

    // Verificando se todos os campos necessários foram passados
    if (!produto || !precoCompra || !precoVenda || !cidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    connection.query(
        'INSERT INTO produtos (produto, precoCompra, precoVenda, cidade) VALUES (?, ?, ?, ?)',
        [produto, precoCompra, precoVenda, cidade],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            recalcularTabela2(); // Recalcula a Tabela 2 sempre que um novo produto for inserido
            res.status(201).json({ id: results.insertId, message: 'Produto adicionado com sucesso!' });
        }
    );
});

// Rota para listar todos os produtos (Tabela 1)
app.get('/produtos', (req, res) => {
    connection.query('SELECT * FROM produtos', (err, produtos) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(produtos);
    });
});

// Rota para calcular e retornar a Tabela 2 automaticamente com base na Tabela 1
app.get('/tabela2', (req, res) => {
    connection.query(
        `SELECT p1.produto, p1.cidade as cidadeCompra, p1.precoCompra, 
                p2.cidade as cidadeVenda, p2.precoVenda, 
                (p2.precoVenda - p1.precoCompra) as lucro 
         FROM produtos p1, produtos p2 
         WHERE p1.produto = p2.produto 
         AND p1.cidade != p2.cidade
         AND (p2.precoVenda - p1.precoCompra) > 0`, // Filtrando para mostrar apenas rotas com lucro
        (err, resultados) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(resultados);
        }
    );
});

// Rota para atualizar um produto (Tabela 1)
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { produto, precoCompra, precoVenda, cidade } = req.body;

    // Verificando se todos os campos necessários foram passados
    if (!produto || !precoCompra || !precoVenda || !cidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Executando a consulta de atualização
    connection.query(
        'UPDATE produtos SET produto = ?, precoCompra = ?, precoVenda = ?, cidade = ? WHERE id = ?',
        [produto, precoCompra, precoVenda, cidade, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro no banco de dados: ' + err.message });
            }
            if (results.affectedRows > 0) {
                recalcularTabela2(); // Recalcula a Tabela 2 após atualizar um produto
                res.json({ message: 'Produto atualizado com sucesso!' });
            } else {
                res.status(404).json({ message: 'Produto não encontrado para atualizar' });
            }
        }
    );
});

// Rota para excluir um produto (Tabela 1)
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    connection.query(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows > 0) {
                recalcularTabela2(); // Recalcula a Tabela 2 após excluir um produto
                res.json({ message: 'Produto excluído com sucesso!' });
            } else {
                res.status(404).json({ message: 'Produto não encontrado para excluir' });
            }
        }
    );
});

// Função para recalcular a Tabela 2
function recalcularTabela2() {
    console.log('Tabela 2 recalculada!');
}

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
