function _1(md) {
  return (
    md`# Projeto Visualização de Dados
`
  )
}

async function _2(FileAttachment, d3) {
  // Configuração visual
  const width = 900; // Um pouco mais largo para a separação
  const height = 600;
  const radius = 5;

  // Dados
  const rawData = await FileAttachment("dados_icb_observable (1).json").json();
  const geoData = await FileAttachment("dados_geografia_full.json").json();

  // Mapa de regiões para mesclagem
  const geoMap = new Map(geoData.map(d => [d.nome, d.region]));

  const colorScaleRegions = {
    "Americas": "#2ca02c",      // Verde
    "Europe": "#1f77b4",        // Azul
    "Africa": "#ff7f0e",        // Laranja
    "Middle East": "#d62728",   // Vermelho
    "Asia": "#9467bd",          // Roxo
    "Other": "#7f7f7f"          // Outros (Cinza)
  };

  const data = rawData.map(d => {
    const isIneffective = d.status === "Ineficaz/Escalada";
    const region = geoMap.get(d.nome) || "Other";
    return {
      ...d,
      region: region,
      category: isIneffective ? "ineffective" : "effective",
      colorStatus: isIneffective ? "#dc2626" : "#2563eb",
      colorRegion: colorScaleRegions[region] || "#ccc",
      r: radius
    };
  });

  // Configuração dos Clusters Geográficos
  const regions = ["Americas", "Europe", "Africa", "Middle East", "Asia"];
  const regionAngle = {};
  regions.forEach((r, i) => {
    regionAngle[r] = (i / regions.length) * 2 * Math.PI;
  });

  const clusterOrbit = 150; // Raio da órbita dos clusters


  // Estatísticas
  const total = data.length;
  const ineficazes = data.filter(d => d.category === "ineffective").length;
  const eficazes = total - ineficazes;

  // SVG
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; background: transparent; font-family: 'Inter', sans-serif;");

  // Elementos

  // Passo 1: Panorama
  const groupPanorama = svg.append("g").attr("class", "state-1");

  groupPanorama.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-weight", "900")
    .attr("font-size", "32px")
    .attr("fill", "#1e293b")
    .text("Panorama Geral das Intervenções");

  groupPanorama.append("text")
    .attr("x", width / 2)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("fill", "#64748b")
    .text(`333 casos registrados de intervenções EUA`);

  // Legenda (Passo 1)
  const legendState1 = groupPanorama.append("g")
    .attr("transform", `translate(${width / 2}, 140)`); // Centralizado abaixo do subtítulo

  // Item Azul (Eficaz)
  legendState1.append("circle").attr("cx", -165).attr("cy", 0).attr("r", 6).attr("fill", "#2563eb");
  legendState1.append("text").attr("x", -150).attr("y", 5).text(`Eficazes (${eficazes})`).attr("font-size", "14px").attr("fill", "#334155").attr("font-weight", "600");

  // Item Vermelho (Ineficaz)
  legendState1.append("circle").attr("cx", 25).attr("cy", 0).attr("r", 6).attr("fill", "#dc2626");
  legendState1.append("text").attr("x", 40).attr("y", 5).text(`Ineficazes (${ineficazes})`).attr("font-size", "14px").attr("fill", "#334155").attr("font-weight", "600");

  // Passo 2: Escalada
  const groupEscalada = svg.append("g").attr("class", "state-2").attr("opacity", 0);

  groupEscalada.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-weight", "900")
    .attr("font-size", "32px")
    .attr("fill", "#1e293b")
    .text("Escalada vs Redução da Tensão");

  groupEscalada.append("text")
    .attr("x", width / 2)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("fill", "#64748b")
    .text("Impacto das intervenções EUA");

  // Rótulos dos agrupamentos (Passo 2)
  // Redução (Azul) - Esquerda (30%)
  groupEscalada.append("text")
    .attr("x", width * 0.30)
    .attr("y", height - 50)
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", "22px")
    .attr("fill", "#2563eb")
    .text("REDUÇÃO");

  groupEscalada.append("text")
    .attr("x", width * 0.30)
    .attr("y", height - 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "#64748b")
    .text(`${eficazes} casos`);

  // Escalada (Vermelho) - Direita (70%)
  groupEscalada.append("text")
    .attr("x", width * 0.70)
    .attr("y", height - 50)
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", "22px")
    .attr("fill", "#dc2626")
    .text("ESCALADA");

  groupEscalada.append("text")
    .attr("x", width * 0.70)
    .attr("y", height - 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "#64748b")
    .text(`${ineficazes} casos`);

  // Passo 3: Geografia
  const groupGeografia = svg.append("g").attr("class", "state-3").attr("opacity", 0);

  groupGeografia.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-family", "Inter, sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "32px") // Padronizado para 32px
    .attr("fill", "#1e293b")
    .text("Distribuição Geográfica");

  groupGeografia.append("text")
    .attr("x", width / 2)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("fill", "#64748b")
    .text("Distribuição de crises EUA pelo mundo");

  // Legenda (Passo 3)
  const legendState3 = groupGeografia.append("g")
    .attr("transform", `translate(${width - 200}, 180)`); // Ajuste de posição vertical

  const regionCounts = {};
  data.forEach(d => { regionCounts[d.region] = (regionCounts[d.region] || 0) + 1; });

  const sortedRegions = Object.keys(colorScaleRegions)
    .filter(r => regionCounts[r] > 0)
    .sort((a, b) => regionCounts[b] - regionCounts[a]);

  sortedRegions.forEach((region, i) => {
    const row = legendState3.append("g").attr("transform", `translate(0, ${i * 35})`);
    row.append("circle").attr("r", 7).attr("fill", colorScaleRegions[region]).attr("cy", -5);
    row.append("text").attr("x", 15).text(region).attr("font-family", "Inter, sans-serif").attr("font-weight", "bold").attr("font-size", "13px").attr("fill", "#333");
    row.append("text").attr("x", 15).attr("dy", "1.3em").text(`${regionCounts[region]} casos`).attr("font-family", "Inter, sans-serif").attr("font-size", "12px").attr("fill", "#666");
  });


  // Simulação de forças
  const simulation = d3.forceSimulation(data)
    .force("charge", d3.forceManyBody().strength(-3))
    .force("collide", d3.forceCollide().radius(d => d.r + 2).strength(0.8));

  // Nós (Círculos)
  const node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", d => d.r)
    .attr("r", d => d.r)
    .attr("fill", d => d.colorStatus) // Começa com cor de Status
    .attr("stroke", "white")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5);

  node.on("mouseover", (event, d) => {
    const tooltip = document.querySelector(".custom-tooltip");
    tooltip.style.opacity = 1;
    tooltip.innerHTML = `<strong>${d.nome}</strong>Resultado: ${d.status}`;
    tooltip.style.left = `${event.pageX}px`;
    tooltip.style.top = `${event.pageY}px`;
  })
    .on("mousemove", (event) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mouseout", () => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 0;
    });

  simulation.on("tick", () => {
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });

  // Função de atualização (controlada pelo App)
  // Altera o estado da visualização
  svg.node().update = function (step) {
    if (step === 1) {
      // PASSO 1: Agrupamento Central
      simulation
        .force("x", d3.forceX(width / 2).strength(0.08))
        .force("y", d3.forceY(350).strength(0.08));

      // Animação UI
      groupPanorama.transition().duration(1000).attr("opacity", 1);
      groupEscalada.transition().duration(1000).attr("opacity", 0);
      groupGeografia.transition().duration(1000).attr("opacity", 0);

      // Cor por status
      node.transition().duration(800).attr("fill", d => d.colorStatus);

    } else if (step === 2) {
      // PASSO 2: Agrupamento Geográfico
      simulation
        .force("x", d3.forceX(d => {
          if (!regionAngle[d.region]) return width / 2;
          return (width / 2) + Math.cos(regionAngle[d.region]) * clusterOrbit;
        }).strength(0.08))
        .force("y", d3.forceY(d => {
          if (!regionAngle[d.region]) return 390; // Ajuste de posição vertical
          return (390) + Math.sin(regionAngle[d.region]) * clusterOrbit;
        }).strength(0.08));

      // Animação UI
      groupPanorama.transition().duration(1000).attr("opacity", 0);
      groupEscalada.transition().duration(1000).attr("opacity", 0);
      groupGeografia.transition().duration(1000).attr("opacity", 1);

      // Cor por região
      node.transition().duration(800).attr("fill", d => d.colorRegion);

    } else if (step === 3) {
      // PASSO 3: Agrupamento por Escalada/Redução
      simulation
        .force("x", d3.forceX(d => d.category === "ineffective" ? width * 0.70 : width * 0.30).strength(0.08))
        .force("y", d3.forceY(350).strength(0.08));

      // Animação UI
      groupPanorama.transition().duration(1000).attr("opacity", 0);
      groupEscalada.transition().duration(1000).attr("opacity", 1);
      groupGeografia.transition().duration(1000).attr("opacity", 0);

      // Cor por status
      node.transition().duration(800).attr("fill", d => d.colorStatus);
    }

    // "Esquenta" a simulação para mover as bolinhas
    simulation.alpha(1).restart();
  };

  // Inicializa no Estado 1
  svg.node().update(1);

  return svg.node();
}

