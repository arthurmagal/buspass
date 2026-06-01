import React, { useState, useEffect } from "react";
import { Search, QrCode, HelpCircle, CreditCard, Bus, CheckCircle2, Send, RefreshCw, ShieldCheck, AlertCircle, Ticket } from "lucide-react";

// ─── Dados simulados ─────────────────────
const CIDADES = [
  "São Paulo - SP", "Rio de Janeiro - RJ", "Campinas - SP", "Belo Horizonte - MG",
  "Curitiba - PR", "Porto Alegre - RS", "Salvador - BA", "Fortaleza - CE",
  "Recife - PE", "Manaus - AM", "Brasília - DF", "Goiânia - GO",
];

const HORARIOS = ["05:00", "07:30", "09:00", "11:00", "13:30", "15:00", "17:30", "19:00", "21:00", "23:30"];

const TIPOS_SERVICO = ["Convencional", "Executivo", "Leito", "Semi-leito"];

// Preços base por par de cidades (simulado)
const gerarPreco = (origem, destino, tipo) => {
  const hash = (origem.length * 7 + destino.length * 13) % 100;
  const base = 45 + hash;
  const mult = { Convencional: 1, Executivo: 1.5, "Semi-leito": 1.8, Leito: 2.2 }[tipo] || 1;
  return Math.round(base * mult);
};

// Assentos ocupados (simulados, baseados na rota)
const gerarAssentosOcupados = (origem, destino) => {
  const seed = origem.length * 3 + destino.length * 7;
  const ocupados = new Set();
  for (let i = 1; i <= 32; i++) {
    if ((i * seed + i) % 7 === 0) ocupados.add(i);
  }
  return ocupados;
};

const LAYOUT_ESQUERDA = [["01","02"],["05","06"],["09","10"],["13","14"],["17","18"],["21","22"],["25","26"],["29","30"]];
const LAYOUT_DIREITA  = [["03","04"],["07","08"],["11","12"],["15","16"],["19","20"],["23","24"],["27","28"],["31","32"]];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatarData = (iso) => {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};

const hoje = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

