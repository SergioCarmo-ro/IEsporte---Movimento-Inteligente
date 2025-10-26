# IEsporte - Movimento Inteligente 🧠🏃‍♀️

![Banner do Projeto IEsporte - Movimento Inteligente](https://placehold.co/800x200/6B8E23/ffffff?text=IEsporte+-+An%C3%A1lise+de+Movimento+Inteligente)

## 🎯 Descrição Breve do Sistema

O **IEsporte - Movimento Inteligente** é um protótipo de plataforma digital focada em **fisioterapia** e **análise clínica de movimento**. O sistema visa capacitar fisioterapeutas com ferramentas para diagnóstico preciso e fornecer aos pacientes um guia interativo de exercícios corretivos. O projeto utiliza o poder do Python para lógica de Machine Learning (TensorFlow/visão computacional) e a tríade web (HTML, CSS, JavaScript) para uma interface de usuário dinâmica e acessível.

---

## 🛠️ Tecnologias Utilizadas

Este projeto integra tecnologias de frontend, backend e inteligência artificial para entregar uma solução completa de saúde digital.

| Categoria | Tecnologia | Ícone |
| :--- | :--- | :--- |
| **Backend / IA** | Python | 🐍 |
| **Estrutura da Interface** | HTML5 | 📄 |
| **Estilização / Design** | CSS3 (com Tailwind CSS) | 🎨 |
| **Interatividade / Dinamismo** | JavaScript (Vanilla + Chart.js) | ⚡ |
| **Modelo de IA** | TensorFlow (Visão Computacional) | |
| **Base de Dados** | Ferramentas SQL (SQL Tools) | |

---

## 🏗️ Arquitetura Resumida

A arquitetura do IEsporte é desenhada para ser modular, permitindo a separação clara entre a lógica clínica (IA/Python) e a apresentação interativa (Frontend).

* **Camada de IA/Lógica (Backend - 🐍 Python/TensorFlow):** Responsável por processar dados de movimento, fornecer modelos de análise e estruturar o conteúdo clínico.
* **Camada de Persistência (SQL Tools):** Armazenamento de dados de pacientes, histórico de análises e o catálogo de exercícios.
* **Camada de Apresentação (Frontend - 📄 HTML/🎨 CSS/⚡ JavaScript):** O painel interativo (SPA) que permite a exploração do guia de exercícios e a visualização da análise de mercado.

## 📁 Estrutura Simplificada

A organização dos arquivos reflete a divisão das responsabilidades:

IEsporte-Movimento-Inteligente/ 

├── ml_models/ 

│ └── movement_analysis.py # Lógica de Visão Computacional (Python/TensorFlow) 

├── api/ 

│ └── data_service.py # Serviços de acesso a dados (Python) 

├── frontend/ │ 

├── index.html # Painel Interativo - Interface (HTML) │ 

├── css/ │ 

│ └── tailwind.css # Estilos base 

│ └── js/ 

│ └── app.js # Lógica de interatividade e gráficos (JavaScript) 

└── README.md

## 📐 Padrão de Projeto Utilizado

O projeto segue a arquitetura **SPA (Single-Page Application)** no frontend para uma experiência fluida. A lógica interna do código JavaScript e Python adota o princípio de **Separação de Preocupações**, garantindo que:

* **Processamento de Dados e ML:** Fique isolado no Python.
* **Gerenciamento do Estado:** Seja feito pelo JavaScript para atualizar a interface dinamicamente (simulando um padrão *Flux* ou *Redux* simplificado para o estado da aplicação).

---

## ✨ Funcionalidades do Protótipo

O protótipo do IEsporte demonstra as seguintes capacidades:

1.  **Guia de Exercícios Interativo:** Módulo que permite filtrar e visualizar detalhes de exercícios corretivos por foco corporal (Coluna, Ombros, Core, etc.).
2.  **Dashboard de Análise:** Apresentação comparativa de projetos de mercado (Eficácia Clínica vs. Performance Técnica) usando gráficos dinâmicos (Chart.js).
3.  **Análise de Movimento Simulada:** Base para integrar um futuro módulo de visão computacional para avaliar a execução correta dos exercícios pelo paciente.
4.  **Integração Futura com IA Generativa (Gemini API):** Estrutura pronta para gerar relatórios de progresso personalizados e insights clínicos.

---

## 🚀 Como Executar o Sistema

Para testar o Painel Interativo e a estrutura de código localmente.

### 🧩 Dependências Utilizadas

* **Para o Painel Interativo (Frontend):** Apenas um navegador web moderno.
* **Para o Módulo de IA (Desenvolvimento Futuro):** Python (3.9+), `tensorflow`, `opencv-python`.

### 📋 Passo a Passo para Execução

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/SergioCarmo-ro/IEsporte-Movimento-Inteligente.git](https://github.com/SergioCarmo-ro/IEsporte-Movimento-Inteligente.git)
    cd IEsporte-Movimento-Inteligente
    ```

2.  **Execução do Frontend (Painel Interativo):**
    * Como se trata de um SPA (Single-Page Application), você pode **abrir o arquivo `frontend/index.html` diretamente no seu navegador**.

3.  **Execução da Lógica Python (Apenas se houver um servidor implementado):**
    * Se você tiver um servidor Python configurado (ex: Flask) para servir os dados:
        ```bash
        # Exemplo: Se o seu servidor estiver em api/data_service.py
        python api/data_service.py
        ```

### ⚠️ Observações Importantes

* A visualização do Painel Interativo (`index.html`) já é totalmente funcional e interativa, usando dados embutidos no JavaScript (Vanilla + Chart.js).
* A integração da análise de movimento em tempo real e a persistência de dados em SQL são funcionalidades planejadas que exigem a configuração do ambiente Python e dos servidores de banco de dados.

---

## 🟢 Status do Projeto

| Status | Detalhe |
| :--- | :--- |
| **Protótipo de Painel Interativo** | **Completo e funcional** (Frontend/SPA). |
| **Módulo de Análise IA** | Em fase de **definição de arquitetura** e desenvolvimento do modelo. |
| **Próximos Passos** | Implementar a comunicação em tempo real entre o modelo de visão computacional (Python/TensorFlow) e a interface web. |

---


👨‍💻 Autor

Sergio Ademir Rocha do Carmo
GitHub - SergioCarmo-ro

| :--- |  (Frontend, Backend)  

| **Sérgio Ademir Rocha do Carmo** 