function _3() {
  // Placeholder para o Passo 2
  // Reutiliza o gráfico do Passo 1
  const div = document.createElement("div");
  div.style.display = "none";
  return div;
}


async function _4() {
  // Placeholder para o Passo 3
  // Reutiliza o gráfico do Passo 1
  const div = document.createElement("div");
  div.style.display = "none";
  return div;
}


function _data(FileAttachment) {
  return (
    FileAttachment("fluxo_eua_regioes.json").json()
  )
}

function _d3(require) {
  return (
    require("d3@7", "d3-sankey@0.12")
  )
}

function _topojson(require) {
  return (
    require("topojson-client@3")
  )
}

function _Plot(require) {
  return (
    require("@observablehq/plot@0.6")
  )
}

function _md(require) {
  return (
    require("@observablehq/stdlib").then(stdlib => stdlib.md)
  )
}

function _chart(d3, data) {
  // Configuração e Estilo
  const width = 970; // Largura aumentada para labels
  const height = 600;
  const nodeWidth = 20;
  const nodePadding = 50;

  const marginLeft = 200; // Margem para labels da esquerda
  const marginRight = 330; // Margem para evitar corte de texto
  const marginTop = 160; // Padronização de margem superior
  const marginBottom = 70; // Espaçamento inferior

  const formatNumber = d3.format(",.0f");
  const formatCurrency = d => `${formatNumber(d)} Mi USD`;

  const theme = {
    arms: "#D32F2F",
    aid: "#1976D2",
    dest: "#546E7A",
    textMain: "#263238",
    textLight: "#90A4AE",
    background: "#FFFFFF"
  };

  // Processamento de dados

  // Filtro de não identificados
  const links = data
    .filter(d => d.Target !== "Outros / Não Identificado" && d.Target !== "Unknown")
    .map(d => Object.assign({}, d));

  const nodes = Array.from(
    new Set(links.flatMap(l => [l.Source, l.Target])),
    name => ({ name, category: name })
  );

  const nodeMap = new Map(nodes.map((d, i) => [d.name, i]));

  const sankeyData = {
    nodes: nodes,
    links: links.map(d => ({
      source: nodeMap.get(d.Source),
      target: nodeMap.get(d.Target),
      value: d.Amount
    }))
  };

  const sankey = d3.sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]]);

  const { nodes: graphNodes, links: graphLinks } = sankey(sankeyData);

  // SVG
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("width", "100%")
    .style("height", "auto")
    .style("background", "transparent")
    .style("font-family", "'Inter', sans-serif");

  // (Removida a seção de <defs> e gradientes que existia aqui)

  // Desenho do gráfico

  // Título principal
  const titleGroup = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("text-anchor", "middle")
    .style("font-size", "32px") // Padronizado para 32px
    .style("font-weight", "700")
    .style("fill", theme.textMain);

  titleGroup.append("tspan")
    .attr("x", width / 2)
    .attr("dy", "0")
    .text("Venda de Armas vs Ajuda Humanitária");

  // Cabeçalho Origem
  svg.append("text")
    .attr("x", marginLeft) // Margem esquerda
    .attr("y", marginTop - 20)
    .attr("text-anchor", "start") // Alinhado à esquerda
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", theme.textLight)
    .style("text-transform", "uppercase")
    .text("ORIGEM");

  // Cabeçalho Destino
  svg.append("text")
    .attr("x", width - marginRight + 20)
    .attr("y", marginTop - 20)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", theme.textLight)
    .style("text-transform", "uppercase")
    .text("DESTINO (REGIÃO)");

  // Fluxos (Sankey)
  svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5) // Opacidade fixa das conexões
    .selectAll("path")
    .data(graphLinks)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    // Cor: Vermelho para Armas, Azul para Ajuda
    .attr("stroke", d => d.source.name.includes("Armas") ? theme.arms : theme.aid)
    .attr("stroke-width", d => Math.max(1, d.width))
    .style("mix-blend-mode", "multiply") // Mesclagem das cores
    .on("mouseover", (event, d) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 1;
      const val = d3.format(",.0f")(d.value);
      tooltip.innerHTML = `<strong>${d.source.name} → ${d.target.name}</strong>${val} Mi USD`;
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mousemove", (event) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mouseout", () => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 0;
    });

  // Nós (Barras verticais)
  svg.append("g")
    .selectAll("rect")
    .data(graphNodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => {
      if (d.name.includes("Armas")) return theme.arms;
      if (d.name.includes("Humanitária")) return theme.aid;
      return theme.dest;
    })
    .attr("rx", 3)
    .on("mouseover", (event, d) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 1;
      const val = d3.format(",.0f")(d.value);
      tooltip.innerHTML = `<strong>${d.name}</strong>Total: ${val} Mi USD`;
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mousemove", (event) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mouseout", () => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 0;
    });

  // Rótulos (Labels)

  const labels = svg.append("g")
    .style("font-family", "'Inter', sans-serif");

  labels.selectAll("text")
    .data(graphNodes)
    .join("text")
    .each(function (d) {
      const el = d3.select(this);
      const isSource = d.x0 < width / 2;

      if (isSource) {
        // ORIGEM (Esquerda)
        el.attr("text-anchor", "end")
          .attr("x", d.x0 - 15)
          .attr("y", (d.y1 + d.y0) / 2 - 10);

        el.append("tspan")
          .style("font-weight", "bold")
          .style("font-size", "14px")
          .style("fill", d.name.includes("Armas") ? theme.arms : theme.aid)
          .text(d.name.replace(" (EUA)", "").toUpperCase());

        el.append("tspan")
          .attr("x", d.x0 - 15)
          .attr("dy", "1.4em")
          .style("font-weight", "800")
          .style("font-size", "20px")
          .style("fill", theme.textMain)
          .text(formatCurrency(d.value));

      } else {
        // DESTINO (Direita)
        el.attr("text-anchor", "start")
          .attr("x", d.x1 + 10)
          .attr("y", (d.y1 + d.y0) / 2)
          .attr("dy", "0.35em");

        el.append("tspan")
          .style("font-weight", "600")
          .style("fill", theme.textMain)
          .style("font-size", "13px")
          .text(d.name);

        el.append("tspan")
          .style("fill", theme.textLight)
          .style("font-size", "12px")
          .text(`  ${formatCurrency(d.value)}`);
      }
    });

  // Legenda
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height - 20})`); // Rodapé centralizado

  // Grupo Armas (Esquerda)
  const lgArms = legendGroup.append("g")
    .attr("transform", "translate(-150, 0)"); // Posição à esquerda

  lgArms.append("circle")
    .attr("r", 6)
    .attr("fill", theme.arms);

  lgArms.append("text")
    .attr("x", 10)
    .attr("y", 4)
    .text("Venda de Armas")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("fill", "#555")
    .style("font-family", "'Inter', sans-serif");

  // Grupo Ajuda (Direita)
  const lgAid = legendGroup.append("g")
    .attr("transform", "translate(50, 0)"); // Posição à direita

  lgAid.append("circle")
    .attr("r", 6)
    .attr("fill", theme.aid);

  lgAid.append("text")
    .attr("x", 10)
    .attr("y", 4)
    .text("Ajuda Humanitária")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("fill", "#555")
    .style("font-family", "'Inter', sans-serif");

  return svg.node();
}


function _data2(FileAttachment) {
  return (
    FileAttachment("crises_geograficas.json").json()
  )
}

function _world(FileAttachment) {
  return (
    FileAttachment("countries-110m.json").json()
  )
}

function _land(topojson, world) {
  return (
    topojson.feature(world, world.objects.land)
  )
}


function _11(d3, topojson, world, data2) {
  // Configuração do mapa
  const width = 1920;
  const height = 1150; // Altura aumentada para legenda
  const margin = { top: 180, right: 30, bottom: 350, left: 30 }; // Margens padronizadas

  // Projeção
  const projection = d3.geoEqualEarth()
    .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], { type: "Sphere" })
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  // Escalas
  const colorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([1, 4]);

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(data2, d => d.Crises_Count)])
    .range([15, 90]); // Círculos ampliados para visibilidade

  // SVG
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; background: transparent; font-family: 'Inter', sans-serif;");

  // Título e Subtítulo
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "54px") // Tamanho padrão grande
    .attr("font-weight", "900")
    .attr("fill", "#1e293b")
    .text("Mapa de violência");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "28px")
    .attr("fill", "#64748b")
    .text("Frequência e Intensidade da Violência por Região");

  // Grupo principal
  const g = svg.append("g")
    .attr("transform", `translate(0, ${margin.top})`);

  // Esfera de fundo (oceano)
  g.append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", "#f8fafc")
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 2);

  // Países
  const land = topojson.feature(world, world.objects.land);
  g.append("path")
    .datum(land)
    .attr("d", path)
    .attr("fill", "#e2e8f0")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1.5);

  // Pontos de crise
  const dots = g.selectAll("circle")
    .data(data2)
    .join("circle")
    .attr("cx", d => {
      const coords = projection([d.Lon, d.Lat]);
      return coords ? coords[0] : 0;
    })
    .attr("cy", d => {
      const coords = projection([d.Lon, d.Lat]);
      return coords ? coords[1] : 0;
    })
    .attr("r", d => radiusScale(d.Crises_Count))
    .attr("fill", d => colorScale(d.Avg_Violence))
    .attr("fill-opacity", 0.85)
    .attr("stroke", "#7f1d1d")
    .attr("stroke-width", 2);

  // Tooltip
  dots.on("mouseover", (event, d) => {
    const tooltip = document.querySelector(".custom-tooltip");
    tooltip.style.opacity = 1;
    tooltip.innerHTML = `<strong>${d.Region_Name}</strong>Crises: ${d.Crises_Count}<br>Violência: ${d.Avg_Violence.toFixed(1)}`;
    tooltip.style.left = `${event.pageX}px`;
    tooltip.style.top = `${event.pageY}px`;
  })
    .on("mousemove", (event) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mouseout", () => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 0;
    });

  // Rótulos para regiões com muitas crises
  g.selectAll("text.label")
    .data(data2.filter(d => d.Crises_Count > 15))
    .join("text")
    .attr("class", "label")
    .attr("x", d => {
      const coords = projection([d.Lon, d.Lat]);
      return coords ? coords[0] : 0;
    })
    .attr("y", d => {
      const coords = projection([d.Lon, d.Lat]);
      return coords ? coords[1] - radiusScale(d.Crises_Count) - 15 : 0;
    })
    .attr("text-anchor", "middle")
    .attr("font-size", "22px")
    .attr("font-weight", "800")
    .attr("fill", "#0f172a")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 5)
    .attr("paint-order", "stroke")
    .text(d => d.Region_Name);

  // Legenda de cores e violência
  const legendWidth = 400;
  const legendHeight = 35;
  const legendX = width - legendWidth - 60;
  const legendY = height - 360; // Ajuste de posição vertical

  // Gradiente
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(1));
  gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", colorScale(2.5));
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(4));

  // Barra de legenda
  svg.append("rect")
    .attr("x", legendX)
    .attr("y", legendY)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", "url(#legend-gradient)")
    .attr("rx", 6)
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 1.5);

  // Título da legenda - FONTE MASSIVA
  svg.append("text")
    .attr("y", legendY - 15) // Título da legenda
    .attr("text-anchor", "middle") // Centralizado
    .attr("font-size", "24px")
    .attr("font-weight", "800")
    .attr("fill", "#334155")
    .text("Nível de Violência");

  // Labels da legenda - Apenas Números
  const levels = [1, 2, 3, 4];
  levels.forEach((lvl, i) => {
    svg.append("text")
      .attr("x", legendX + (i * (legendWidth / 3))) // Distribui em 0, 1/3, 2/3, 1
      .attr("y", legendY + legendHeight + 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "22px")
      .attr("font-weight", "600")
      .attr("fill", "#475569")
      .text(lvl);
  });

  // Legenda de tamanho (Total de crises)
  const sizeLegendX = legendX + legendWidth / 2; // Centralizado com a barra de cima
  const sizeLegendY = legendY + legendHeight + 160; // Posição vertical abaixo da barra de cores

  svg.append("text")
    .attr("x", sizeLegendX)
    .attr("y", sizeLegendY - 80) // Ajuste de posição do título
    .attr("text-anchor", "middle")
    .attr("font-size", "22px")
    .attr("font-weight", "800")
    .attr("fill", "#334155")
    .text("Total de Crises");

  // Círculos de exemplo
  const sizes = [15, 30, 60]; // Ex: Pequeno, Médio, Grande
  const sizeLabels = ["15", "30", "60+"];

  sizes.forEach((val, i) => {
    const r = radiusScale(val);
    const cx = sizeLegendX + (i - 1) * 100; // Espaçamento horizontal

    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", sizeLegendY + 20) // Base alinhada
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", "#475569")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4");

    svg.append("text")
      .attr("x", cx)
      .attr("y", sizeLegendY + r + 35) // Label abaixo do círculo
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "600")
      .attr("fill", "#64748b")
      .text(sizeLabels[i]);
  });

  return svg.node();
}

function _data3(FileAttachment) {
  return (
    FileAttachment("uspace_data.json").json()
  )
}

function _13(d3, data3) {
  // Configuração (Bar Chart)
  const width = 1920;
  const height = 950;
  const margin = { top: 140, right: 50, bottom: 160, left: 150 }; // Margem superior padronizada

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; background: transparent; font-family: 'Inter', sans-serif;");

  // Escalas
  const x = d3.scaleBand()
    .domain(data3.map(d => d.Label))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data3, d => d.Frequency) * 1.1]) // 10% de folga no topo
    .range([height - margin.bottom, margin.top]); // Gráfico invertido para escala Y

  // Eixos
  // Eixo X
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select(".domain").remove())
    .selectAll("text")
    .attr("font-size", "28px") // Rótulos grandes
    .attr("font-weight", "bold")
    .attr("dy", "1.5em")
    .attr("fill", "#334155");

  // Eixo Y
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-width + margin.left + margin.right)) // Grid lines
    .call(g => g.select(".domain").remove()) // Remove linha do eixo
    .call(g => g.selectAll(".tick line")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-dasharray", "5,5")) // Linhas pontilhadas
    .selectAll("text")
    .attr("font-size", "24px")
    .attr("fill", "#64748b");

  // Barras
  svg.append("g")
    .selectAll("rect")
    .data(data3)
    .join("rect")
    .attr("x", d => x(d.Label))
    .attr("y", d => y(d.Frequency))
    .attr("height", d => y(0) - y(d.Frequency))
    .attr("width", x.bandwidth())
    // Lógica de cor: Azul para "Acelerou", Vermelho para o resto
    .attr("fill", d => d.Label === "Acelerou o Término" ? "#2563eb" : "#dc2626")
    .attr("rx", 8) // Arredondamento das barras
    .on("mouseover", (event, d) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 1;
      tooltip.innerHTML = `<strong>${d.Label}</strong>Impacto: ${d.Frequency}`;
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mousemove", (event) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mouseout", () => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 0;
    });

  // Rótulos de Valor (no topo das barras)
  svg.append("g")
    .selectAll("text")
    .data(data3)
    .join("text")
    .attr("x", d => x(d.Label) + x.bandwidth() / 2)
    .attr("y", d => y(d.Frequency) - 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "36px")
    .attr("font-weight", "bold")
    .attr("fill", "#1e293b")
    .text(d => d.Frequency);

  // Título
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "54px") // Tamanho padrão grande
    .attr("font-weight", "900")
    .attr("fill", "#1e293b")
    .text("Impacto da Atividade dos EUA na Duração da Crise");

  // Legenda (Positivo vs Negativo)
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height - 80})`); // Rodapé centralizado

  // Grupo Positivo (Esquerda)
  const lgPos = legendGroup.append("g")
    .attr("transform", "translate(-250, 0)"); // Mais para esquerda (-150 -> -250)

  lgPos.append("circle")
    .attr("r", 8) // Marcador da legenda
    .attr("fill", "#2563eb"); // Azul

  lgPos.append("text")
    .attr("x", 15)
    .attr("y", 6)
    .text("Resultado positivo")
    .style("font-size", "22px") // Fonte legível
    .style("font-weight", "600")
    .style("fill", "#555")
    .style("font-family", "'Inter', sans-serif");

  // Grupo Negativo (Direita)
  const lgNeg = legendGroup.append("g")
    .attr("transform", "translate(100, 0)"); // Mais para direita (50 -> 100)

  lgNeg.append("circle")
    .attr("r", 8)
    .attr("fill", "#dc2626"); // Vermelho

  lgNeg.append("text")
    .attr("x", 15)
    .attr("y", 6)
    .text("Resultado negativo")
    .style("font-size", "22px")
    .style("font-weight", "600")
    .style("fill", "#555")
    .style("font-family", "'Inter', sans-serif");

  return svg.node();
}

