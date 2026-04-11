export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ erro: "Chave ausente." }, { status: 500 });

    const dados = await req.json();
    const { cidade, estado } = dados;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    // O comando secreto que transforma o Gemini em Agrometeorologista local
    const prompt = `Atue como um Agrometeorologista Sênior focado no Brasil. 
O usuário está visualizando o sistema na região de ${cidade} (${estado}). 
Gere um alerta agrícola curto (máximo de 3 linhas) e altamente técnico focado em risco ou oportunidade para as principais culturas desta região neste momento. Fale sobre impacto da umidade, temperatura ou dinâmica de pragas. 
NÃO use saudações. Retorne APENAS o texto direto do alerta agronômico.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const result = await response.json();
    if (!response.ok) return NextResponse.json({ erro: "Falha na IA" }, { status: response.status });

    const alertaTexto = result.candidates?.[0]?.content?.parts?.[0]?.text || "Monitoramento estável na sua região.";

    return NextResponse.json({ sucesso: true, alerta: alertaTexto, cidade: cidade });

  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}