"use client";

import { useState } from "react";

// Dicionário Dinâmico: A fase fenológica muda conforme a cultura escolhida
const culturasFases: Record<string, string[]> = {
  "Soja": ["Emergência (VE-VC)", "Vegetativo Inicial (V1-V3)", "Vegetativo Avançado (V4-Vn)", "Floração (R1-R2)", "Formação de Vagens (R3-R4)", "Enchimento de Grãos (R5-R6)", "Maturação (R7-R8)"],
  "Milho (Safra/Safrinha)": ["Emergência (VE)", "Vegetativo Rápido (V4-V8)", "Pré-pendoamento (V9-Vn)", "Pendoamento/Silking (VT-R1)", "Enchimento de Grãos (R2-R5)", "Maturidade Fisiológica (R6)"],
  "Algodão": ["Emergência", "Crescimento Vegetativo (V1-Vn)", "Início do Florescimento (F1)", "Desenvolvimento de Maçãs", "Abertura de Capulhos", "Senescência"],
  "Cana-de-Açúcar": ["Brotação", "Perfilhamento", "Crescimento de Colmos", "Acúmulo de Sacarose (Maturação)"],
  "Café (Arábica/Conilon)": ["Repouso Vegetativo", "Floração", "Chumbinho / Expansão", "Enchimento de Grãos", "Maturação (Cereja)"],
  "Trigo / Cereais de Inverno": ["Emergência", "Afilhamento", "Elongação do Colmo", "Emborrachamento", "Espigamento/Floração", "Enchimento de Grãos", "Maturação"],
  "Feijão": ["Vegetativo (V1-V4)", "Pré-Floração (R5)", "Floração (R6)", "Formação de Vagens (R7)", "Enchimento de Grãos (R8)", "Maturação (R9)"]
};

// Mapeamento Nacional de Solos
const solosBrasil = [
  "Centro-Oeste: Latossolo Vermelho (Cerrado Argiloso)",
  "Centro-Oeste: Neossolo Quartzarênico (Cerrado Arenoso)",
  "Sul: Nitossolo Vermelho (Terra Roxa Argilosa)",
  "Sul: Planossolo Háplico (Várzea/Arroz)",
  "Nordeste/Matopiba: Latossolo Amarelo (Textura Média)",
  "Nordeste: Luvissolo (Semiárido/Caatinga)",
  "Sudeste: Argissolo Vermelho-Amarelo (Mata Atlântica)",
  "Norte: Latossolo Amarelo (Amazônia)"
];