function _data4(FileAttachment) {
  return (
    FileAttachment("us_crises_periods.json").json()
  )
}

function _15(d3, data4) {
  // Configuração (Line Chart)
  const width = 1920;
  const height = 950;
  const margin = { top: 180, right: 100, bottom: 200, left: 100 }; // Top para 180px

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; background: transparent; font-family: 'Inter', sans-serif;");

  // Processamento de dados
  const processedData = data4.map(d => {
    let desc = d.period_desc;
    if (desc.includes("Period 6")) desc = "Present";
    if (desc.includes("Unipolarity (1990-)")) desc = "Unipolarity (1990-2005)";
    return { ...d, period_desc: desc };
  });

  // Agrupar por tipo de atividade para desenhar linhas separadas
  const activityTypes = Array.from(new Set(processedData.map(d => d.activity_type)));
  const groupedData = d3.group(processedData, d => d.activity_type);

  // Ordenar domínio X corretamente (usando o campo 'period' para sort)
  const xDomain = d3.sort(processedData, d => d.period).map(d => d.period_desc);
  const xDomainUnique = Array.from(new Set(xDomain));

  // Escalas
  const x = d3.scalePoint()
    .domain(xDomainUnique)
    .range([margin.left, width - margin.right])
    .padding(0.5);

  const y = d3.scaleLinear()
    .domain([0, d3.max(processedData, d => d.Quantidade) * 1.15])
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal()
    .domain(["Militar (Direta/Encoberta)", "Política/Econômica"])
    .range(["#dc2626", "#2563eb"]); // Vermelho vs Azul

  // Eixos
  // Eixo X
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(15))
    .call(g => g.select(".domain").attr("stroke-width", 2).attr("stroke", "#94a3b8"))
    .selectAll("text")
    .attr("font-size", "20px") // Rótulos do eixo X
    .attr("font-weight", "600")
    .attr("fill", "#334155")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, 10)"); // Ajuste vertical

  // Eixo Y
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(8).tickSize(-width + margin.left + margin.right))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-dasharray", "5,5"))
    .selectAll("text")
    .attr("font-size", "20px")
    .attr("fill", "#64748b");

  // Linhas
  const line = d3.line()
    .x(d => x(d.period_desc))
    .y(d => y(d.Quantidade))
    .curve(d3.curveMonotoneX); // Curva suavizada

  svg.append("g")
    .selectAll("path")
    .data(groupedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", ([type]) => color(type))
    .attr("stroke-width", 6) // Espessura da linha
    .attr("d", ([_, values]) => line(values));

  // Pontos
  svg.append("g")
    .selectAll("circle")
    .data(processedData)
    .join("circle")
    .attr("cx", d => x(d.period_desc))
    .attr("cy", d => y(d.Quantidade))
    .attr("r", 9) // Marcadores de ponto
    .attr("fill", "#ffffff")
    .attr("stroke", d => color(d.activity_type))
    .attr("stroke-width", 4)
    .on("mouseover", (event, d) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 1;
      tooltip.innerHTML = `<strong>${d.period_desc}</strong>${d.activity_type}<br>Quantidade: ${d.Quantidade}`;
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mousemove", (event) => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    })
    .on("mouseout", () => {
      const tooltip = document.querySelector(".custom-tooltip");
      tooltip.style.opacity = 0;
    });

  // Rótulos de Valor (acima dos pontos)
  svg.append("g")
    .selectAll("text")
    .data(processedData)
    .join("text")
    .attr("x", d => x(d.period_desc))
    .attr("y", d => y(d.Quantidade) - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "22px")
    .attr("font-weight", "bold")
    .attr("fill", "#1e293b")
    .text(d => d.Quantidade);

  // Título
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "54px") // Tamanho padrão grande
    .attr("font-weight", "900")
    .attr("fill", "#1e293b")
    .text("Envolvimento dos EUA por Era Geopolítica");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "28px")
    .attr("fill", "#64748b")
    .text("Evolução das crises internacionais (ICB)");

  // Legenda
  const legendX = width - 400;
  const legendY = 150;
  const legend = svg.append("g")
    .attr("transform", `translate(${legendX}, ${legendY})`);

  activityTypes.forEach((type, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 40})`);

    row.append("line")
      .attr("x1", 0).attr("x2", 40)
      .attr("y1", 0).attr("y2", 0)
      .attr("stroke", color(type))
      .attr("stroke-width", 6);

    row.append("circle")
      .attr("cx", 20).attr("cy", 0)
      .attr("r", 9)
      .attr("fill", "white")
      .attr("stroke", color(type))
      .attr("stroke-width", 4);

    row.append("text")
      .attr("x", 55)
      .attr("y", 8)
      .attr("font-size", "24px")
      .attr("font-weight", "600")
      .attr("fill", "#475569")
      .text(type);
  });

  return svg.node();
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["dados_escalada_eua.json", { url: new URL("./files/2da39af540ab1f8cd661a671c38b1571ec53f7e327eccb388288f1b390f42ec6a920e7453a3f273bfd9c539c8d72ea416f09bd3cdef11d4ef38862e94912fbc4.json", import.meta.url), mimeType: "application/json", toString }],
    ["dados_geografia_full.json", { url: new URL("./files/0b797bdf231a72317f7232eeb89898d7f7aeb0c2d9808789c4f6048d70c52797d7a05bc1eff3250025ba6ad16814d8629d26ed2fed42deceb8bb9f38b171415e.json", import.meta.url), mimeType: "application/json", toString }],
    ["dados_icb_observable (1).json", { url: new URL("./files/56fa38d1cceca2f2d09f048960a2c0caf7647c81e59627879b24bd267ffee457a85594f31bdc192e1379966be050f8eec5ff563ef0273061b87adeaca8f52d36.json", import.meta.url), mimeType: "application/json", toString }],
    ["crises_geograficas.json", { url: new URL("./files/7a8812ad0b35258cc96d0e48803dd43bc77fcea3d2a3044cc2e933c3c3544ff818bab9fce7742473692b8ec0c46bf2f30e099da85d48fa92d903760f6d0e378b.json", import.meta.url), mimeType: "application/json", toString }],
    ["fluxo_eua_regioes.json", { url: new URL("./files/84f7eafbc503a9e4e48d19f3bf10dc6b17ebaf38e334e61a74899495726932884aa00824d39064d49e1dfcf08621d92abe859da956b442dc830ad6f8c0f8090c.json", import.meta.url), mimeType: "application/json", toString }],
    ["uspace_data.json", { url: new URL("./files/e30b22cd4ef3df90bab13b56d07b1ac2edf59884d71f8e73a1f1bb00487de076128af6192c44187d1c59db5b4c3275cee279103b962ed268d8e1441b551b2cbc.json", import.meta.url), mimeType: "application/json", toString }],
    ["us_crises_periods.json", { url: new URL("./files/050510e9d4a55a12e1bd3f262185fa2ab869dc8d19e77c0c0348afe6c5d4b5697ecb75291da1d047ae28453bac73410f951092aa39b156a5764faf2bd602249a.json", import.meta.url), mimeType: "application/json", toString }],
    ["countries-110m.json", { url: new URL("./files/countries-110m.json", import.meta.url), mimeType: "application/json", toString }]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("panorama")).define("panorama", ["FileAttachment", "d3"], _2);
  main.variable(observer("escalada")).define("escalada", ["FileAttachment", "d3"], _3);
  main.variable(observer("geografia")).define("geografia", ["FileAttachment", "d3"], _4);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("Plot")).define("Plot", ["require"], _Plot);
  main.variable(observer("md")).define("md", ["require"], _md);
  main.variable(observer("chart")).define("chart", ["d3", "data"], _chart);
  main.variable(observer("data2")).define("data2", ["FileAttachment"], _data2);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson", "world"], _land);
  main.variable(observer("map")).define("map", ["d3", "topojson", "world", "data2"], _11);
  main.variable(observer("data3")).define("data3", ["FileAttachment"], _data3);
  main.variable(observer("barChart")).define("barChart", ["d3", "data3"], _13);
  main.variable(observer("data4")).define("data4", ["FileAttachment"], _data4);
  main.variable(observer("lineChart")).define("lineChart", ["d3", "data4"], _15);
  return main;
}
