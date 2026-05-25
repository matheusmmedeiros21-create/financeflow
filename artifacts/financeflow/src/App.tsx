import { useEffect, useMemo, useState } from 'react'
import { Bell, Plus, Search, Trash2, Pencil, X, CalendarClock, List } from 'lucide-react'

interface Conta {
  id: number
  nome: string
  valor: number
  tipo: string
  criada: string
  vencimento: string
  status: string
}

interface RegistroPagamento {
  id: number
  valor: number
  data: string
  hora: string
  timestamp: string
}

const DEFAULT_CONTAS: Conta[] = [
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
  { id: 15, nome: 'CONTABILIDADE', valor: 450, tipo: 'Mensal', criada: '2026-05-01', vencimento: '2026-06-20', status: 'Pago' },
]

const EMPTY_FORM = {
  nome: '',
  valor: '',
  tipo: 'Mensal',
  criada: '',
  vencimento: '',
  status: 'Pendente',
}

type Tab = 'contas' | 'vencimentos'

export default function FinanceFlow() {
  const [tab, setTab] = useState<Tab>('contas')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [historicoPagamentos, setHistoricoPagamentos] = useState<Record<string, RegistroPagamento[]>>({})
  const [showHistorico, setShowHistorico] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [contas, setContas] = useState<Conta[]>(DEFAULT_CONTAS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('financeflow-contas')
      if (saved) {
        const parsed: Conta[] = JSON.parse(saved)
        const merged = [
          ...DEFAULT_CONTAS.filter(d => !parsed.some(p => p.nome === d.nome)),
          ...parsed,
        ]
        setContas(merged)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('financeflow-contas', JSON.stringify(contas))
    } catch { /* ignore */ }
  }, [contas])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('financeflow-historico')
      if (saved) setHistoricoPagamentos(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('financeflow-historico', JSON.stringify(historicoPagamentos))
    } catch { /* ignore */ }
  }, [historicoPagamentos])

  const formatMoney = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const getDaysRemaining = (date: string) => {
    const today = new Date()
    const due = new Date(date + 'T12:00:00')
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getVencimentoColor = (conta: Conta): 'red' | 'yellow' | 'blue' | 'green' | 'default' => {
    if (conta.status === 'Pago') return 'green'
    if (conta.status === 'Solicitado') return 'blue'
    const days = getDaysRemaining(conta.vencimento)
    if (days <= 0) return 'red'
    if (days <= 5) return 'yellow'
    return 'default'
  }

  const getPriority = (conta: Conta) => {
    if (conta.status === 'Pago') return { label: 'Pago', color: 'green' }
    const days = getDaysRemaining(conta.vencimento)
    if (days <= 1) return { label: 'URGENTE', color: 'red' }
    if (days <= 5) return { label: 'PRÓXIMO', color: 'yellow' }
    return { label: 'OK', color: 'green' }
  }

  const filteredContas = useMemo(
    () => contas.filter(c => c.nome.toLowerCase().includes(search.toLowerCase())),
    [search, contas]
  )

  const vencimentosSorted = useMemo(
    () => [...contas].sort((a, b) => {
      const da = new Date(a.vencimento + 'T12:00:00').getTime()
      const db = new Date(b.vencimento + 'T12:00:00').getTime()
      return da - db
    }),
    [contas]
  )

  const urgentAccounts = contas.filter(c => getPriority(c).label === 'URGENTE')
  const nextAccounts = contas.filter(c => getPriority(c).label === 'PRÓXIMO')
  const paidAccounts = contas.filter(c => c.status === 'Pago')
  const totalMonth = contas.reduce((acc, c) => acc + (c.valor || 0), 0)

  const handleSubmit = () => {
    if (!form.nome.trim() || !form.vencimento) return
    if (editingId !== null) {
      setContas(prev =>
        prev.map(c => c.id === editingId ? { ...c, ...form, valor: Number(form.valor) || 0 } : c)
      )
    } else {
      setContas(prev => [{ id: Date.now(), ...form, valor: Number(form.valor) || 0 }, ...prev])
    }
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleEdit = (conta: Conta) => {
    setEditingId(conta.id)
    setForm({ ...conta, valor: String(conta.valor) } as typeof EMPTY_FORM)
    setShowModal(true)
  }

  const deleteConta = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      setContas(prev => prev.filter(c => c.id !== id))
    }
  }

  const proximoVencimento = (vencimento: string, tipo: string): string => {
    const d = new Date(vencimento + 'T12:00:00')
    switch (tipo) {
      case 'Semanal':    d.setDate(d.getDate() + 7); break
      case 'Quinzenal':  d.setDate(d.getDate() + 15); break
      case 'Anual':      d.setFullYear(d.getFullYear() + 1); break
      case 'Única':      return vencimento
      default:           d.setMonth(d.getMonth() + 1); break
    }
    return d.toISOString().split('T')[0]
  }

  const handleStatusChange = (conta: Conta, newStatus: string) => {
    if (newStatus === 'Pago' && conta.status !== 'Pago') {
      const agora = new Date()
      const registro: RegistroPagamento = {
        id: Date.now(),
        valor: conta.valor,
        data: agora.toLocaleDateString('pt-BR'),
        hora: agora.toLocaleTimeString('pt-BR'),
        timestamp: agora.toISOString(),
      }
      setHistoricoPagamentos(prev => ({
        ...prev,
        [conta.nome]: [...(prev[conta.nome] || []), registro],
      }))
      const novoVencimento = proximoVencimento(conta.vencimento, conta.tipo)
      setContas(prev => prev.map(c =>
        c.id === conta.id
          ? { ...c, status: 'Pendente', vencimento: novoVencimento }
          : c
      ))
      return
    }
    setContas(prev => prev.map(c => c.id === conta.id ? { ...c, status: newStatus } : c))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-100 relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-emerald-400/40 blur-2xl rounded-3xl scale-110" />
              <div className="relative w-20 h-20 rounded-3xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-transparent" />
                <span className="relative text-4xl select-none">💸</span>
              </div>
            </div>
            <div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent leading-none">
                FinanceFlow
              </h1>
              <p className="text-zinc-500 text-base mt-1.5 font-medium">
                Gestão financeira inteligente
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {tab === 'contas' && (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Pesquisar contas..."
                  className="pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl w-64 sm:w-72 outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-md text-zinc-800 placeholder:text-zinc-400 text-sm transition-all"
                />
              </div>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="bg-zinc-900 hover:bg-zinc-700 active:scale-95 text-white px-5 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg font-semibold text-sm transition-all"
            >
              <Plus size={18} />
              Nova Conta
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard emoji="🔥" label="Urgentes" value={String(urgentAccounts.length)} accent="red" />
          <SummaryCard emoji="⚠️" label="Próximas" value={String(nextAccounts.length)} accent="yellow" />
          <SummaryCard emoji="✅" label="Pagas" value={String(paidAccounts.length)} accent="green" />
          <SummaryCard emoji="💰" label="Total do Mês" value={formatMoney(totalMonth)} accent="blue" />
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('contas')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'contas'
                ? 'bg-zinc-900 text-white shadow-lg'
                : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <List size={16} />
            Contas Registradas
          </button>
          <button
            onClick={() => setTab('vencimentos')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'vencimentos'
                ? 'bg-zinc-900 text-white shadow-lg'
                : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <CalendarClock size={16} />
            Lista de Vencimentos
          </button>
        </div>

        {/* Tab: Contas Registradas */}
        {tab === 'contas' && (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Contas Registradas</h2>
                <p className="text-zinc-500 text-sm mt-1">Prioridade automática baseada no vencimento</p>
              </div>
              {urgentAccounts.length > 0 && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-2xl font-semibold text-sm">
                  <Bell size={16} />
                  {urgentAccounts.length} {urgentAccounts.length === 1 ? 'conta urgente' : 'contas urgentes'}
                </div>
              )}
            </div>

            <div className="divide-y divide-zinc-100/80">
              {filteredContas.length === 0 && (
                <div className="px-8 py-16 text-center text-zinc-400">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">Nenhuma conta encontrada</p>
                </div>
              )}
              {filteredContas.map(conta => {
                const priority = getPriority(conta)
                const days = getDaysRemaining(conta.vencimento)
                return (
                  <div
                    key={conta.id}
                    className="px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-zinc-900 truncate">{conta.nome}</h3>
                        <span className="bg-zinc-100 text-zinc-600 px-3 py-0.5 rounded-full text-xs font-medium border border-zinc-200">
                          {conta.tipo}
                        </span>
                        <PriorityBadge label={priority.label} color={priority.color} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                        <span>
                          💰 <span className="font-semibold text-zinc-800">{formatMoney(conta.valor)}</span>
                        </span>
                        <span>
                          📅 <span className="font-semibold text-zinc-800">
                            {new Date(conta.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </span>
                        <span className={days <= 1 && conta.status !== 'Pago' ? 'text-red-600 font-semibold' : ''}>
                          ⏰ {conta.status === 'Pago' ? 'Pago' : days <= 0 ? 'Vence hoje!' : `${days} dias restantes`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 xl:flex-nowrap xl:gap-2">
                      <select
                        value={conta.status}
                        onChange={e => handleStatusChange(conta, e.target.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold outline-none border transition-colors cursor-pointer ${
                          conta.status === 'Pago'
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : conta.status === 'Solicitado'
                            ? 'bg-blue-500 border-blue-600 text-white'
                            : 'bg-yellow-400 border-yellow-500 text-yellow-900'
                        }`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Solicitado">Solicitado</option>
                      </select>

                      <button
                        onClick={() => setShowHistorico(conta.nome)}
                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Histórico
                      </button>

                      <button
                        onClick={() => handleEdit(conta)}
                        className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 p-2.5 rounded-xl transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteConta(conta.id)}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 p-2.5 rounded-xl transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab: Lista de Vencimentos */}
        {tab === 'vencimentos' && (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-200/60">
              <h2 className="text-2xl font-bold text-zinc-900">Lista de Vencimentos</h2>
              <p className="text-zinc-500 text-sm mt-1">Ordenado por data de vencimento</p>
            </div>

            {/* Legenda */}
            <div className="px-8 py-4 border-b border-zinc-100 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
                Vence hoje / Vencido
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-700">
                <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block" />
                Faltando até 5 dias
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                <span className="w-4 h-4 rounded-full bg-blue-500 inline-block" />
                Boleto já solicitado
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <span className="w-4 h-4 rounded-full bg-emerald-500 inline-block" />
                Pago
              </div>
            </div>

            <div className="divide-y divide-zinc-100/80">
              {vencimentosSorted.map((conta, idx) => {
                const color = getVencimentoColor(conta)
                const days = getDaysRemaining(conta.vencimento)

                const rowBg: Record<string, string> = {
                  red: 'bg-red-100 hover:bg-red-200/70 border-l-4 border-l-red-500',
                  yellow: 'bg-yellow-100 hover:bg-yellow-200/70 border-l-4 border-l-yellow-400',
                  blue: 'bg-blue-100 hover:bg-blue-200/70 border-l-4 border-l-blue-500',
                  green: 'bg-emerald-50 hover:bg-emerald-100/70 border-l-4 border-l-emerald-400',
                  default: 'hover:bg-white/50 border-l-4 border-l-zinc-200',
                }

                const dotColor: Record<string, string> = {
                  red: 'bg-red-600',
                  yellow: 'bg-yellow-500',
                  blue: 'bg-blue-600',
                  green: 'bg-emerald-500',
                  default: 'bg-zinc-400',
                }

                const dateColor: Record<string, string> = {
                  red: 'text-red-800 font-bold',
                  yellow: 'text-yellow-800 font-bold',
                  blue: 'text-blue-800 font-semibold',
                  green: 'text-emerald-800 font-semibold',
                  default: 'text-zinc-700 font-semibold',
                }

                const statusLabel: Record<string, string> = {
                  red: days <= 0 ? 'VENCIDO' : 'VENCE HOJE',
                  yellow: `${days} dias`,
                  blue: 'Solicitado',
                  green: 'Pago',
                  default: `${days} dias`,
                }

                const badgeBg: Record<string, string> = {
                  red: 'bg-red-600 text-white border-red-700',
                  yellow: 'bg-yellow-500 text-white border-yellow-600',
                  blue: 'bg-blue-600 text-white border-blue-700',
                  green: 'bg-emerald-600 text-white border-emerald-700',
                  default: 'bg-zinc-200 text-zinc-700 border-zinc-300',
                }

                return (
                  <div
                    key={conta.id}
                    className={`px-6 py-4 flex items-center gap-4 transition-colors ${rowBg[color]}`}
                  >
                    {/* Número */}
                    <span className="text-zinc-400 text-sm font-mono w-6 text-right flex-shrink-0">
                      {idx + 1}
                    </span>

                    {/* Dot de cor */}
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${dotColor[color]}`} />

                    {/* Nome */}
                    <span className="flex-1 font-bold text-zinc-900 text-base truncate">
                      {conta.nome}
                    </span>

                    {/* Valor */}
                    <span className="text-zinc-700 font-semibold text-sm hidden sm:block flex-shrink-0">
                      {formatMoney(conta.valor)}
                    </span>

                    {/* Data */}
                    <span className={`text-sm flex-shrink-0 ${dateColor[color]}`}>
                      📅 {new Date(conta.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </span>

                    {/* Badge status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${badgeBg[color]}`}>
                      {statusLabel[color]}
                    </span>

                    {/* Mudar status */}
                    <select
                      value={conta.status}
                      onChange={e => handleStatusChange(conta, e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none border transition-colors cursor-pointer flex-shrink-0 ${
                        conta.status === 'Pago'
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : conta.status === 'Solicitado'
                          ? 'bg-blue-500 border-blue-600 text-white'
                          : 'bg-yellow-400 border-yellow-500 text-yellow-900'
                      }`}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago</option>
                      <option value="Solicitado">Solicitado</option>
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Histórico Modal */}
      {showHistorico && (
        <Modal onClose={() => setShowHistorico(null)}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{showHistorico}</h2>
              <p className="text-zinc-500 text-sm mt-1">Histórico completo de pagamentos</p>
            </div>
            <button
              onClick={() => setShowHistorico(null)}
              className="ml-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {(historicoPagamentos[showHistorico] || []).length === 0 ? (
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-10 text-center text-zinc-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="font-medium">Nenhum pagamento registrado ainda.</p>
              </div>
            ) : (
              [...(historicoPagamentos[showHistorico] || [])]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(registro => (
                  <div
                    key={registro.id}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-zinc-900">{showHistorico}</p>
                      <p className="text-zinc-500 text-sm mt-0.5">Pago em {registro.data} às {registro.hora}</p>
                    </div>
                    <p className="text-lg font-black text-emerald-600">{formatMoney(registro.valor)}</p>
                  </div>
                ))
            )}
          </div>
        </Modal>
      )}

      {/* Nova / Editar Conta Modal */}
      {showModal && (
        <Modal onClose={closeModal}>
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">
              {editingId !== null ? 'Editar Conta' : 'Nova Conta'}
            </h2>
            <button
              onClick={closeModal}
              className="ml-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nome da Conta *">
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Ex: CONTA DE LUZ"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400/50 text-zinc-900 text-sm transition-all"
              />
            </FormField>

            <FormField label="Valor (R$)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.valor}
                onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                placeholder="0,00"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400/50 text-zinc-900 text-sm transition-all"
              />
            </FormField>

            <FormField label="Tipo de Recorrência">
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400/50 text-zinc-900 text-sm transition-all cursor-pointer"
              >
                <option>Mensal</option>
                <option>Semanal</option>
                <option>Quinzenal</option>
                <option>Anual</option>
                <option>Única</option>
              </select>
            </FormField>

            <FormField label="Status">
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400/50 text-zinc-900 text-sm transition-all cursor-pointer"
              >
                <option>Pendente</option>
                <option>Pago</option>
                <option>Solicitado</option>
              </select>
            </FormField>

            <FormField label="Data de Criação">
              <input
                type="date"
                value={form.criada}
                onChange={e => setForm(f => ({ ...f, criada: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400/50 text-zinc-900 text-sm transition-all"
              />
            </FormField>

            <FormField label="Vencimento *">
              <input
                type="date"
                value={form.vencimento}
                onChange={e => setForm(f => ({ ...f, vencimento: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400/50 text-zinc-900 text-sm transition-all"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 mt-7">
            <button
              onClick={closeModal}
              className="px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.nome.trim() || !form.vencimento}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {editingId !== null ? 'Salvar Alterações' : 'Adicionar Conta'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/60 p-7 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

function SummaryCard({ emoji, label, value, accent }: { emoji: string; label: string; value: string; accent: string }) {
  const colors: Record<string, string> = {
    red: 'from-red-50 to-red-100/50 border-red-200/60',
    yellow: 'from-amber-50 to-amber-100/50 border-amber-200/60',
    green: 'from-emerald-50 to-emerald-100/50 border-emerald-200/60',
    blue: 'from-blue-50 to-blue-100/50 border-blue-200/60',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[accent] || colors.blue} backdrop-blur-xl border rounded-2xl p-5 shadow-md`}>
      <div className="text-2xl mb-3">{emoji}</div>
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-zinc-900 truncate">{value}</p>
    </div>
  )
}

function PriorityBadge({ label, color }: { label: string; color: string }) {
  const classes: Record<string, string> = {
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-amber-100 text-amber-700 border-amber-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${classes[color] || classes.green}`}>
      {label}
    </span>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
