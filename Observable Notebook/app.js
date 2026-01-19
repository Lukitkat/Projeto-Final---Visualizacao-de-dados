import { Runtime, Inspector } from "./runtime.js";
import define from "./b4dfe7fe06dcb992@173.js";

// Estado global
// Armazena referências para as DIVs de cada visualização
const containers = {};

// Mapeia passos para células do notebook
const STEP_MAP = {
    1: "panorama",    // Panorama (Bolhas)
    2: "escalada",    // Escalada (Bolhas)
    3: "geografia",   // Geografia (Bolhas)
    4: "map",         // Mapa
    5: "lineChart",   // Gráfico de Linha
    6: "chart",       // Sankey
    7: "barChart"     // Gráfico de Barras
};

// Configuração do DOM
const mainContainer = document.getElementById("viz-container");
mainContainer.style.position = "relative";
mainContainer.style.width = "100%";
mainContainer.style.height = "100%";

// Configuração global do tooltip
const tooltip = document.createElement("div");
tooltip.className = "custom-tooltip";
document.body.appendChild(tooltip);

// Cria contêineres para cada passo para permitir troca rápida
Object.keys(STEP_MAP).forEach(step => {
    const div = document.createElement("div");
    // Estilo para sobreposição
    Object.assign(div.style, {
        position: "absolute",
        top: "0", left: "0",
        width: "100%", height: "100%",
        display: "flex", justifyContent: "center", alignItems: "center",
        opacity: "0", // Escondido por padrão
        transform: "translateY(30px) scale(0.98)", // Começa levemente deslocado e menor
        pointerEvents: "none",
        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)" // Easing suave
    });

    div.id = `viz-step-${step}`;
    mainContainer.appendChild(div);
    containers[step] = div;
});

// Runtime do Observable
const runtime = new Runtime();

// Renderiza as células nos contêineres imediatamente
runtime.module(define, name => {
    // Identifica qual passo precisa desta célula
    const step = Object.keys(STEP_MAP).find(k => STEP_MAP[k] === name);

    if (step) {
        return Inspector.into(containers[step])();
    }

    return null; // Ignora outras células
});


// Lógica de Scroll
function activateStep(stepIndex) {
    Object.entries(containers).forEach(([key, div]) => {
        const step = parseInt(key);

        // Caso Especial: Passo 1 (Gráfico Unificado)
        // Permanece visível para os passos 1, 2 e 3
        if (step === 1) {
            const isVisible = (stepIndex === 1 || stepIndex === 2 || stepIndex === 3);
            div.style.opacity = isVisible ? 1 : 0;
            div.style.transform = isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.98)";
            div.style.pointerEvents = isVisible ? "auto" : "none";

            // Atualização interna (Animação de transição)
            if (isVisible) {
                const svg = div.querySelector("svg");
                if (svg && typeof svg.update === "function") {
                    svg.update(stepIndex);
                }
            }
            return;
        }

        // Caso Especial: Passos 2 e 3 (Placeholders)
        // Sempre escondidos, pois o gráfico do Passo 1 os gerencia
        if (step === 2 || step === 3) {
            div.style.opacity = 0;
            div.style.pointerEvents = "none";
            return;
        }

        // Comportamento padrão para outros passos
        if (step === stepIndex) {
            div.style.opacity = 1;
            div.style.transform = "translateY(0) scale(1)";
            div.style.pointerEvents = "auto";
        } else {
            div.style.opacity = 0;
            div.style.transform = "translateY(30px) scale(0.98)";
            div.style.pointerEvents = "none";
        }
    });
}

// Observador de interseção
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const idx = +e.target.dataset.index;
            document.querySelectorAll(".step").forEach(s => s.classList.remove("is-active"));
            e.target.classList.add("is-active");
            activateStep(idx);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll(".step").forEach(s => observer.observe(s));
