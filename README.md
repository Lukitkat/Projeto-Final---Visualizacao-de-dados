# Análise da Interferência Estadunidense no Globo

Este projeto é uma visualização de dados interativa que analisa 333 intervenções internacionais dos Estados Unidos, explorando temas como eficácia, geografia, financiamento e impacto histórico.

O objetivo é investigar se a atuação da superpotência se alinha mais com a figura de "herói" ou "vilão" no cenário geopolítico global, utilizando dados provenientes de fontes como o projeto ICB (International Crisis Behavior) e o SIPRI.

## Como executar o projeto

Para visualizar o projeto localmente, basta rodar um servidor HTTP na pasta raiz.

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No seu terminal, execute o comando:
   ```sh
   npx http-server -c-1
   ```
3. Abra o navegador no endereço indicado (geralmente `http://localhost:8080`).

## Estrutura do Projeto

Nesta visualização scrollytelling, você explorará:
- **Panorama Geral**: Visão macro de 333 intervenções.
- **Geografia do Poder**: Distribuição regional dos conflitos (foco em Ásia e Oriente Médio).
- **Escalada vs Redução**: Análise de como a intervenção afetou a tensão.
- **Mapa de Crises**: Densidade de violência e frequência regional.
- **Evolução Histórica**: O impacto das eras geopolíticas (Guerra Fria, Unipolaridade, etc).
- **Fluxo de Dinheiro**: Comparação entre Venda de Armas e Ajuda Humanitária.
- **Impacto na Duração**: As intervenções realmente aceleram o fim das crises?

## Tecnologias Utilizadas

- **HTML5 & CSS3**: Estrutura e design personalizado (Inter & Merriweather fonts).
- **JavaScript (ES6+)**: Lógica da aplicação e transições de scroll.
- **D3.js**: Motor principal da visualização de dados.
- **Observable Runtime**: Integração entre o notebook de dados e o site.

## Autoria e Contexto

Desenvolvido por **Lucas Ferreira da Rocha**, estudante de Engenharia de Computação na **Universidade Federal do Ceará (UFC)**, como projeto final para a disciplina de **Visualização de Dados**.

---
*Dados baseados em: SIPRI, ForeignAssistance.gov, ICB Project e Kaggle.*
