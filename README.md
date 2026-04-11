# 🛰️ Vigor IA - Sistema de Inteligência Espectral Agronômica

**Acesso ao Sistema:** [vigor-ia-app.vercel.app](https://vigor-ia-app.vercel.app)

## 📌 Visão Executiva
O **Vigor IA** é uma plataforma de diagnóstico agronômico desenvolvida para interpretar metadados de mapas multiespectrais e índices de vegetação (NDVI, NDRE, SAVI). O sistema atua como uma camada de inteligência artificial geo-referenciada, traduzindo variações de dossel e estresse hídrico em laudos técnicos e planos de ação direcionados, com foco na alta complexidade dos solos e do clima do Cerrado brasileiro.

## 🚀 Arquitetura e Funcionalidades
- **Calibragem Edafoclimática Dinâmica:** O algoritmo adapta a leitura da IA com base na cultura, fase fenológica específica e textura do solo (ex: Latossolos vs. Neossolos).
- **Radar de Precisão (Tempo Real):** Integração com API de geolocalização silenciosa (via IP) cruzada com LLM para gerar alertas agrometeorológicos instantâneos baseados na localização física do usuário.
- **Motor de Visão Computacional:** Processamento de imagens em Base64 submetidas à API do Google Gemini (Vision) para auditoria de estresse biótico e abiótico.

## 🛠️ Stack Tecnológico
- **Frontend:** React.js, Next.js (App Router), Tailwind CSS (Dark Mode UI/UX Corporativo).
- **Backend/API:** Next.js API Routes (Serverless Functions).
- **Inteligência Artificial:** Google Gemini 3 Flash (LLM & Vision).
- **Deploy & Infraestrutura:** Vercel, GitHub (Controle de Versão).

---
*Idealizado e desenvolvido por **João Henrique da Silva** (Engenheiro Agrônomo).* [Conecte-se no LinkedIn](https://www.linkedin.com/in/joaohenriquedasilva-agronomo/)