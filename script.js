// Atributos de jogo
let caixa = 100000.00;
let produtividade = 50;
let sustentabilidade = 50;
let safra = 1;

// Seleção de elementos HTML
const elSafra = document.getElementById('safra-atual');
const elCaixa = document.getElementById('caixa-valor');
const elProdTxt = document.getElementById('txt-produtividade');
const elProdBar = document.getElementById('bar-produtividade');
const elSustTxt = document.getElementById('txt-sustentabilidade');
const elSustBar = document.getElementById('bar-sustentabilidade');
const elMural = document.getElementById('mural-eventos');
const elPainelAcoes = document.getElementById('painel-acoes');
const elTelaFinal = document.getElementById('tela-final');
const elTituloFinal = document.getElementById('resultado-titulo');
const elMsgFinal = document.getElementById('resultado-mensagem');

function atualizarInterface() {
    elSafra.innerText = `${safra} / 5`;
    elCaixa.innerText = caixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    elCaixa.className = caixa >= 0 ? "positivo" : "negativo";

    elProdTxt.innerText = `${produtividade}%`;
    elProdBar.style.width = `${produtividade}%`;
    
    elSustTxt.innerText = `${sustentabilidade}%`;
    elSustBar.style.width = `${sustentabilidade}%`;
}

function jogarRodada(escolha) {
    let custo = 0, ganhoProd = 0, perdaSust = 0;
    let textoManejo = "";

    if (escolha === 1) {
        custo = 20000; ganhoProd = 30; perdaSust = 25;
        textoManejo = "🚜 <strong>Manejo Tradicional Intensivo:</strong> Alta aplicação de químicos acelerou a colheita, mas compactou e desprotegeu o solo para a próxima estação.";
    } else if (escolha === 2) {
        custo = 30000; ganhoProd = 15; perdaSust = -10;
        textoManejo = "🐝 <strong>Manejo Integrado & Bioinsumos:</strong> Uso estratégico da biologia protetora. A biodiversidade aumentou mantendo o nível produtivo estável.";
    } else if (escolha === 3) {
        custo = 45000; ganhoProd = 5; perdaSust = -30;
        textoManejo = "🌳 <strong>Agroecologia Regenerativa:</strong> Alto investimento na rotação de culturas e reflorestamento de encostas. O solo recupera vida e nutrientes.";
    }

    caixa -= custo;
    produtividade = Math.max(0, Math.min(100, produtividade + ganhoProd));
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade - perdaSust));

    // Clima Aleatório
    const eventos = ["Estiagem Intensa", "Clima Excelente", "Ataque Extremo de Pragas"];
    const eventoSorteado = eventos[Math.floor(Math.random() * eventos.length)];
    let textoClima = "";
    let receitaSafra = 0;

    if (eventoSorteado === "Estiagem Intensa") {
        let resiliencia = sustentabilidade / 100; 
        receitaSafra = (produtividade * 1500) * (0.35 + (resiliencia * 0.65));
        textoClima = `<br>⚠️ <strong>Clima: Estiagem Intensa!</strong> Solos ricos em matéria orgânica retiveram mais umidade. Sua cobertura vegetal salvou parte do lucro!`;
    } else if (eventoSorteado === "Ataque Extremo de Pragas") {
        if (sustentabilidade < 50) {
            receitaSafra = (produtividade * 700);
            textoClima = `<br>🐛 <strong>Clima: Pragas na Lavoura!</strong> Baixa sustentabilidade significa falta de inimigos naturais. O ataque dizimou o lucro da safra.`;
        } else {
            receitaSafra = (produtividade * 1900);
            textoClima = `<br>🐞 <strong>Clima: Pragas na Lavoura!</strong> Seu ecossistema rico agiu sozinho. Predadores naturais mantiveram as pragas sob controle!`;
        }
    } else {
        receitaSafra = (produtividade * 2300);
        textoClima = `<br>☀️ <strong>Clima: Clima Excelente!</strong> Ótimo índice de chuvas impulsionou suas vendas no mercado regional.`;
    }

    caixa += receitaSafra;
    elMural.innerHTML = `<p>${textoManejo} ${textoClima} <br>💰 <strong>Faturamento Líquido:</strong> + R$ ${receitaSafra.toLocaleString('pt-BR')}</p>`;

    // Fim de jogo?
    if (caixa <= 0) {
        finalizarJogo(false, "💰 <strong>Falência Econômica!</strong> O caixa zerou. O agronegócio exige rentabilidade real para poder investir em tecnologia verde.");
        return;
    }
    if (sustentabilidade <= 0) {
        finalizarJogo(false, "🚨 <strong>Esgotamento da Terra!</strong> A sustentabilidade zerou. O solo tornou-se estéril e arenoso, inviabilizando qualquer plantio futuro.");
        return;
    }

    if (safra >= 5) {
        let perfil = "";
        if (sustentabilidade >= 75 && caixa >= 170000) {
            perfil = "🏆 <strong>Referência Global em Agro Forte & Sustentável:</strong> Excelente patrimônio líquido e fazenda ecologicamente intocável. Você é o futuro da agricultura.";
        } else if (sustentabilidade < 40) {
            perfil = "⚠️ <strong>Produtor Predatório:</strong> Você acumulou capital, mas a terra está exausta e dependente de aditivos caros. Não durará outra década.";
        } else {
            perfil = "👍 <strong>Produtor Equilibrado:</strong> Conseguiu manter as contas no azul e o solo protegido contra intempéries climáticas.";
        }
        finalizarJogo(true, perfil);
    } else {
        safra++;
        atualizarInterface();
    }
}

function finalizarJogo(vitoria, mensagem) {
    atualizarInterface();
    elPainelAcoes.classList.add('hidden');
    elTelaFinal.classList.remove('hidden');
    elTituloFinal.innerText = vitoria ? "Simulação Concluída!" : "Fim de Linha para a Fazenda";
    elTituloFinal.style.color = vitoria ? "var(--yellow-crop)" : "var(--red-alert)";
    elMsgFinal.innerHTML = `${mensagem} <br><br><strong>Balanço de Encerramento:</strong><br>Finanças: R$ ${caixa.toLocaleString('pt-BR')} | Saúde Biológica: ${sustentabilidade}%`;
}

function reiniciarJogo() {
    caixa = 100000.00; produtividade = 50; sustentabilidade = 50; safra = 1;
    elMural.innerHTML = "<p><strong>Boletim de Início:</strong> As máquinas estão prontas. Escolha com sabedoria a estratégia para esta safra.</p>";
    elPainelAcoes.classList.remove('hidden');
    elTelaFinal.classList.add('hidden');
    atualizarInterface();
}

atualizarInterface();
