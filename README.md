# Reinforcement Learning Unveiled: An Interactive Journey

An interactive learning platform designed to demystify Reinforcement Learning through visual explanations and hands-on exploration. The project focuses on a dynamic visualization that allows the user to control the learning process and understand how the Q-learning algorithm works in real-time.

## About the Project

"Reinforcement Learning Unveiled" was created to make Reinforcement Learning (RL) concepts more accessible. The tool guides the user through a progressive learning journey, from theoretical foundations to a practical and interactive application.

The main goal is to combine visual explanations with a hands-on approach, allowing anyone to manipulate the components of an RL algorithm and observe the consequences of their choices in real-time.

### Learning Structure

The system is divided into three main modules:

1.  **Intuitive Explanation**: A playful introduction to the fundamental concepts of RL.
2.  **Formal Theory**: A deeper dive into the concepts, formally defining Agent, Environment, Rewards, and Policy.
3.  **Interactive Visualization**: A practical sandbox-style environment where the user can apply and test their knowledge.

## Interactive Visualization

The heart of the project is a control panel that allows the user to freely experiment with an agent (styled as Pac-Man) in a Grid World environment.

### Features

#### Environment and Parameters

* **Customizable Grid World**: Configure the environment's width and height, and add or remove obstacles (ghosts) by clicking directly on the cells.
* **RL Parameter Control**: Adjust the learning rate (α), discount factor (γ), exploration rate (ε), and epsilon decay using interactive sliders.

#### Simulation Controls

* **Play/Pause and Speed**: Control the animation's execution and adjust the playback speed.
* **Episode Navigation**: Analyze the agent's behavior in specific episodes and steps.

### Coordinated Visualization Panels

#### 1. Training Overview

* **Agent's Environment**: Follow the agent's journey, its current position, obstacles, and the goal.
* **Success Rate Over Episodes**: A line chart showing the evolution of the agent's performance, allowing for the identification of learning patterns.

<div align="center">
  <img src="https://github.com/user-attachments/assets/ef86a183-89ac-4f87-b3db-7efbb0e0e764" alt="Success Rate" width="600"/>
</div>

#### 2. Global Policy and Q-Values

* **Learned Policy (Policy View)**: A grid that displays the best action for each state using arrows. A question mark (?) indicates unexplored states.
* **Q-values Heatmap**: Visualizes the maximum expected value (V(s)) for each state, where warmer colors indicate a higher future reward.

<div align="center">
  <table>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/42ba0a58-a0b6-4e13-829d-8edb8f1df322" alt="Learned Policy" width="300"/></td>
      <td><img src="https://github.com/user-attachments/assets/615fe881-e1cc-4f59-b20b-23ebf58fceb6" alt="Q-Values Heatmap" width="300"/></td>
    </tr>
  </table>
</div>

#### 3. Detailed Cell Analysis

By clicking on a specific cell, the view changes to a detailed analysis of that state:

* **Q-Values for the Cell**: Displays the four Q-values (up, down, left, right) for the selected state.
* **Q-Values Evolution**: A line chart that plots the evolution of the selected cell's Q-values across all episodes.

<div align="center">
  <img src="https://github.com/user-attachments/assets/9fa52ad4-bb80-4a75-8f16-a24a83a2dfd0" alt="Cell Analysis" width="600"/>
</div>

## How It Works: The Q-Learning Algorithm

The project implements the **Q-learning** algorithm, which learns an action-value function, `Q(s, a)`, that estimates the total expected reward for taking action `a` in state `s`. The values are updated using the Bellman equation:

`Q(s, a) ← Q(s, a) + α * [r + γ * max_a' Q(s', a') - Q(s, a)]`

To balance the discovery of new strategies with the use of acquired knowledge, the agent uses an **ε-greedy policy**. With a probability of `ε`, it explores a random action; otherwise, it exploits the best-known action. The value of `ε` decays over time to favor exploitation as the agent becomes more experienced.

## Academic Context

This project was developed as the final work for the **Data Visualization** course at **Fundação Getulio Vargas (FGV)**. The work aimed to apply visualization techniques to explain complex machine learning concepts and create an interactive interface for algorithm exploration.

## Authors

- [Gustavo Tironi](https://github.com/gtironi)
- [Kauan Mariani](https://github.com/kauanmaf)
- [Pedro Henrique Coterli](https://github.com/PedroPHC25)

## Next Steps

Future improvements could include:

* Implementation of other RL algorithms (e.g., SARSA, DQN) for comparison.
* Creation of more complex environments, with dynamic obstacles or non-deterministic scenarios.
* Functionality to compare the performance of different algorithms side-by-side.

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute it, provided proper credit is given to the original authors.
