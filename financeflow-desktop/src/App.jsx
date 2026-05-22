import { useEffect, useMemo, useState } from 'react'
import { Bell, Plus, Search, Trash2, Pencil } from 'lucide-react'

export default function FinanceFlow() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [historicoPagamentos, setHistoricoPagamentos] = useState({})
  const [showHistorico, setShowHistorico] = useState(null)

  const [form, setForm] = useState({
    nome: '',
    valor: '',
    tipo: 'Mensal',
    criada: '',
    vencimento: '',
    status: 'Pendente'
  })

  const [contas, setContas] = useState([
    { id: 1, nome: 'SISTEMA SIGE', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-01', status: 'Pendente' },
    { id: 2, nome: 'PLANO DE SAUDE PORTO', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-01', status: 'Pendente' },
    { id: 3, nome: 'ADVOGADA ROBERTA', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-03', status: 'Pendente' },
    { id: 4, nome: 'INTERNET', valor: 189.9, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-05', status: 'Pendente' },
    { id: 5, nome: 'METROMED', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-05', status: 'Pendente' },
    { id: 6, nome: 'DI LIFE', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-05', status: 'Pendente' },
    { id: 7, nome: 'IPTU - RECEITA FEDERAL', valor: 1200, tipo: 'Quinzenal', criada: '2026-05-01', vencimento: '2026-06-09', status: 'Pendente' },
    { id: 8, nome: 'PLANO DE SAUDE NOTRE DAME', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-10', status: 'Pendente' },
    { id: 9, nome: 'ESCOLA CLARA', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-10', status: 'Pendente' },
    { id: 10, nome: 'ROTAEXATA', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-10', status: 'Pendente' },
    { id: 11, nome: 'PSICOLOGA NANCY', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-12', status: 'Pendente' },
    { id: 12, nome: 'AGUA BRÁS', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-14', status: 'Pendente' },
    { id: 13, nome: 'ASSINATURA INFOJOBS', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-15', status: 'Pendente' },
    { id: 14, nome: 'GOTO', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-15', status: 'Pendente' },
    { id: 15, nome: 'CONTABILIDADE', valor: 450, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-20', status: 'Pago' }
  ])

  useEffect(() => {
    const saved = localStorage.getItem('financeflow-contas')
    if (saved) {
      const parsed = JSON.parse(saved)
      const defaultContas = [
        { id: 1, nome: 'SISTEMA SIGE', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-01', status: 'Pendente' },
        { id: 2, nome: 'PLANO DE SAUDE PORTO', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-01', status: 'Pendente' },
        { id: 3, nome: 'ADVOGADA ROBERTA', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-03', status: 'Pendente' },
        { id: 4, nome: 'INTERNET', valor: 189.9, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-05', status: 'Pendente' },
        { id: 5, nome: 'METROMED', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-05', status: 'Pendente' },
        { id: 6, nome: 'DI LIFE', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-05', status: 'Pendente' },
        { id: 7, nome: 'IPTU - RECEITA FEDERAL', valor: 1200, tipo: 'Quinzenal', criada: '2026-05-01', vencimento: '2026-06-09', status: 'Pendente' },
        { id: 8, nome: 'PLANO DE SAUDE NOTRE DAME', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-10', status: 'Pendente' },
        { id: 9, nome: 'ESCOLA CLARA', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-10', status: 'Pendente' },
        { id: 10, nome: 'ROTAEXATA', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-10', status: 'Pendente' },
        { id: 11, nome: 'PSICOLOGA NANCY', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-12', status: 'Pendente' },
        { id: 12, nome: 'AGUA BRÁS', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-14', status: 'Pendente' },
        { id: 13, nome: 'ASSINATURA INFOJOBS', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-15', status: 'Pendente' },
        { id: 14, nome: 'GOTO', valor: 0, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-15', status: 'Pendente' },
        { id: 15, nome: 'CONTABILIDADE', valor: 450, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-20', status: 'Pago' }
      ]
      const merged = [
        ...defaultContas.filter(d => !parsed.some(p => p.nome === d.nome)),
        ...parsed
      ]
      setContas(merged)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('financeflow-contas', JSON.stringify(contas))
  }, [contas])

  useEffect(() => {
    const savedHistorico = localStorage.getItem('financeflow-historico')
    if (savedHistorico) setHistoricoPagamentos(JSON.parse(savedHistorico))
  }, [])

  useEffect(() => {
    localStorage.setItem('financeflow-historico', JSON.stringify(historicoPagamentos))
  }, [historicoPagamentos])

  const formatMoney = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const getDaysRemaining = (date) => {
    const today = new Date()
    const due = new Date(date)
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  }

  const getPriority = (conta) => {
    if (conta.status === 'Pago') return { label: 'Pago', color: 'green' }
    const days = getDaysRemaining(conta.vencimento)
    if (days <= 1) return { label: 'URGENTE', color: 'red' }
    if (days <= 5) return { label: 'PRÓXIMO', color: 'yellow' }
    return { label: 'OK', color: 'green' }
  }

  const filteredContas = useMemo(() =>
    contas.filter(c => c.nome.toLowerCase().includes(search.toLowerCase())),
    [search, contas]
  )

  const urgentAccounts = contas.filter(c => getPriority(c).label === 'URGENTE')
  const nextAccounts = contas.filter(c => getPriority(c).label === 'PRÓXIMO')
  const paidAccounts = contas.filter(c => c.status === 'Pago')
  const totalMonth = contas.reduce((acc, c) => acc + c.valor, 0)

  const handleSubmit = () => {
    if (!form.nome || !form.valor || !form.vencimento) return
    if (editingId) {
      setContas(prev => prev.map(c => c.id === editingId ? { ...c, ...form, valor: Number(form.valor) } : c))
    } else {
      setContas(prev => [{ id: Date.now(), ...form, valor: Number(form.valor) }, ...prev])
    }
    setShowModal(false)
    setEditingId(null)
    setForm({ nome: '', valor: '', tipo: 'Mensal', criada: '', vencimento: '', status: 'Pendente' })
  }

  const handleEdit = (conta) => {
    setEditingId(conta.id)
    setForm(conta)
    setShowModal(true)
  }

  const deleteConta = (id) => setContas(prev => prev.filter(c => c.id !== id))

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_25%),linear-gradient(to_bottom_right,#f4f4f5,#e4e4e7,#f4f4f5)] p-8 text-zinc-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-400/40 blur-2xl rounded-[30px] scale-110"></div>
                <div className="relative overflow-hidden w-24 h-24 rounded-[28px] border border-white/30 bg-white/10 backdrop-blur-3xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent"></div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 blur-xl"></div>
                  <div className="relative text-5xl drop-shadow-2xl">💸</div>
                </div>
              </div>
              <div>
                <h1 className="text-7xl font-black tracking-[-4px] bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
                <p className="text-zinc-500 text-xl mt-2 font-medium tracking-wide">
                  Sistema financeiro automático estilo Apple
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar contas..."
                className="pl-12 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl px-5 py-4 w-80 outline-none shadow-lg"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-2 shadow-2xl hover:scale-105 transition-all"
            >
              <Plus size={20} />
              Nova Conta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card title="🔥 Urgentes" value={urgentAccounts.length} />
          <Card title="⚠️ Próximas" value={nextAccounts.length} />
          <Card title="✅ Pagas" value={paidAccounts.length} />
          <Card title="💰 Total" value={formatMoney(totalMonth)} />
        </div>

        <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[35px] shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Contas Registradas</h2>
              <p className="text-zinc-500 mt-2">Prioridade automática baseada no vencimento</p>
            </div>
            <div className="flex items-center gap-3 bg-red-100 text-red-700 px-5 py-3 rounded-2xl font-semibold">
              <Bell size={20} />
              {urgentAccounts.length} contas precisam de atenção
            </div>
          </div>

          <div className="p-8 space-y-5">
            {filteredContas.map((conta) => {
              const priority = getPriority(conta)
              const days = getDaysRemaining(conta.vencimento)
              return (
                <div key={conta.id} className="bg-white/70 border border-white/50 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between shadow-xl hover:scale-[1.01] transition-all">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold">{conta.nome}</h2>
                      <span className="bg-zinc-100 px-4 py-1 rounded-full text-sm font-medium">{conta.tipo}</span>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        priority.color === 'red' ? 'bg-red-100 text-red-700' :
                        priority.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {priority.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-8 mt-5 text-zinc-600 text-lg">
                      <p>💰 Valor: <strong>{formatMoney(conta.valor)}</strong></p>
                      <p>📅 Vencimento: <strong>{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</strong></p>
                      <p>⏰ {days <= 0 ? 'Vence hoje' : `${days} dias restantes`}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6 lg:mt-0">
                    <select
                      value={conta.status}
                      onChange={(e) => {
                        const newStatus = e.target.value
                        if (newStatus === 'Pago' && conta.status !== 'Pago') {
                          const agora = new Date()
                          const registro = {
                            id: Date.now(),
                            valor: conta.valor,
                            data: agora.toLocaleDateString('pt-BR'),
                            hora: agora.toLocaleTimeString('pt-BR'),
                            timestamp: agora.toISOString()
                          }
                          setHistoricoPagamentos(prev => ({
                            ...prev,
                            [conta.nome]: [...(prev[conta.nome] || []), registro]
                          }))
                        }
                        setContas(prev => prev.map(c => c.id === conta.id ? { ...c, status: newStatus } : c))
                      }}
                      className="bg-zinc-100 px-5 py-3 rounded-2xl outline-none"
                    >
                      <option>Pendente</option>
                      <option>Pago</option>
                      <option>Solicitado</option>
                    </select>
                    <button onClick={() => setShowHistorico(conta.nome)} className="bg-blue-500 text-white px-5 py-4 rounded-2xl font-semibold">
                      Histórico
                    </button>
                    <button onClick={() => handleEdit(conta)} className="bg-black text-white p-4 rounded-2xl">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => deleteConta(conta.id)} className="bg-red-500 text-white p-4 rounded-2xl">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showHistorico && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-3xl rounded-[35px] shadow-2xl p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold">{showHistorico}</h2>
                  <p className="text-zinc-500 mt-2">Histórico completo de pagamentos</p>
                </div>
                <button onClick={() => setShowHistorico(null)} className="bg-zinc-200 px-5 py-3 rounded-2xl font-semibold">
                  Fechar
                </button>
              </div>
              <div className="space-y-4">
                {(historicoPagamentos[showHistorico] || []).length === 0 && (
                  <div className="bg-zinc-100 rounded-3xl p-8 text-center text-zinc-500">
                    Nenhum pagamento registrado.
                  </div>
                )}
                {(historicoPagamentos[showHistorico] || [])
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((registro) => (
                    <div key={registro.id} className="bg-white border border-zinc-200 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                      <div>
                        <h3 className="text-2xl font-bold">{showHistorico}</h3>
                        <p className="text-zinc-500 mt-2 text-lg">Pagamento realizado em {registro.data}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-green-600">{formatMoney(registro.valor)}</p>
                        <p className="text-zinc-500 mt-1">{registro.hora}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-2xl rounded-[35px] shadow-2xl p-8">
              <h2 className="text-4xl font-bold mb-8">{editingId ? 'Editar Conta' : 'Nova Conta'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Nome da Conta" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                <Input label="Valor" type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
                <div>
                  <label className="font-semibold text-zinc-700 block mb-2">Tipo</label>
                  <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full bg-zinc-100 rounded-2xl px-5 py-4 outline-none">
                    <option>Mensal</option>
                    <option>Semanal</option>
                    <option>Quinzenal</option>
                    <option>Anual</option>
                  </select>
                </div>
                <Input label="Data de Criação" type="date" value={form.criada} onChange={(e) => setForm({ ...form, criada: e.target.value })} />
                <Input label="Vencimento Final" type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} />
              </div>
              <div className="flex justify-end gap-4 mt-10">
                <button onClick={() => setShowModal(false)} className="bg-zinc-200 px-6 py-4 rounded-2xl font-semibold">Cancelar</button>
                <button onClick={handleSubmit} className="bg-black text-white px-6 py-4 rounded-2xl font-semibold">Salvar Conta</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[32px] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.10)] overflow-hidden min-h-[180px] flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center gap-3 text-zinc-500 text-xl font-medium">
        <span>{title.split(' ')[0]}</span>
        <span>{title.replace(title.split(' ')[0], '').trim()}</span>
      </div>
      <div className="mt-6 overflow-hidden">
        <h2 className="text-[42px] leading-none font-black tracking-[-2px] text-zinc-900 truncate">{value}</h2>
      </div>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="font-semibold text-zinc-700 block mb-2">{label}</label>
      <input {...props} className="w-full bg-zinc-100 rounded-2xl px-5 py-4 outline-none" />
    </div>
  )
}
