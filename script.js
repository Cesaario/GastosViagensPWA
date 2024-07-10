const KEY_ITENS = "GASTOS_VIAGEM";

function adicionarItem() {
    const descricao = document.getElementById("inputDescricao").value
    const quantidade = document.getElementById("inputQuantidade").value
    const valor = document.getElementById("inputValor").value
    const moedaDe = document.getElementById("inputMoedaDe").value
    const moedaPara = document.getElementById("inputMoedaPara").value

    if (!descricao || !quantidade || !valor || !moedaDe || !moedaPara) {
        alert("Preencha todos os campos corretamente");
        return;
    }

    const item = { descricao, quantidade, valor, moedaDe, moedaPara };

    const itensAtuais = JSON.parse(localStorage.getItem(KEY_ITENS) || "[]");

    const indexItemJaExistente = itensAtuais.findIndex(item => item.descricao === descricao);

    if (indexItemJaExistente !== -1) {
        itensAtuais[indexItemJaExistente] = item;
    } else {
        itensAtuais.push(item);
    }

    localStorage.setItem(KEY_ITENS, JSON.stringify(itensAtuais))

    atualizarLista();
}

function gerarBotaoDeletar(index) {
    const botao = document.createElement("button");

    botao.innerHTML = "DELETAR"
    botao.className = "btn btn-danger"
    botao.onclick = () => {
        const itensAtuais = JSON.parse(localStorage.getItem(KEY_ITENS) || "[]");
        itensAtuais.splice(index, 1);
        localStorage.setItem(KEY_ITENS, JSON.stringify(itensAtuais));
        atualizarLista();
    };

    return botao;
}

function gerarBotaoEditar(index) {
    const botao = document.createElement("button");

    botao.innerHTML = "EDITAR"
    botao.className = "btn btn-info"
    botao.onclick = () => {
        const itensAtuais = JSON.parse(localStorage.getItem(KEY_ITENS) || "[]");
        const itemParaEditar = itensAtuais[index];
        const { descricao, quantidade, valor, moedaDe, moedaPara } = itemParaEditar;

        document.getElementById("inputDescricao").value = descricao;
        document.getElementById("inputQuantidade").value = quantidade;
        document.getElementById("inputValor").value = valor;
        document.getElementById("inputMoedaDe").value = moedaDe;
        document.getElementById("inputMoedaPara").value = moedaPara;
    };

    return botao;
}

function atualizarLista() {
    const itens = JSON.parse(localStorage.getItem(KEY_ITENS) || "[]");
    const ul = document.getElementById("listaItens");
    ul.innerHTML = "";

    let totalMoedaOrigem = 0;
    let totalMoedaDestino = 0;

    const aaaa = itens.map(async (item, index) => {
        const { descricao, quantidade, valor, moedaDe, moedaPara } = item;

        const requisicaoConversao = await fetch(`https://api.exchangerate-api.com/v4/latest/${moedaDe}`);
        const dadosConversao = await requisicaoConversao.json();
        const taxaConversao = dadosConversao.rates[moedaPara];

        const valorConvertido = valor * taxaConversao * quantidade;

        totalMoedaOrigem += Number(valor);
        totalMoedaDestino += Number(valorConvertido);

        const valorFormatado = parseFloat(valor).toFixed(2);
        const valorConvertidoFormatado = parseFloat(valorConvertido).toFixed(2);

        const li = document.createElement("li");

        li.appendChild(document.createTextNode(`${descricao} (${quantidade}): ${valorFormatado} ${moedaDe} → ${valorConvertidoFormatado} ${moedaPara}`));
        
        const div = document.createElement("div");
        div.className = "botoes";

        div.appendChild(gerarBotaoEditar(index));
        div.appendChild(gerarBotaoDeletar(index));
        li.appendChild(div);

        ul.appendChild(li);

        console.log(totalMoedaOrigem);
    })

    Promise.allSettled(aaaa).then(() => {  
        document.getElementById("valorMoedaOrigem").innerHTML = parseFloat(totalMoedaOrigem).toFixed(2);
        document.getElementById("valorMoedaDestino").innerHTML = parseFloat(totalMoedaDestino).toFixed(2);
    })
}

atualizarLista();