const apiUrl = 'https://3c36-2804-7f4-6240-cdd1-a02f-e998-900b-ee1c.ngrok-free.app '; // URL do servidor Express

// Função para carregar todos os produtos da Tabela 1
async function carregarProdutos() {
    const res = await fetch(`${apiUrl}/produtos`);
    const produtos = await res.json();
    const tbody = document.querySelector('#produtos-table tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" value="${produto.produto}" class="produto" data-id="${produto.id}" disabled></td>
            <td><input type="number" value="${produto.precoCompra}" class="precoCompra" data-id="${produto.id}" disabled></td>
            <td><input type="number" value="${produto.precoVenda}" class="precoVenda" data-id="${produto.id}" disabled></td>
            <td><input type="text" value="${produto.cidade}" class="cidade" data-id="${produto.id}" disabled></td>
            <td>
                <button class="edit" onclick="habilitarEdicao(${produto.id})">Editar</button>
                <button class="save" onclick="salvarEdicao(${produto.id})" style="display:none;">Salvar</button>
                <button class="cancel" onclick="cancelarEdicao(${produto.id})" style="display:none;">Cancelar</button>
                <button class="delete" onclick="excluirProduto(${produto.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para habilitar os campos de edição
function habilitarEdicao(id) {
    const row = document.querySelector(`tr td input[data-id='${id}']`).closest('tr');
    row.querySelectorAll('input').forEach(input => input.disabled = false); // Habilita os campos de input

    row.querySelector('.edit').style.display = 'none'; // Esconde o botão "Editar"
    row.querySelector('.save').style.display = 'inline'; // Exibe o botão "Salvar"
    row.querySelector('.cancel').style.display = 'inline'; // Exibe o botão "Cancelar"
}

// Função para salvar a edição do produto
async function salvarEdicao(id) {
    const row = document.querySelector(`tr td input[data-id='${id}']`).closest('tr');
    
    const produto = row.querySelector('.produto').value;
    const precoCompra = parseFloat(row.querySelector('.precoCompra').value);
    const precoVenda = parseFloat(row.querySelector('.precoVenda').value);
    const cidade = row.querySelector('.cidade').value;

    const updatedProduto = {
        produto,
        precoCompra,
        precoVenda,
        cidade
    };

    const res = await fetch(`${apiUrl}/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduto)
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        carregarProdutos();  // Recarrega a lista de produtos
        carregarTabela2();   // Recarrega a Tabela 2 com as rotas
    } else {
        alert(`Erro: ${data.error}`);
    }
}

// Função para cancelar a edição
function cancelarEdicao(id) {
    carregarProdutos(); // Recarrega a lista de produtos sem salvar as alterações
}

// Função para excluir um produto
async function excluirProduto(id) {
    const res = await fetch(`${apiUrl}/produtos/${id}`, {
        method: 'DELETE',
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        carregarProdutos();  // Recarrega a lista de produtos
        carregarTabela2();   // Recarrega a Tabela 2 com as rotas
    } else {
        alert(`Erro: ${data.error}`);
    }
}

// Função para adicionar um novo produto
async function adicionarProduto(event) {
    event.preventDefault();

    const produto = document.getElementById('produto').value;
    const precoCompra = parseFloat(document.getElementById('precoCompra').value);
    const precoVenda = parseFloat(document.getElementById('precoVenda').value);
    const cidade = document.getElementById('cidade').value;

    const novoProduto = {
        produto,
        precoCompra,
        precoVenda,
        cidade
    };

    const res = await fetch(`${apiUrl}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        carregarProdutos();  // Recarrega a lista de produtos
        carregarTabela2();   // Recarrega a Tabela 2 com as rotas
    } else {
        alert(`Erro: ${data.error}`);
    }
}

// Função para carregar a Tabela 2 (rotas de lucro)
async function carregarTabela2() {
    const res = await fetch(`${apiUrl}/tabela2`);
    const rotas = await res.json();
    const tbody = document.querySelector('#tabela2 tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    rotas.forEach(rotta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rotta.produto}</td>
            <td>${rotta.cidadeCompra}</td>
            <td>${rotta.precoCompra}</td>
            <td>${rotta.cidadeVenda}</td>
            <td>${rotta.precoVenda}</td>
            <td>${rotta.lucro}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Evento para enviar o formulário de cadastro
document.getElementById('product-form').addEventListener('submit', adicionarProduto);

// Carregar os produtos e a Tabela 2 assim que a página for carregada
window.onload = () => {
    carregarProdutos();
    carregarTabela2();
};
