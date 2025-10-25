const express = require('express');
const app = express();

// Rota principal
app.get('/', (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
    return res.send(`
      <h2> Cálculo de Reajuste Salarial</h2>
      <p>Informe os dados na URL conforme o exemplo:</p>
      <code>?idade=35&sexo=F&salario_base=2000&anoContratacao=2015&matricula=12345</code>
    `);
  }

  const idadeNum = parseInt(idade);
  const salario = parseFloat(salario_base);
  const ano = parseInt(anoContratacao);
  const mat = parseInt(matricula);
  const anoAtual = new Date().getFullYear();
  const anosEmpresa = anoAtual - ano;

  if (idadeNum <= 16 || salario <= 0 || ano <= 1960 || mat <= 0) {
    return res.send(`
      <h2> Dados inválidos!</h2>
      <ul>
        <li>Idade deve ser maior que 16.</li>
        <li>Salário deve ser positivo.</li>
        <li>Ano de contratação deve ser maior que 1960.</li>
        <li>Matrícula deve ser maior que zero.</li>
      </ul>
    `);
  }

  let reajuste = 0;
  let desconto = 0;
  let acrescimo = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    reajuste = sexo === 'M' ? 0.10 : 0.08;
    desconto = sexo === 'M' ? 10 : 11;
    acrescimo = sexo === 'M' ? 17 : 16;
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    reajuste = sexo === 'M' ? 0.12 : 0.13;
    desconto = sexo === 'M' ? 5 : 4;
    acrescimo = sexo === 'M' ? 15 : 14;
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    reajuste = sexo === 'M' ? 0.15 : 0.17;
    desconto = sexo === 'M' ? 15 : 17;
    acrescimo = sexo === 'M' ? 13 : 12;
  } else {
    return res.send("<h3>Idade fora das faixas válidas (18 a 99).</h3>");
  }

  let novoSalario = salario + (salario * reajuste);
  novoSalario += anosEmpresa > 10 ? acrescimo : -desconto;

  res.send(`
    <h2> Resultado do Cálculo</h2>
    <p><b>Matrícula:</b> ${mat}</p>
    <p><b>Sexo:</b> ${sexo}</p>
    <p><b>Idade:</b> ${idadeNum}</p>
    <p><b>Anos de Empresa:</b> ${anosEmpresa}</p>
    <p><b>Salário Base:</b> R$ ${salario.toFixed(2)}</p>
    <hr>
    <p><b>Reajuste:</b> ${(reajuste * 100).toFixed(0)}%</p>
    <p><b>${anosEmpresa > 10 ? 'Acréscimo' : 'Desconto'}:</b> R$ ${anosEmpresa > 10 ? acrescimo : desconto}</p>
    <h3> Novo Salário: R$ ${novoSalario.toFixed(2)}</h3>
  `);
});

// Exporta o app para o Vercel usar
module.exports = app;
