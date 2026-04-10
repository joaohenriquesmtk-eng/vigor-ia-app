export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ erro: "Chave ausente no arquivo .env.local" }, { status: 500 });

    const dados = await req.json();
    const { imagemBase64, cultura, regiao, indice, estagio, observacoes } = dados;

    // RELÓGIO ATÔMICO: Pega a data exata em Português do Brasil
    const dataAtual = new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    }).format(new Date());

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    const promptEngenheiro = `
Você é o Cérebro do Sistema Vigor IA, um Engenheiro Agrônomo especialista em Agricultura de Precisão.

**CONTEXTO OBRIGATÓRIO DA ANÁLISE:**
- DATA EXATA DE HOJE: ${dataAtual} (OBRIGATÓRIO usar esta data no cabeçalho)
- Cultura: ${cultura}
- Estágio Fenológico: ${estagio}
- Região/Pedologia: ${regiao}
- Índice Submetido: ${indice}
- Observações de Campo: ${observacoes ? observacoes : "Não informado."}

**REGRAS RESTRITAS DE FORMATAÇÃO (MUITO IMPORTANTE):**
1. NUNCA utilize os símbolos hashtag (#) ou traços (-) para criar listas.
2. Utilize APENAS a marcação dupla de asterisco (**texto**) para destacar Palavras-Chave e Títulos. O sistema de interface converterá isso em verde na tela.
3. Para fazer listas, utilize apenas o símbolo de bullet point clássico (•).

**DIRETRIZES DO LAUDO:**
Inicie com o cabeçalho técnico "LAUDO TÉCNICO EXECUTIVO" contendo a Data Exata fornecida acima.
Faça a Análise Espectral considerando o índice ${indice}.
Faça a Correlação de Dados com o solo ${regiao} e o estágio ${estagio}.
Forneça o Diagnóstico e a Prescrição de Campo. Seja direto e altamente técnico.
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptEngenheiro },
            { inlineData: { mimeType: "image/jpeg", data: imagemBase64 } }
          ]
        }]
      })
    });

    const result = await response.json();
    if (!response.ok) return NextResponse.json({ erro: `Google diz: ${JSON.stringify(result)}` }, { status: response.status });

    const laudo = result.candidates?.[0]?.content?.parts?.[0]?.text || "Análise concluída, porém sem resposta textual.";
    return NextResponse.json({ sucesso: true, laudo });

  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}