// ─── Componente principal ────────────────────────────────────────────────────
export default function App() {
  const [etapa, setEtapa] = useState(1);

  // Busca
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [passageiros, setPassageiros] = useState(1);
  const [erroBusca, setErroBusca] = useState("");

  // Assento
  const [assentosSelecionados, setAssentosSelecionados] = useState([]);
  const [assentosOcupados, setAssentosOcupados] = useState(new Set());
  const preco = origem && destino && tipoServico ? gerarPreco(origem, destino, tipoServico) : 0;

  // Dados do usuário (RF06)
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [erroUsuario, setErroUsuario] = useState("");

  // Pagamento
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [erroCartao, setErroCartao] = useState("");
  const [processando, setProcessando] = useState(false);

  // Nota fiscal (RF08/RF09)
  const [querNF, setQuerNF] = useState(null);
  const [cpfNF, setCpfNF] = useState("");

  // Confirmação (RF10)
  const [bilheteCodigo] = useState(() => "BP" + Math.random().toString(36).substr(2,8).toUpperCase());
  const [smsEnviado, setSmsEnviado] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [reenviadoOk, setReenviadoOk] = useState(false);

  // Quando avança para assentos, gera ocupados
  useEffect(() => {
    if (etapa === 3 && origem && destino) {
      setAssentosOcupados(gerarAssentosOcupados(origem, destino));
      setAssentosSelecionados([]);
    }
  }, [etapa, origem, destino]);

  // Simulação de envio de SMS após confirmação
  useEffect(() => {
    if (etapa === 5) {
      const t = setTimeout(() => setSmsEnviado(true), 2000);
      return () => clearTimeout(t);
    }
  }, [etapa]);

  // ── Validações ──────────────────────────────────────────────────────────────
  const validarBusca = () => {
    if (!origem) return "Selecione a cidade de origem.";
    if (!destino) return "Selecione a cidade de destino.";
    if (origem === destino) return "Origem e destino não podem ser iguais.";
    if (!data) return "Selecione a data da viagem.";
    if (data < hoje()) return "A data da viagem não pode ser no passado.";
    if (!horario) return "Selecione um horário.";
    if (!tipoServico) return "Selecione o tipo de serviço.";
    return "";
  };

  const validarUsuario = () => {
    if (!nomeUsuario.trim() || nomeUsuario.trim().length < 3) return "Informe seu nome completo.";
    if (!telefone.replace(/\D/g, "") || telefone.replace(/\D/g, "").length < 10) return "Informe um telefone válido com DDD.";
    if (!email.includes("@") || !email.includes(".")) return "Informe um e-mail válido.";
    return "";
  };

  const validarCartao = () => {
    if (!nomeCartao.trim()) return "Informe o nome no cartão.";

    if (!validade.match(/^\d{2}\/\d{2}$/)) return "Validade inválida. Use MM/AA.";
    if (cvv.length < 3) return "CVV inválido.";
    return "";
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleBuscar = () => {
    const err = validarBusca();
    if (err) { setErroBusca(err); return; }
    setErroBusca("");
    setEtapa(3);
  };

  const handleContinuarParaPagamento = () => {
    if (assentosSelecionados.length < passageiros) return;
    setEtapa(4);
  };

  const handleConfirmarPagamento = async () => {
    const errU = validarUsuario();
    if (errU) { setErroUsuario(errU); return; }
    setErroUsuario("");

    if (metodoPagamento === "cartao") {
      const errC = validarCartao();
      if (errC) { setErroCartao(errC); return; }
    }
    setErroCartao("");
    setProcessando(true);
    await new Promise(r => setTimeout(r, 2000)); // simula gateway
    setProcessando(false);
    setEtapa(5);
  };

  const handleReenviarSMS = async () => {
    setReenviando(true);
    await new Promise(r => setTimeout(r, 1500));
    setReenviando(false);
    setReenviadoOk(true);
    setTimeout(() => setReenviadoOk(false), 4000);
  };

  const formatarCartao = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatarValidade = (v) => {
    v = v.replace(/\D/g,"").slice(0,4);
    if (v.length > 2) v = v.slice(0,2) + "/" + v.slice(2);
    return v;
  };
  const formatarTelefone = (v) => {
    v = v.replace(/\D/g,"").slice(0,11);
    if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
    return v;
  };

  // ── Estilos base ─────────────────────────────────────────────────────────────
  const S = {
    card: { backgroundColor:"white", borderRadius:14, padding:24, boxShadow:"0 2px 12px rgba(7,29,112,0.07)" },
    label: { fontSize:11, fontWeight:700, color:"#071d70", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4, display:"block" },
    input: { width:"100%", border:"1.5px solid #dde3f0", borderRadius:8, padding:"10px 12px", fontSize:15, outline:"none", boxSizing:"border-box", fontFamily:"inherit", color:"#1e293b" },
    select: { width:"100%", border:"1.5px solid #dde3f0", borderRadius:8, padding:"10px 12px", fontSize:15, outline:"none", boxSizing:"border-box", fontFamily:"inherit", color:"#1e293b", backgroundColor:"white", cursor:"pointer" },
    btn: { backgroundColor:"#071d70", color:"white", padding:"14px 28px", borderRadius:9, border:"none", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 },
    btnSecundario: { backgroundColor:"white", color:"#64748b", padding:"12px 22px", borderRadius:9, border:"1.5px solid #cbd5e1", fontSize:14, fontWeight:600, cursor:"pointer" },
    erro: { backgroundColor:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#b91c1c", display:"flex", alignItems:"center", gap:8, marginTop:10 },
  };

  // ── Barra de progresso ───────────────────────────────────────────────────────
  const etapas = ["Busca", "Assentos", "Pagamento", "Confirmação"];
  const etapaIdx = etapa === 1 ? 0 : etapa === 3 ? 1 : etapa === 4 ? 2 : 3;

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", backgroundColor:"#f1f5fb", minHeight:"100vh", color:"#1e293b" }}>

      {/* HEADER */}
      <header style={{ backgroundColor:"#071d70", color:"white", padding:"14px 36px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 10px rgba(7,29,112,0.3)" }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:1 }}>
          BUSS<span style={{ color:"#10b981" }}>PASS</span>
        </h1>
        <div style={{ display:"flex", alignItems:"center", gap:20, fontSize:13, opacity:0.88 }}>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}><HelpCircle size={15}/> Ajuda</span>
        </div>
      </header>

      {/* PROGRESSO */}
      <div style={{ backgroundColor:"white", borderBottom:"1px solid #e8edf5", padding:"14px 0" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:0, maxWidth:600, margin:"0 auto" }}>
          {etapas.map((label, i) => {
            const ativo = i === etapaIdx;
            const concluido = i < etapaIdx;
            return (
              <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{
                    width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                    backgroundColor: concluido ? "#10b981" : ativo ? "#071d70" : "#e2e8f0",
                    color: concluido || ativo ? "white" : "#94a3b8",
                    fontSize:13, fontWeight:700, transition:"all 0.3s"
                  }}>
                    {concluido ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize:11, marginTop:4, fontWeight: ativo ? 700 : 400, color: ativo ? "#071d70" : concluido ? "#10b981" : "#94a3b8" }}>
                    {label}
                  </span>
                </div>
                {i < etapas.length - 1 && (
                  <div style={{ height:2, flex:1, backgroundColor: concluido ? "#10b981" : "#e2e8f0", marginBottom:16, transition:"background 0.3s" }}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <main style={{ padding:"28px 36px", maxWidth:1200, margin:"0 auto" }}>

        {/* ══════════════ TELA 1: BUSCA ══════════════ */}
        {etapa === 1 && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:28 }}>
            <div style={S.card}>
              <h2 style={{ color:"#071d70", margin:"0 0 4px 0" }}>Buscar viagens</h2>
              <p style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>Preencha os dados para encontrar as melhores opções.</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

                {/* Origem */}
                <div>
                  <label style={S.label}>📍 Origem</label>
                  <select style={S.select} value={origem} onChange={e => setOrigem(e.target.value)}>
                    <option value="">Selecione a cidade</option>
                    {CIDADES.filter(c => c !== destino).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Destino */}
                <div>
                  <label style={S.label}>📍 Destino</label>
                  <select style={S.select} value={destino} onChange={e => setDestino(e.target.value)}>
                    <option value="">Selecione a cidade</option>
                    {CIDADES.filter(c => c !== origem).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Data */}
                <div>
                  <label style={S.label}>📅 Data da viagem</label>
                  <input type="date" style={S.input} value={data} min={hoje()} onChange={e => setData(e.target.value)} />
                </div>

                {/* Horário */}
                <div>
                  <label style={S.label}>🕒 Horário</label>
                  <select style={S.select} value={horario} onChange={e => setHorario(e.target.value)}>
                    <option value="">Selecione o horário</option>
                    <optgroup label="Manhã (05h–12h)">
                      {HORARIOS.filter(h => parseInt(h) < 12).map(h => <option key={h} value={h}>{h}</option>)}
                    </optgroup>
                    <optgroup label="Tarde (12h–18h)">
                      {HORARIOS.filter(h => parseInt(h) >= 12 && parseInt(h) < 18).map(h => <option key={h} value={h}>{h}</option>)}
                    </optgroup>
                    <optgroup label="Noite (18h–24h)">
                      {HORARIOS.filter(h => parseInt(h) >= 18).map(h => <option key={h} value={h}>{h}</option>)}
                    </optgroup>
                  </select>
                </div>

                {/* Tipo de serviço */}
                <div>
                  <label style={S.label}>🚌 Tipo de serviço</label>
                  <select style={S.select} value={tipoServico} onChange={e => setTipoServico(e.target.value)}>
                    <option value="">Selecione o tipo</option>
                    {TIPOS_SERVICO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Passageiros */}
                <div>
                  <label style={S.label}>👤 Passageiros</label>
                  <select style={S.select} value={passageiros} onChange={e => setPassageiros(Number(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} passageiro{n>1?"s":""}</option>)}
                  </select>
                </div>
              </div>

              {erroBusca && (
                <div style={S.erro}>
                  <AlertCircle size={15}/> {erroBusca}
                </div>
              )}

              {/* Preview de preço */}
              {origem && destino && tipoServico && (
                <div style={{ backgroundColor:"#f0f5ff", border:"1px solid #c7d7f8", borderRadius:8, padding:"12px 16px", marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:"#071d70" }}>Preço estimado por passageiro ({tipoServico})</span>
                  <span style={{ fontSize:20, fontWeight:800, color:"#071d70" }}>R$ {preco},00</span>
                </div>
              )}

              <button onClick={handleBuscar} style={{ ...S.btn, width:"100%", marginTop:20, fontSize:16 }}>
                <Search size={17}/> Buscar viagens
              </button>
            </div>

            {/* Coluna direita informativa */}
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ ...S.card, backgroundColor:"#f8fafc" }}>
                <h3 style={{ color:"#071d70", marginTop:0, fontSize:15 }}>Viaje com mais praticidade</h3>
                <p style={{ fontSize:13, color:"#334155", margin:"8px 0" }}>📱 <b>Bilhete digital:</b> Receba via SMS após o pagamento.</p>
                <p style={{ fontSize:13, color:"#334155", margin:"8px 0" }}>💳 <b>Pagamento seguro:</b> PIX, cartão ou NFC.</p>
                <p style={{ fontSize:13, color:"#334155", margin:"8px 0" }}>🕒 <b>Sem filas:</b> Autoatendimento rápido.</p>
              </div>
              <div style={{ ...S.card, background:"linear-gradient(135deg,#071d70,#0b2da8)", color:"white" }}>
                <h4 style={{ margin:"0 0 8px 0" }}>🔒 Seus dados estão seguros</h4>
                <p style={{ fontSize:12, margin:0, opacity:0.88 }}>Seguimos o padrão PCI DSS. Nenhum dado sensível de cartão é armazenado.</p>
              </div>
              <div style={{ ...S.card, border:"1px solid #bbf7d0", backgroundColor:"#f0fdf4" }}>
                <p style={{ fontSize:13, color:"#166534", margin:0 }}>⚡ Resultados em até <b>5 segundos</b> com as melhores ofertas destacadas.</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TELA 3: ASSENTOS ══════════════ */}
        {etapa === 3 && (
          <div style={{ display:"grid", gridTemplateColumns:"260px 1fr 220px", gap:22 }}>

            {/* Esquerda: resumo viagem */}
            <div style={S.card}>
              <h3 style={{ color:"#071d70", marginTop:0, fontSize:16 }}>Sua viagem</h3>
              <div style={{ fontSize:13, display:"flex", flexDirection:"column", gap:8 }}>
                <p style={{ margin:0 }}><b>Origem:</b> {origem}</p>
                <p style={{ margin:0 }}><b>Destino:</b> {destino}</p>
                <p style={{ margin:0 }}><b>Data:</b> {formatarData(data)}</p>
                <p style={{ margin:0 }}><b>Horário:</b> {horario}</p>
                <p style={{ margin:0 }}><b>Serviço:</b> {tipoServico}</p>
                <p style={{ margin:0 }}><b>Passageiros:</b> {passageiros}</p>
              </div>
              <hr style={{ border:"none", borderTop:"1px solid #e8edf5", margin:"16px 0" }}/>
              <p style={{ fontSize:12, color:"#64748b", margin:"0 0 4px" }}>Total estimado</p>
              <h2 style={{ color:"#071d70", margin:0, fontSize:24 }}>R$ {preco * passageiros},00</h2>
              <button onClick={() => setEtapa(1)} style={{ ...S.btnSecundario, width:"100%", marginTop:18, textAlign:"center" }}>
                ‹ Voltar
              </button>
            </div>

            {/* Centro: mapa do ônibus */}
            <div style={S.card}>
              <h3 style={{ color:"#071d70", textAlign:"center", margin:"0 0 4px" }}>
                Selecione {passageiros === 1 ? "seu assento" : `os ${passageiros} assentos`}
              </h3>
              <p style={{ fontSize:13, color:"#64748b", textAlign:"center", marginBottom:20 }}>
                {assentosSelecionados.length} de {passageiros} assento{passageiros > 1 ? "s" : ""} selecionado{assentosSelecionados.length !== 1 ? "s" : ""}.
              </p>

              {/* Legenda */}
              <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:18, fontSize:12 }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:16,height:16,borderRadius:4,backgroundColor:"white",border:"1.5px solid #cbd5e1",display:"inline-block" }}/> Disponível</span>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:16,height:16,borderRadius:4,backgroundColor:"#86efac",display:"inline-block" }}/> Selecionado</span>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:16,height:16,borderRadius:4,backgroundColor:"#fca5a5",display:"inline-block" }}/> Ocupado</span>
              </div>

              <div style={{ backgroundColor:"#ecf0f9", padding:"7px 12px", borderRadius:7, textAlign:"center", fontSize:13, color:"#071d70", fontWeight:600, marginBottom:20 }}>
                🚌 Frente do ônibus
              </div>

              <div style={{ display:"flex", justifyContent:"center", gap:36 }}>
                {[LAYOUT_ESQUERDA, LAYOUT_DIREITA].map((lado, li) => (
                  <div key={li} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {lado.map((par, idx) => (
                      <div key={idx} style={{ display:"flex", gap:8 }}>
                        {par.map(num => {
                          const n = Number(num);
                          const ocupado = assentosOcupados.has(n);
                          const selecionado = assentosSelecionados.includes(n);
                          const cheio = assentosSelecionados.length >= passageiros && !selecionado;
                          return (
                            <button
                              key={num}
                              disabled={ocupado || cheio}
                              onClick={() => {
                                if (selecionado) {
                                  setAssentosSelecionados(prev => prev.filter(a => a !== n));
                                } else {
                                  setAssentosSelecionados(prev => [...prev, n]);
                                }
                              }}
                              style={{
                                width:46, height:40, borderRadius:7,
                                border: selecionado ? "2px solid #16a34a" : ocupado ? "1.5px solid #f87171" : "1.5px solid #cbd5e1",
                                fontWeight:700, fontSize:13,
                                cursor: ocupado || cheio ? "not-allowed" : "pointer",
                                backgroundColor: selecionado ? "#86efac" : ocupado ? "#fee2e2" : "white",
                                color: selecionado ? "#166534" : ocupado ? "#b91c1c" : "#1e293b",
                                opacity: cheio ? 0.45 : 1,
                                transition:"all 0.15s"
                              }}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Direita: assentos selecionados */}
            <div style={{ ...S.card, backgroundColor:"#ecf2ff", textAlign:"center", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
              {assentosSelecionados.length > 0 ? (
                <>
                  <span style={{ fontSize:13, color:"#071d70", fontWeight:700 }}>
                    {assentosSelecionados.length === 1 ? "Assento selecionado" : "Assentos selecionados"}
                  </span>
                  <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, margin:"14px 0" }}>
                    {assentosSelecionados.map(a => (
                      <span key={a} style={{ fontSize:24, fontWeight:800, color:"#071d70", backgroundColor:"white", borderRadius:8, padding:"6px 12px", border:"2px solid #c7d7f8" }}>
                        {String(a).padStart(2,"0")}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize:16, fontWeight:700, color:"#1e293b", margin:0 }}>R$ {preco * passageiros},00</p>
                  {assentosSelecionados.length < passageiros && (
                    <p style={{ fontSize:12, color:"#f59e0b", marginTop:8, fontWeight:600 }}>
                      Selecione mais {passageiros - assentosSelecionados.length} assento{passageiros - assentosSelecionados.length > 1 ? "s" : ""}
                    </p>
                  )}
                  {assentosSelecionados.length === passageiros && (
                    <button onClick={handleContinuarParaPagamento} style={{ ...S.btn, width:"100%", marginTop:20 }}>
                      Continuar
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize:38 }}>🪑</div>
                  <p style={{ fontSize:13, color:"#64748b", marginTop:10 }}>Nenhum assento selecionado</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ TELA 4: PAGAMENTO ══════════════ */}
        {etapa === 4 && (
          <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:28 }}>

            {/* Esquerda: resumo */}
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={S.card}>
                <h4 style={{ color:"#071d70", margin:"0 0 12px" }}>Resumo da viagem</h4>
                <div style={{ fontSize:13, display:"flex", flexDirection:"column", gap:6 }}>
                  <p style={{ margin:0 }}><b>Origem:</b> {origem}</p>
                  <p style={{ margin:0 }}><b>Destino:</b> {destino}</p>
                  <p style={{ margin:0 }}><b>Data:</b> {formatarData(data)} às {horario}</p>
                  <p style={{ margin:0 }}><b>Assento{assentosSelecionados.length > 1 ? "s" : ""}:</b> {assentosSelecionados.map(a => String(a).padStart(2,"0")).join(", ")} — {tipoServico}</p>
                  <p style={{ margin:0 }}><b>Passageiros:</b> {passageiros}</p>
                </div>
              </div>
              <div style={S.card}>
                <h4 style={{ color:"#071d70", margin:"0 0 12px" }}>Detalhes do pagamento</h4>
                <div style={{ fontSize:13, display:"flex", flexDirection:"column", gap:6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}><span>Passagem ({passageiros}x)</span><span>R$ {preco * passageiros},00</span></div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}><span>Taxa de serviço</span><span style={{ color:"#10b981" }}>Grátis</span></div>
                  <hr style={{ border:"none", borderTop:"1px solid #e8edf5", margin:"8px 0" }}/>
                  <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:16, color:"#071d70" }}>
                    <span>Total</span><span>R$ {preco * passageiros},00</span>
                  </div>
                </div>
              </div>
              <div style={{ ...S.card, backgroundColor:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <ShieldCheck size={16} color="#16a34a" style={{ flexShrink:0, marginTop:1 }}/>
                  <p style={{ fontSize:12, color:"#166534", margin:0 }}>
                    <b>Seus dados estão seguros.</b> Não armazenamos dados de cartão. Padrão PCI DSS.
                  </p>
                </div>
              </div>
            </div>

            {/* Direita: formulário */}
            <div style={S.card}>
              <h2 style={{ color:"#071d70", margin:"0 0 4px" }}>Pagamento</h2>
              <p style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>Preencha seus dados e escolha a forma de pagamento.</p>

              {/* RF06: Dados do usuário */}
              <div style={{ backgroundColor:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:18, marginBottom:24 }}>
                <h4 style={{ color:"#071d70", margin:"0 0 14px", fontSize:14 }}>Dados do passageiro</h4>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={S.label}>Nome completo</label>
                    <input style={S.input} placeholder="Seu nome completo" value={nomeUsuario} onChange={e => setNomeUsuario(e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Telefone (WhatsApp/SMS)</label>
                    <input style={S.input} placeholder="(11) 99999-9999" value={telefone}
                      onChange={e => setTelefone(formatarTelefone(e.target.value))} />
                  </div>
                  <div>
                    <label style={S.label}>E-mail</label>
                    <input style={S.input} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                {erroUsuario && <div style={S.erro}><AlertCircle size={14}/> {erroUsuario}</div>}
              </div>

              {/* Método de pagamento */}
              <div style={{ display:"flex", gap:12, marginBottom:20 }}>
                {[
                  { id:"pix", label:"PIX", desc:"Instantâneo", icon:"⚡" },
                  { id:"cartao", label:"Cartão de crédito", desc:"Até 12x", icon:"💳" },
                ].map(m => (
                  <div key={m.id} onClick={() => setMetodoPagamento(m.id)}
                    style={{ flex:1, border: metodoPagamento === m.id ? "2px solid #2563eb" : "1.5px solid #cbd5e1",
                      borderRadius:10, padding:14, cursor:"pointer",
                      backgroundColor: metodoPagamento === m.id ? "#f0f5ff" : "white",
                      transition:"all 0.2s" }}>
                    <div style={{ fontWeight:700, color:"#071d70", fontSize:14 }}>{m.icon} {m.label}</div>
                    <div style={{ fontSize:12, color:"#64748b" }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              {/* PIX */}
              {metodoPagamento === "pix" && (
                <div style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:22, display:"flex", gap:22, alignItems:"center", backgroundColor:"#fdfdfd", marginBottom:20 }}>
                  <div style={{ border:"1px solid #cbd5e1", padding:10, borderRadius:8, backgroundColor:"white", flexShrink:0 }}>
                    <QrCode size={110} color="#071d70"/>
                  </div>
                  <div style={{ fontSize:13 }}>
                    <p style={{ margin:"0 0 6px", fontWeight:700, color:"#071d70" }}>Como pagar com PIX:</p>
                    <p style={{ margin:"0 0 5px" }}>1. Abra o app do seu banco</p>
                    <p style={{ margin:"0 0 5px" }}>2. Escolha a opção PIX</p>
                    <p style={{ margin:"0 0 14px" }}>3. Escaneie o QR Code ao lado</p>
                    <span style={{ fontSize:12, color:"#64748b", backgroundColor:"#fef3c7", padding:"4px 10px", borderRadius:20 }}>⏱ Expira em 15:00 min</span>
                  </div>
                </div>
              )}

              {/* Cartão */}
              {metodoPagamento === "cartao" && (
                <div style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:20, marginBottom:20, backgroundColor:"#fdfdfd" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={S.label}>Número do cartão</label>
                      <input style={S.input} placeholder="0000 0000 0000 0000" value={numeroCartao}
                        onChange={e => setNumeroCartao(formatarCartao(e.target.value))} />
                    </div>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={S.label}>Nome no cartão</label>
                      <input style={S.input} placeholder="Como aparece no cartão" value={nomeCartao}
                        onChange={e => setNomeCartao(e.target.value.replace(/[^a-zA-ZÀ-ú\s]/g, ""))} />
                    </div>
                    <div>
                      <label style={S.label}>Validade</label>
                      <input style={S.input} placeholder="MM/AA" value={validade}
                        onChange={e => setValidade(formatarValidade(e.target.value))} />
                    </div>
                    <div>
                      <label style={S.label}>CVV</label>
                      <input style={S.input} placeholder="000" maxLength={4} value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g,""))} />
                    </div>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={S.label}>Parcelamento</label>
                      <select style={S.select}>
                        {Array.from({length:12},(_,i)=>i+1).map(n => (
                          <option key={n} value={n}>
                            {n}x de R$ {(preco * passageiros / n).toFixed(2).replace(".",",")} {n === 1 ? "(sem juros)" : n <= 3 ? "(sem juros)" : "(com juros)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {erroCartao && <div style={S.erro}><AlertCircle size={14}/> {erroCartao}</div>}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14, backgroundColor:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"9px 12px" }}>
                    <ShieldCheck size={14} color="#16a34a"/>
                    <p style={{ fontSize:12, color:"#166534", margin:0 }}>Dados do cartão não são armazenados. Transação criptografada via HTTPS.</p>
                  </div>
                </div>
              )}

              {/* RF08: Nota fiscal */}
              <div style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:18, marginBottom:20, backgroundColor:"#f8fafc" }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#071d70", margin:"0 0 12px" }}>Deseja receber nota fiscal?</p>
                <div style={{ display:"flex", gap:12 }}>
                  <button onClick={() => setQuerNF(true)}
                    style={{ flex:1, padding:"10px", borderRadius:8, border: querNF === true ? "2px solid #2563eb" : "1.5px solid #cbd5e1",
                      backgroundColor: querNF === true ? "#f0f5ff" : "white", cursor:"pointer", fontWeight:600, color:"#071d70" }}>
                    ✅ Sim
                  </button>
                  <button onClick={() => { setQuerNF(false); setCpfNF(""); }}
                    style={{ flex:1, padding:"10px", borderRadius:8, border: querNF === false ? "2px solid #64748b" : "1.5px solid #cbd5e1",
                      backgroundColor: querNF === false ? "#f8fafc" : "white", cursor:"pointer", fontWeight:600, color:"#64748b" }}>
                    ❌ Não
                  </button>
                </div>
                {querNF === true && (
                  <div style={{ marginTop:12 }}>
                    <label style={S.label}>CPF / CNPJ</label>
                    <input style={S.input} placeholder="Informe o CPF ou CNPJ" value={cpfNF}
                      onChange={e => setCpfNF(e.target.value.replace(/[^\d./-]/g,""))} />
                    <p style={{ fontSize:11, color:"#64748b", margin:"6px 0 0" }}>A nota será enviada para {email || "o e-mail informado acima"}.</p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                <button onClick={() => setEtapa(3)} style={S.btnSecundario}>‹ Voltar</button>
                <button onClick={handleConfirmarPagamento} disabled={processando}
                  style={{ ...S.btn, flex:1, opacity: processando ? 0.8 : 1 }}>
                  {processando ? <><span>⏳</span> Processando...</> : <><span>🔒</span> Confirmar pagamento — R$ {preco * passageiros},00</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TELA 5: CONFIRMAÇÃO ══════════════ */}
        {etapa === 5 && (
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{ ...S.card, textAlign:"center", padding:40 }}>
              <div style={{ fontSize:56, marginBottom:10 }}>🎉</div>
              <h2 style={{ color:"#16a34a", margin:"0 0 8px" }}>Passagem confirmada!</h2>
              <p style={{ color:"#64748b", marginBottom:28 }}>Boa viagem, {nomeUsuario.split(" ")[0] || "passageiro"}!</p>

              {/* Bilhete */}
              <div style={{ border:"2px dashed #cbd5e1", borderRadius:12, padding:"20px 28px", backgroundColor:"#f8fafc", marginBottom:24, textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ margin:0, color:"#071d70" }}>BUSS<span style={{ color:"#10b981" }}>PASS</span></h3>
                  <span style={{ backgroundColor:"#dcfce7", color:"#166534", fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>✓ CONFIRMADO</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:13 }}>
                  <div><b style={{ color:"#64748b" }}>ORIGEM</b><br/>{origem}</div>
                  <div><b style={{ color:"#64748b" }}>DESTINO</b><br/>{destino}</div>
                  <div><b style={{ color:"#64748b" }}>DATA</b><br/>{formatarData(data)} às {horario}</div>
                  <div><b style={{ color:"#64748b" }}>ASSENTO{assentosSelecionados.length > 1 ? "S" : ""}</b><br/>{assentosSelecionados.map(a => String(a).padStart(2,"0")).join(", ")} — {tipoServico}</div>
                  <div><b style={{ color:"#64748b" }}>PASSAGEIRO</b><br/>{nomeUsuario}</div>
                  <div><b style={{ color:"#64748b" }}>VALOR PAGO</b><br/>R$ {preco * passageiros},00</div>
                </div>
                <hr style={{ border:"none", borderTop:"1px dashed #cbd5e1", margin:"16px 0" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <b style={{ color:"#64748b", fontSize:11 }}>CÓDIGO DO BILHETE</b>
                    <div style={{ fontFamily:"monospace", fontSize:22, fontWeight:800, color:"#071d70", letterSpacing:3 }}>{bilheteCodigo}</div>
                  </div>
                  <Ticket size={36} color="#071d70" opacity={0.2}/>
                </div>
              </div>

              {/* SMS */}
              <div style={{ border:"1px solid #e2e8f0", borderRadius:10, padding:16, marginBottom:16, backgroundColor:"#f8fafc" }}>
                {smsEnviado ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", color:"#16a34a" }}>
                    <CheckCircle2 size={18}/>
                    <span style={{ fontWeight:600, fontSize:14 }}>Bilhete enviado por SMS para {telefone}</span>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", color:"#64748b" }}>
                    <span style={{ fontSize:14 }}>⏳ Enviando bilhete por SMS...</span>
                  </div>
                )}
              </div>

              {/* Reenvio */}
              {smsEnviado && (
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontSize:13, color:"#64748b", margin:"0 0 10px" }}>Não recebeu o SMS?</p>
                  <button onClick={handleReenviarSMS} disabled={reenviando}
                    style={{ ...S.btnSecundario, display:"inline-flex", alignItems:"center", gap:8, margin:"0 auto" }}>
                    <RefreshCw size={14} style={{ animation: reenviando ? "spin 1s linear infinite" : "none" }}/>
                    {reenviando ? "Reenviando..." : "Reenviar bilhete"}
                  </button>
                  {reenviadoOk && (
                    <p style={{ fontSize:13, color:"#16a34a", marginTop:8, fontWeight:600 }}>✓ SMS reenviado com sucesso!</p>
                  )}
                </div>
              )}

              {/* Nota fiscal */}
              {querNF === true && (
                <div style={{ backgroundColor:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:14, marginBottom:20 }}>
                  <p style={{ fontSize:13, color:"#166534", margin:0 }}>
                    <b>✅ Nota fiscal será enviada para {email}</b> em até 24 horas úteis.
                  </p>
                </div>
              )}

              <button onClick={() => { setEtapa(1); setOrigem(""); setDestino(""); setData(""); setHorario(""); setTipoServico(""); setPassageiros(1); setAssentosSelecionados([]); setNomeUsuario(""); setTelefone(""); setEmail(""); setMetodoPagamento("pix"); setNumeroCartao(""); setNomeCartao(""); setValidade(""); setCvv(""); setQuerNF(null); setCpfNF(""); setSmsEnviado(false); }}
                style={{ ...S.btn, margin:"0 auto", paddingLeft:40, paddingRight:40 }}>
                <Bus size={16}/> Nova busca
              </button>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
        button:hover { filter: brightness(0.96); }
      `}</style>
    </div>
  );
}
