# Agente Autônomo com Busca

Projeto de simulação de um agente autônomo que navega por um terreno gerado proceduralmente (Perlin Noise) em busca de um alvo, utilizando diferentes algoritmos de busca de caminhos.

## Informações do Grupo
* **Nome do Grupo:** Grupo 7
* **Integrantes:**
  * Álvaro Brandão Neto
  * Marcelo Arcoverde Neves Britto de Rezende
  * Rodrigo Raimundo Sampaio
  * Vinicius Lima Sá de Melo

---

## Funcionalidades Implementadas

* **Geração Procedural de Terreno:** Mapa gerado dinamicamente com diferentes biomas (Areia, Atoleiro, Água e Obstáculos), cada um com custos específicos de travessia.
* **Algoritmos de Busca:**
  * Busca em Largura (BFS)
  * Busca em Profundidade (DFS)
  * Busca de Custo Uniforme (BCU / Dijkstra)
  * Busca Gulosa (Greedy Search)
* **Interface Interativa (UI/UX):**
  * Troca de algoritmos em tempo real no mesmo mapa para fins de comparação.
  * Controle de velocidade da animação (Slider para avançar múltiplos passos por frame).
  * Painel de estatísticas ao vivo: Contagem de comida, Custo total do caminho e Tempo de execução (medido em iterações/nós explorados).
  * Legenda de terrenos com seus respectivos custos.

---

## Estrutura do Projeto

O projeto segue uma adaptação da arquitetura **MVC (Model-View-Controller)** para motores gráficos, com o uso de **FSM (Máquina de Estados Finita)** para controle das fases de busca e movimento do agente.
```text
/projeto_SI
│
├── index.html              # Visão principal (View)
├── README.md               # Documentação
│
├── /css
│   └── style.css           # Estilização da interface e layout flexível
│
└── /js
    ├── sketch.js           # Loop principal e ponte de UI (Controller)
    ├── environment.js      # Gerenciador do Mundo e FSM (Model)
    ├── terrain.js          # Definição de custos e cores do terreno
    ├── vehicle.js          # Lógica de movimentação do agente
    ├── target.js           # Entidade visual do objetivo
    ├── priorityQueue.js    # Estrutura de dados base para BCU e Greedy
    │
    └── /algorithms         # Implementações dos algoritmos de IA
        ├── bfs.js
        ├── dfs.js
        ├── bcu.js
        ├── greedySearch.js
        └── AStar.js
