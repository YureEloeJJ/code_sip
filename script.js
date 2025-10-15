let sipData = {};

// Carrega o JSON na inicialização
fetch('sip_codes_database.json')
  .then(res => res.json())
  .then(data => sipData = data.sip_response_codes)
  .catch(err => console.error("Erro ao carregar JSON:", err));

function buscarCodigo() {
    const codigoInput = document.getElementById('codigoInput');
    const codigo = codigoInput.value.trim();
    
    // NOVO: 1. Pega o valor do campo de seleção de origem
    const origemInput = document.getElementById('origemInput');
    const origem = origemInput.value; 
    
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = "";

    // NOVO: 2. Validação para Código E Origem
    if (!codigo || !origem) { 
        resultadoDiv.innerHTML = "<p>Por favor, digite o código SIP e selecione a **Origem** do erro.</p>";
        return; 
    }

    let encontrado = null;
    let categoria = "";
    let diagnosticoEspecifico = null; // Para armazenar as causas/soluções específicas

    for (const key in sipData) {
        if (sipData[key].codes[codigo]) {
            encontrado = sipData[key].codes[codigo];
            categoria = sipData[key].category;
            
            // NOVO: Extrai o bloco de causas/soluções específico (CLIENTE ou SISTEMA)
            diagnosticoEspecifico = encontrado[origem];
            
            break;
        }
    }

    // 3. Resultados
    if (!encontrado) {
        resultadoDiv.innerHTML = `<p>Nenhum resultado encontrado para o código <b>${codigo}</b>.</p>`;
        return;
    }
    
    // NOVO: Trata caso o JSON não tenha as chaves CLIENTE/SISTEMA
    if (!diagnosticoEspecifico) {
        resultadoDiv.innerHTML = `<p>Erro na estrutura do JSON: O código <b>${codigo}</b> não possui diagnóstico específico para a origem <b>${origem}</b>.</p>`;
        return;
    }

    // NOVO: 4. Monta e Exibe o Resultado (usando o objeto 'diagnosticoEspecifico')
    resultadoDiv.innerHTML = `
        <h2>${codigo} - ${encontrado.name}</h2>
        <p><strong>Origem Selecionada:</strong> ${origem === 'CLIENTE' ? 'Lado do Cliente' : 'Lado do Sistema/Servidor'}</p>
        <p><strong>Categoria:</strong> ${categoria}</p>
        <p><strong>Descrição:</strong> ${encontrado.description}</p>
        <p><strong>Significado:</strong> ${encontrado.meaning}</p>
        
        <h3>Causas possíveis (no ${origem}):</h3>
        <ul>${diagnosticoEspecifico.causes.map(c => `<li>${c}</li>`).join("")}</ul>
        
        <h3>Soluções sugeridas (para o ${origem}):</h3>
        <ul>${diagnosticoEspecifico.solutions.map(s => `<li>${s}</li>`).join("")}</ul>
    `;
    
    // Limpeza para melhor usabilidade
    codigoInput.value = '';
    codigoInput.focus();
}
