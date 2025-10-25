import express from 'express';
const host = '0.0.0.0';
const porta = 3000;

const server = express();

// Página inicial simples
server.get('/', (req, res) => {
    res.send(`
        <body style="font-family: Arial; text-align: center;">
            <h1>Sistema de Reajuste Salarial</h1>
            <p>Use a rota <b>/calcular</b> com os parâmetros abaixo:</p>
            <code>?matricula=123&nome=Matheus&idade=25&salario=2500&anoContratacao=2020</code>
        </body>
    `);
});

// Rota principal da atividade
server.get('/calcular', (req, res) => {
    const { matricula, nome, idade, salario, anoContratacao } = req.query;

    // Verificação de preenchimento
    if (!matricula || !nome || !idade || !salario || !anoContratacao) {
        return res.send(`
            <body style="font-family: Arial; text-align:center; color:red;">
                <h1>Erro</h1>
                <p>Todos os parâmetros devem ser informados:</p>
                <code>?matricula=123&nome=Matheus&idade=25&salario=2500&anoContratacao=2020</code>
            </body>
        `);
    }

    // Conversão numérica
    const idadeNum = parseInt(idade);
    const salarioNum = parseFloat(salario);
    const anoNum = parseInt(anoContratacao);
    const anoAtual = new Date().getFullYear();

    // Validações lógicas
    if (isNaN(idadeNum) || isNaN(salarioNum) || isNaN(anoNum) || idadeNum <= 0 || salarioNum <= 0 || anoNum > anoAtual) {
        return res.send(`
            <body style="font-family: Arial; text-align:center; color:red;">
                <h1>Dados inválidos</h1>
                <p>Verifique se idade, salário e ano de contratação estão corretos.</p>
            </body>
        `);
    }

    // Cálculo do reajuste
    let reajuste = 0;
    const tempoEmpresa = anoAtual - anoNum;

    if (tempoEmpresa >= 10) {
        reajuste = 0.20;
    } else if (tempoEmpresa >= 5) {
        reajuste = 0.10; 
    } else {
        reajuste = 0.05; 
    }

    const novoSalario = salarioNum + (salarioNum * reajuste);

    // Envio da resposta em HTML
    res.send(`
        <body style="font-family: Arial; margin: 40px;">
            <h1>Resultado do Cálculo</h1>
            <table border="1" cellpadding="10" cellspacing="0" style="margin:auto; border-collapse: collapse;">
                <tr><th>Matrícula</th><td>${matricula}</td></tr>
                <tr><th>Nome</th><td>${nome}</td></tr>
                <tr><th>Idade</th><td>${idadeNum} anos</td></tr>
                <tr><th>Ano de Contratação</th><td>${anoNum}</td></tr>
                <tr><th>Tempo de Empresa</th><td>${tempoEmpresa} anos</td></tr>
                <tr><th>Salário Atual</th><td>R$ ${salarioNum.toFixed(2)}</td></tr>
                <tr><th>Reajuste</th><td>${(reajuste * 100).toFixed(0)}%</td></tr>
                <tr><th><b>Novo Salário</b></th><td><b>R$ ${novoSalario.toFixed(2)}</b></td></tr>
            </table>
            <p style="text-align:center; margin-top:20px;">
                <a href="/">Voltar à Página Inicial</a>
            </p>
        </body>
    `);
});

server.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
});