# Reinforcement Learning Unveiled: An Interactive Journey

Uma plataforma de aprendizado interativa que desmistifica o Reinforcement Learning através de explicações visuais e exploração prática. O foco principal é uma visualização interativa que permite controlar o processo de aprendizado e ver como o RL funciona utilizando Q-learning.

## Sobre o Projeto

Este projeto foi desenvolvido para tornar o Reinforcement Learning mais acessível e compreensível através de três módulos principais:

1. **Explicação Básica**: Introdução aos conceitos fundamentais do RL através de exemplos interativos
2. **Teoria Formal**: Definições matemáticas rigorosas de agentes, ambientes, políticas, recompensa e o algoritmo de aprendizado (Q-Learning)
3. **Visualização Interativa**: Ambiente prático onde você pode ajustar parâmetros, observar o agente aprender e ver os resultados em tempo real

### Objetivo Principal

Combinar explicações visuais com exploração para facilitar o entendimento de como algoritmos de RL, especificamente Q-learning, funcionam na prática.

## Funcionalidades da Visualização

### Ambiente Interativo
- **Grid World Customizável**: Configure o tamanho do mundo, posições inicial e final, e obstáculos.
- **Controle de Parâmetros**: Ajuste taxa de aprendizado (α), fator de desconto (γ), epsilon e decay.
- **Visualização em Tempo Real**: Observe o agente aprendendo e tomando decisões.

### 🎛️ Controles de Reprodução
- **Play/Pause**: Controle a execução da animação.
- **Velocidades Múltiplas**: 4 níveis de velocidade de reprodução.
- **Navegação Manual**: Vá para episódios e passos específicos clicando nos gráficos ou na barra deslizante.
- **Controles de Episódio**: Navegue entre diferentes tentativas do agente.

### Componentes Visuais!

#### Grid do Ambiente
- Visualização do mundo onde o agente opera
- Posições de início, objetivo e obstaculos (fantasmas) claramente marcadas
- Acompanhamento da posição atual do agente ao longo do aprendizado

<div align="center">
  
![ambiente](https://github.com/user-attachments/assets/20beb0a3-f356-4edb-854d-0fd5e642b025)

</div>

#### Sucesso ao longo dos episódios
- Acompanha a evolução da performance do agente ao longo dos episódios.
- Mostra como o agente melhora com o tempo.

<div align="center">
  
![sucesso](https://github.com/user-attachments/assets/ef86a183-89ac-4f87-b3db-7efbb0e0e764)

</div>

#### Grid de Q-valores
- Mostra o valor máximo de Q para cada célula
- Representa o maior valor esperado para aquela célula em uma iteração específica
- Mostra o melhor caminho aprendido claramente

<div align="center">
  
![q-values-grid](https://github.com/user-attachments/assets/615fe881-e1cc-4f59-b20b-23ebf58fceb6)

</div>

#### Grid da Política Aprendida

- Mostra a política aprendida para cada célula através de setas direcionais.
- Células com um ponto de interrogação ("?") representam estados que não foram explorados

<div align="center">
  
![politica](https://github.com/user-attachments/assets/42ba0a58-a0b6-4e13-829d-8edb8f1df322)

</div>

#### Gráficos de uma célula específica
- **Q-Valor**: Mostra o Q-valor para cada ação (esquerda, direita, cima e baixo) para a célula selecionada
- **Q-Valor ao longo dos episódios**: Mostra a evolução do Q-valor ao longo dos episódios para a célula selecionada

<div align="center">
  
![cell](https://github.com/user-attachments/assets/9fa52ad4-bb80-4a75-8f16-a24a83a2dfd0)

</div>

## Algoritmo Q-Learning

O projeto implementa o algoritmo Q-learning clássico com os seguintes parâmetros:

- **α (Alpha)**: Taxa de aprendizado - controla o quanto o agente aprende com cada experiência.
- **γ (Gamma)**: Fator de desconto - determina a importância de recompensas futuras.
- **ε (Epsilon)**: Taxa de exploração - balanceia exploração vs. explotação.
- **Epsilon Decay**: Redução gradual da exploração ao longo do tempo.

### Estratégia ε-greedy
O agente usa uma estratégia epsilon-greedy para balancear:
- **Exploração**: Tentar ações aleatórias para descobrir novas possibilidades.
- **Explotação**: Usar o conhecimento atual para escolher a melhor ação conhecida.

## Decisões de Design

### Interface do Usuário
- **Design Gaming-Inspired**: Visual moderno com elementos que remetem a jogos clássicos.
- **Tipografia**: Combinação de fontes pixeladas para títulos e fontes limpas para texto.
- **Paleta de Cores**: Esquema escuro com acentos em roxo para destacar elementos interativos.

### Visualização de Dados
- **Grid Responsivo**: Layout que se adapta a diferentes tamanhos de mundo.
- **Feedback Visual Imediato**: Mudanças em tempo real refletem as modificações nos parâmetros.
- **Tooltips Informativos**: Explicações contextuais para ajudar na compreensão.

### Interatividade
- **Tutorial Integrado**: Modal explicativo para novos usuários.
- **Sugestões Contextuais**: Textos que aparecem baseados no estado atual da visualização.
- **Controles Intuitivos**: Interface familiar similar a players de mídia.

## Desenvolvedores

### Kauan Mariani Ferreira
**GitHub**: [@kauanmaf](https://github.com/kauanmaf)

**Principais Contribuições:**
- Desenvolvimento do grid base utilizado em todo o projeto
- Implementação do tutorial interativo
- Configuração dos parâmetros do grid e do agente de aprendizado por reforço (RL)
- Criação do pôster de apresentação
- Definição da paleta de cores e estético da página

### Pedro Henrique Coterli
**GitHub**: [@PedroPHC25](https://github.com/PedroPHC25)

**Principais Contribuições:**
- Implementação do algoritmo de Q-learning
- Gráfico de linha da taxa de sucessos ao longo dos episódios
- Diagrama e gráfico de linhas dos Q-valores por célula
- Textos dinâmicos de sugestões ao usuário sobre os parâmetros selecionados


### Gustavo Tironi
**GitHub**: [@gtironi](https://github.com/gtironi)

**Principais Contribuições:**
- Páginas teóricas (intuitiva, formal e q-leaning)
- Demonstração da atualização da tabela q-learning
- Página principal e organização do fluxo
- Design e experiência do usuário
- Relatório

## Contexto Acadêmico

Este projeto foi desenvolvido como trabalho final da disciplina de **Visualização de Dados** da **Fundação Getulio Vargas (FGV)**, com o objetivo de:

- Aplicar técnicas de visualização de dados para explicar conceitos complexos;
- Criar interfaces interativas para exploração de algoritmos de machine learning;
- Demonstrar a aplicação prática de conceitos teóricos de RL.

## Próximos Passos

Possíveis melhorias futuras incluem:
- Implementação de outros algoritmos de RL;
- Ambientes mais complexos (gridworlds maiores, obstáculos dinâmicos);
- Comparação entre diferentes algoritmos.