export default function VigorIA() {
  const [laudo, setLaudo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Variáveis com valores iniciais seguros
  const [cultura, setCultura] = useState("Soja");
  const [estagio, setEstagio] = useState(culturasFases["Soja"][0]);
  const [regiao, setRegiao] = useState(solosBrasil[0]);
  const [indice, setIndice] = useState("NDVI");
  const [observacoes, setObservacoes] = useState("");

  // Função que atualiza a cultura e já corrige a fase fenológica correspondente
  const handleCulturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaCultura = e.target.value;
    setCultura(novaCultura);
    setEstagio(culturasFases[novaCultura][0]);
  };

  const handleUpload = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    setLoading(true);
    setLaudo(`Processando metadados...\nCultura: ${cultura}\nÍndice: ${indice}\nAguarde o Laudo Oficial.`);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];

        const resposta = await fetch("/api/diagnostico-ia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            imagemBase64: base64, cultura, regiao, indice, estagio, observacoes
          }),
        });

        const dados = await resposta.json();
        if (dados.sucesso) {
          setLaudo(dados.laudo);
        } else {
          setLaudo("Erro na análise: " + dados.erro);
        }
      };
      reader.readAsDataURL(arquivo);
    } catch (error) {
      setLaudo("Falha na comunicação com o servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  // RENDERIZADOR LIMPO: Remove caracteres de markdown e aplica CSS
  const formatarTextoLimpo = (textoOriginal: string) => {
    if (!textoOriginal) return null;
    
    // Divide o texto por quebras de linha
    return textoOriginal.split('\n').map((linha, index) => {
      // Remove hashtags indesejadas do markdown
      const linhaSemHash = linha.replace(/#/g, '').trim();
      if (!linhaSemHash) return <br key={index} />; // Preserva espaços em branco

      // Caça os asteriscos duplos (**texto**) e transforma em verde/bold
      const partes = linhaSemHash.split(/\*\*(.*?)\*\*/g);
      
      return (
        <p key={index} className="mb-3 text-[#e2e6eb] leading-relaxed">
          {partes.map((parte, i) => 
            i % 2 === 1 
              ? <strong key={i} className="text-[#88d982] font-semibold">{parte}</strong> 
              : parte
          )}
        </p>
      );
    });
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <div className="flex flex-col min-h-screen bg-[#0c0e10] text-[#e2e6eb] font-['Manrope',sans-serif] overflow-x-hidden selection:bg-[#88d982] selection:text-[#004c0f]">
        
        <header className="fixed top-0 w-full z-50 bg-[#0c0e10]/90 backdrop-blur-xl border-b border-[#22262a]">
          <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#88d982]">satellite_alt</span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-[#e2e6eb] font-['Space_Grotesk']">Vigor IA</h1>
            </div>
            <div className="hidden sm:flex gap-4">
              <span className="material-symbols-outlined text-[#a8abb0] hover:text-[#88d982] transition-colors cursor-pointer">notifications</span>
              <span className="material-symbols-outlined text-[#a8abb0] hover:text-[#88d982] transition-colors cursor-pointer">account_circle</span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-28 px-5 sm:px-8">
          <section className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e2e6eb] mb-3 leading-tight font-['Space_Grotesk']">Parâmetros de Voo</h2>
            <p className="text-[#a8abb0] text-sm md:text-base leading-relaxed max-w-2xl">
              Defina as variáveis edafoclimáticas e espectrais para a calibração de altíssima precisão da Inteligência Artificial.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1c2023] p-4 rounded-xl border border-[#22262a] hover:border-[#88d982]/50 transition-colors">
              <label className="text-[#a8abb0] text-[10px] md:text-xs uppercase tracking-widest font-['Inter'] mb-2 block">Cultura Alvo</label>
              <select value={cultura} onChange={handleCulturaChange} className="w-full bg-transparent text-[#e2e6eb] text-sm md:text-base focus:outline-none cursor-pointer">
                {Object.keys(culturasFases).map(c => <option key={c} value={c} className="bg-[#1c2023]">{c}</option>)}
              </select>
            </div>

            <div className="bg-[#1c2023] p-4 rounded-xl border border-[#22262a] hover:border-[#88d982]/50 transition-colors">
              <label className="text-[#a8abb0] text-[10px] md:text-xs uppercase tracking-widest font-['Inter'] mb-2 block">Fase Fenológica</label>
              <select value={estagio} onChange={(e) => setEstagio(e.target.value)} className="w-full bg-transparent text-[#e2e6eb] text-sm md:text-base focus:outline-none cursor-pointer">
                {culturasFases[cultura].map(fase => <option key={fase} value={fase} className="bg-[#1c2023]">{fase}</option>)}
              </select>
            </div>

            <div className="bg-[#1c2023] p-4 rounded-xl border border-[#22262a] hover:border-[#88d982]/50 transition-colors">
              <label className="text-[#a8abb0] text-[10px] md:text-xs uppercase tracking-widest font-['Inter'] mb-2 block">Região / Solo</label>
              <select value={regiao} onChange={(e) => setRegiao(e.target.value)} className="w-full bg-transparent text-[#e2e6eb] text-sm md:text-base focus:outline-none cursor-pointer">
                {solosBrasil.map(solo => <option key={solo} value={solo} className="bg-[#1c2023]">{solo}</option>)}
              </select>
            </div>

            <div className="bg-[#1c2023] p-4 rounded-xl border border-[#22262a] hover:border-[#88d982]/50 transition-colors">
              <label className="text-[#a8abb0] text-[10px] md:text-xs uppercase tracking-widest font-['Inter'] mb-2 block">Índice Gerado</label>
              <select value={indice} onChange={(e) => setIndice(e.target.value)} className="w-full bg-transparent text-[#e2e6eb] text-sm md:text-base focus:outline-none cursor-pointer">
                <option value="NDVI" className="bg-[#1c2023]">NDVI (Padrão)</option>
                <option value="NDRE" className="bg-[#1c2023]">NDRE (Borda Vermelha)</option>
                <option value="VARI" className="bg-[#1c2023]">VARI (RGB Visível)</option>
                <option value="SAVI" className="bg-[#1c2023]">SAVI (Ajuste de Solo)</option>
              </select>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-[#1c2023] p-4 rounded-xl border border-[#22262a] focus-within:border-[#88d982] transition-colors">
              <label className="text-[#a8abb0] text-[10px] md:text-xs uppercase tracking-widest font-['Inter'] mb-2 block">
                Histórico de Campo (Clima, Químicos, Solo) - <span className="text-[#88d982]">Opcional</span>
              </label>
              <textarea 
                value={observacoes} 
                onChange={(e) => setObservacoes(e.target.value)} 
                placeholder="Ex: Veranico de 15 dias. Última aplicação: Estrobilurinas. V% baixo na última análise..."
                className="w-full bg-transparent text-[#e2e6eb] text-sm md:text-base focus:outline-none min-h-[80px] md:min-h-[100px] resize-none"
              />
            </div>
          </section>

          <section className="mb-12">
            <label className="w-full relative overflow-hidden bg-gradient-to-br from-[#88d982] to-[#076019] p-6 md:p-8 rounded-xl flex flex-col items-center justify-center gap-3 group hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(7,96,25,0.3)]">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={loading} />
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
              
              <div className="bg-[#004c0f]/20 p-4 md:p-5 rounded-full z-10 group-hover:bg-[#004c0f]/30 transition-colors">
                <span className="material-symbols-outlined text-[#004c0f] text-3xl md:text-4xl">memory</span>
              </div>
              <span className="text-[#004c0f] text-lg md:text-2xl font-bold tracking-tight z-10 font-['Space_Grotesk'] text-center">
                {loading ? "Processando Variáveis..." : "Processar Mapa de Precisão"}
              </span>
            </label>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#22262a] pb-3">
              <span className="material-symbols-outlined text-[#88d982] text-3xl">psychology</span>
              <h3 className="text-xl md:text-2xl font-medium tracking-tight font-['Space_Grotesk'] text-[#e2e6eb]">Laudo Integrado</h3>
            </div>

            <div className="bg-[#1c2023] p-5 md:p-8 rounded-xl border-l-4 border-[#88d982] shadow-xl min-h-[200px]">
              <div className="font-['Manrope']">
                {/* Aqui nós passamos o texto sujo para a nossa função que devolve o visual limpo */}
                {laudo ? formatarTextoLimpo(laudo) : <span className="text-[#a8abb0]">Aguardando envio do mapa multiespectral. Defina os parâmetros e anexe a imagem para iniciar a auditoria.</span>}
              </div>
            </div>
          </section>

          {/* NOVA SEÇÃO: Assinatura do Desenvolvedor (Tema Escuro) */}
          <div className="w-full text-center pt-8 pb-4 border-t border-[#22262a] mt-8">
            <p className="text-xs text-[#a8abb0] font-['Inter']">
              Idealizado e desenvolvido por <a href="https://www.linkedin.com/in/joaohenriquedasilva-agronomo/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#88d982] hover:text-white transition-colors">Eng. Agr. João</a>
            </p>
            <p className="text-[10px] text-[#626567] mt-1">© {new Date().getFullYear()} Vigor IA. Todos os direitos reservados.</p>
          </div>

        </main>

        <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#000000]/95 backdrop-blur-md z-50 border-t border-[#22262a]">
          <div className="w-full max-w-4xl mx-auto flex justify-around items-center h-full px-4">
            <a className="flex flex-col items-center justify-center text-[#88d982] drop-shadow-[0_0_8px_rgba(136,217,130,0.4)]" href="#">
              <span className="material-symbols-outlined text-xl md:text-2xl">home</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest mt-1 font-['Inter']">Início</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}