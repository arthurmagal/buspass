import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, User, Bus, CheckCircle2, CreditCard, QrCode, ArrowLeftRight, ChevronLeft, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  // Controle de telas: 1 = Busca, 3 = Assentos, 4 = Pagamento
  const [etapa, setEtapa] = useState(1);
  const [assentoSelecionado, setAssentoSelecionado] = useState(17);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');

  // Lista de assentos fictícia para a tela 3 (Simulando o layout do ônibus do print)
  const assentosEsquerda = [
    ['01', '02'], ['05', '06'], ['09', '10'], ['13', '14'], 
    ['17', '18'], ['21', '22'], ['25', '26'], ['29', '30']
  ];
  const assentosDireita = [
    ['03', '04'], ['07', '08'], ['11', '12'], ['15', '16'], 
    ['19', '20'], ['23', '24'], ['27', '28'], ['31', '32']
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f7fa', minHeight: '100vh', color: '#1e293b', margin: 0, padding: 0 }}>
      
      {/* HEADER PRINCIPAL */}
      <header style={{ backgroundColor: '#071d70', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          BUSS<span style={{ color: '#10b981' }}>PASS</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', fontSize: '14px', opacity: 0.9 }}>
          <span>🕒 04:20</span>
          <span>Viagem para: São Paulo - SP ▾</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><HelpCircle size={16}/> Ajuda</span>
        </div>
      </header>

      {/* BARRA DE PROGRESSO DE ETAPAS */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', gap: '30px', fontSize: '14px' }}>
        <span style={{ fontWeight: etapa === 1 ? 'bold' : 'normal', color: etapa === 1 ? '#071d70' : '#94a3b8' }}>🔵 1. Busca</span>
        <span style={{ color: '#94a3b8' }}>— 2. Viagem</span>
        <span style={{ fontWeight: etapa === 3 ? 'bold' : 'normal', color: etapa === 3 ? '#071d70' : '#94a3b8' }}>{etapa >= 3 ? '🔵' : '⚪'} 3. Assentos</span>
        <span style={{ fontWeight: etapa === 4 ? 'bold' : 'normal', color: etapa === 4 ? '#071d70' : '#94a3b8' }}>{etapa >= 4 ? '🔵' : '⚪'} 4. Pagamento</span>
        <span style={{ color: '#94a3b8' }}>— 5. Confirmação</span>
      </div>

      {/* CONTEÚDO PRINCIPAL DAS TELAS */}
      <main style={{ padding: '30px 40px', maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* ================= TELA 1: BUSCA ================= */}
        {etapa === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
              
              {/* Painel de busca esquerdo */}
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{ color: '#071d70', marginTop: 0, marginBottom: '5px' }}>Buscar viagens</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Informe os dados da sua viagem para encontrar as melhores opções.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#071d70', fontWeight: 'bold' }}>📍 Origem</label>
                    <input type="text" defaultValue="São Paulo - SP" style={{ width: '100%', border: 'none', outline: 'none', fontWeight: '600', marginTop: '4px', fontSize: '15px' }} />
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#071d70', fontWeight: 'bold' }}>📍 Destino</label>
                    <input type="text" defaultValue="Rio de Janeiro - RJ" style={{ width: '100%', border: 'none', outline: 'none', fontWeight: '600', marginTop: '4px', fontSize: '15px' }} />
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#071d70', fontWeight: 'bold' }}>📅 Data da viagem</label>
                    <input type="text" defaultValue="25/05/2026" style={{ width: '100%', border: 'none', outline: 'none', fontWeight: '600', marginTop: '4px', fontSize: '15px' }} />
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#071d70', fontWeight: 'bold' }}>🕒 Horário</label>
                    <select style={{ width: '100%', border: 'none', outline: 'none', fontWeight: '600', marginTop: '4px', fontSize: '15px', backgroundColor: 'transparent' }}>
                      <option>Qualquer horário</option>
                    </select>
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#071d70', fontWeight: 'bold' }}>🚌 Tipo de serviço</label>
                    <select style={{ width: '100%', border: 'none', outline: 'none', fontWeight: '600', marginTop: '4px', fontSize: '15px', backgroundColor: 'transparent' }}>
                      <option>Todos os tipos</option>
                    </select>
                  </div>
                  <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#071d70', fontWeight: 'bold' }}>👤 Passageiros</label>
                    <select style={{ width: '100%', border: 'none', outline: 'none', fontWeight: '600', marginTop: '4px', fontSize: '15px', backgroundColor: 'transparent' }}>
                      <option>1 Passageiro</option>
                    </select>
                  </div>
                </div>

                <button onClick={() => setEtapa(3)} style={{ width: '100%', backgroundColor: '#071d70', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Search size={18} /> Buscar viagens
                </button>
              </div>

              {/* Lado Direito Informativo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ color: '#071d70', marginTop: 0 }}>Viaje com mais praticidade</h3>
                  <p style={{ fontSize: '14px', color: '#334155' }}>📱 <b>Bilhete digital:</b> Receba seu bilhete por SMS.</p>
                  <p style={{ fontSize: '14px', color: '#334155' }}>💳 <b>Pagamento seguro:</b> Pague com PIX, cartão ou aproximação.</p>
                  <p style={{ fontSize: '14px', color: '#334155' }}>🕒 <b>Mais agilidade:</b> Autoatendimento rápido e sem filas.</p>
                </div>
                <div style={{ backgroundColor: '#071d70', color: 'white', padding: '25px', borderRadius: '12px', backgroundImage: 'linear-gradient(135deg, #071d70, #0b2da8)' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Melhores preços para você</h4>
                  <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>Compare opções de horários, tipos de ônibus e preços rapidamente.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TELA 3: ASSENTOS ================= */}
        {etapa === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '25px' }}>
            
            {/* Lateral Esquerda: Detalhes da Viagem */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#071d70', marginTop: 0, fontSize: '16px' }}>Sua viagem</h3>
              <p style={{ fontSize: '13px' }}><b>Origem:</b> São Paulo - SP</p>
              <p style={{ fontSize: '13px' }}><b>Destino:</b> Campinas - SP</p>
              <p style={{ fontSize: '13px' }}><b>Data:</b> 25 de Maio de 2026</p>
              <p style={{ fontSize: '13px' }}><b>Empresa:</b> Viação Exemplo</p>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '15px 0' }} />
              <p style={{ fontSize: '12px', color: '#64748b' }}>Total</p>
              <h2 style={{ color: '#071d70', margin: 0 }}>R$ 45,00</h2>
              <button onClick={() => setEtapa(1)} style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold', color: '#64748b' }}>
                ‹ Voltar
              </button>
            </div>

            {/* Centro: O Desenho do Ônibus */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#071d70', textAlign: 'center' }}>Selecione seus assentos</h3>
              <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '25px' }}>Clique em um assento disponível para selecioná-lo.</p>
              
              <div style={{ backgroundColor: '#ecf0f9', padding: '8px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', color: '#071d70', fontWeight: '5px', marginBottom: '20px' }}>
                🚌 Frente do ônibus
              </div>

              {/* Corredor e Poltronas baseadas no seu mock-up */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                {/* Lado Esquerdo do Corredor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {assentosEsquerda.map((par, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                      {par.map(num => (
                        <button 
                          key={num} 
                          onClick={() => setAssentoSelecionado(Number(num))}
                          style={{
                            width: '45px', height: '40px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', cursor: 'pointer',
                            backgroundColor: assentoSelecionado === Number(num) ? '#86efac' : 'white',
                            color: assentoSelecionado === Number(num) ? '#166534' : '#1e293b'
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Lado Direito do Corredor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {assentosDireita.map((par, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                      {par.map(num => (
                        <button 
                          key={num} 
                          onClick={() => setAssentoSelecionado(Number(num))}
                          style={{
                            width: '45px', height: '40px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', cursor: 'pointer',
                            backgroundColor: assentoSelecionado === Number(num) ? '#86efac' : 'white',
                            color: assentoSelecionado === Number(num) ? '#166534' : '#1e293b'
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lateral Direita: Assento Selecionado */}
            <div style={{ backgroundColor: '#ecf2ff', padding: '25px', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#071d70', fontWeight: 'bold' }}>Assento selecionado</span>
              <h1 style={{ fontSize: '56px', color: '#071d70', margin: '15px 0' }}>{assentoSelecionado}</h1>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>R$ 45,00</p>
              <button onClick={() => setEtapa(4)} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer', fontSize: '15px' }}>
                Continuar
              </button>
            </div>

          </div>
        )}

        {/* ================= TELA 4: PAGAMENTO ================= */}
        {etapa === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            
            {/* Coluna Esquerda: Resumos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ color: '#071d70', margin: '0 0 15px 0' }}>Resumo da viagem</h4>
                <p style={{ fontSize: '13px' }}><b>Origem:</b> Rio de Janeiro - RJ</p>
                <p style={{ fontSize: '13px' }}><b>Destino:</b> São Paulo - SP</p>
                <p style={{ fontSize: '13px' }}><b>Data:</b> 25/05/2026</p>
                <p style={{ fontSize: '13px' }}><b>Assento:</b> Poltrona {assentoSelecionado}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ color: '#071d70', margin: '0 0 15px 0' }}>Detalhes do pagamento</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span>Valor da passagem</span> <span>R$ 60,00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '15px' }}>
                  <span>Taxa de serviço</span> <span>R$ 0,00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#10b981', fontSize: '16px' }}>
                  <span>Total a pagar</span> <span>R$ 60,00</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Métodos e Formas */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2 style={{ color: '#071d70', margin: 0 }}>Pagamento</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px', marginBottom: '25px' }}>Escolha a forma de pagamento</p>

              {/* Botão Pix */}
              <div 
                onClick={() => setMetodoPagamento('pix')}
                style={{ border: metodoPagamento === 'pix' ? '2px solid #2563eb' : '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: metodoPagamento === 'pix' ? '#f0f5ff' : 'white' }}
              >
                <input type="radio" checked={metodoPagamento === 'pix'} readOnly />
                <div>
                  <b style={{ color: '#071d70' }}>PIX</b>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Pagamento instantâneo</div>
                </div>
              </div>

              {/* Botão Cartão */}
              <div 
                onClick={() => setMetodoPagamento('cartao')}
                style={{ border: metodoPagamento === 'cartao' ? '2px solid #2563eb' : '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', marginBottom: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: metodoPagamento === 'cartao' ? '#f0f5ff' : 'white' }}
              >
                <input type="radio" checked={metodoPagamento === 'cartao'} readOnly />
                <div>
                  <b style={{ color: '#071d70' }}>Cartão de crédito</b>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Pague em até 12x</div>
                </div>
              </div>

              {/* Área Condicional do QR Code Pix */}
              {metodoPagamento === 'pix' && (
                <div style={{ border: '1px solid #e2e8f0', padding: '25px', borderRadius: '8px', display: 'flex', gap: '25px', alignItems: 'center', backgroundColor: '#fdfdfd' }}>
                  <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', backgroundColor: 'white' }}>
                    <QrCode size={120} color="#071d70" />
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    <p style={{ margin: '0 0 5px 0' }}>1. Abra o app do seu banco</p>
                    <p style={{ margin: '0 0 5px 0' }}>2. Escolha a opção PIX</p>
                    <p style={{ margin: '0 0 15px 0' }}>3. Escaneie o QR Code ao lado</p>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>🕒 O pagamento expira em 15:00 minutos</span>
                  </div>
                </div>
              )}

              {/* Rodapé de Ações */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button onClick={() => setEtapa(3)} style={{ padding: '12px 25px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ‹ Voltar
                </button>
                <button onClick={() => alert('Parabéns! Passagem comprada com sucesso. Boa viagem! 🚌')} style={{ backgroundColor: '#071d70', color: 'white', padding: '12px 35px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  Confirmar pagamento 🔒
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}