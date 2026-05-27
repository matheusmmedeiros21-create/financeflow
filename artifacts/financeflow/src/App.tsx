import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Plus, Search, Trash2, Pencil, X, CalendarClock, List, PlusCircle } from 'lucide-react'

interface Conta {
  id: number
  nome: string
  valor: number
  tipo: string
  criada: string
  vencimento: string
  status: string
  solicitadoEm?: string
}

interface RegistroPagamento {
  id: number
  valor: number
  data: string
  hora: string
  timestamp: string
  manual?: boolean
  obs?: string
}

const APP_VERSION = '2.0'

const DEFAULT_CONTAS: Conta[] = [
  { id: 1,  nome: 'SISTEMA SIGE',                                   valor: 673.20,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-01', status: 'A Vencer' },
  { id: 2,  nome: 'OLIMPIO ERICK (mensal)',                          valor: 53.00,     tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-01', status: 'A Vencer' },
  { id: 3,  nome: 'ADVOGADA ROBERTA',                                valor: 1900.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-03', status: 'A Vencer' },
  { id: 4,  nome: 'SABESP AGUA DALMO',                               valor: 791.78,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-03', status: 'A Vencer' },
  { id: 5,  nome: 'PLANO DE SAUDE PORTO',                            valor: 10531.86,  tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-05', status: 'A Vencer' },
  { id: 6,  nome: 'METROMED ELEVADORES (vence 5)',                   valor: 1459.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-05', status: 'A Vencer' },
  { id: 7,  nome: 'DI LIFE SALA DE PROJETOS',                        valor: 114.99,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-05', status: 'A Vencer' },
  { id: 8,  nome: 'DI LIFE ELEVADORES',                              valor: 149.99,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-05', status: 'A Vencer' },
  { id: 9,  nome: 'ENERGIA BRÁS',                                    valor: 150.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-06', status: 'A Vencer' },
  { id: 10, nome: 'IPTU SP',                                         valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-09', status: 'A Vencer' },
  { id: 11, nome: 'ARIANE IPTU',                                     valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-09', status: 'A Vencer' },
  { id: 12, nome: 'ELEVADORES IPTU',                                 valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-09', status: 'A Vencer' },
  { id: 13, nome: 'PLANO DE SAUDE NOTRE DAME (1)',                   valor: 2888.86,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-10', status: 'A Vencer' },
  { id: 14, nome: 'PLANO DE SAUDE NOTRE DAME (2)',                   valor: 3141.09,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-10', status: 'A Vencer' },
  { id: 15, nome: 'ESCOLA CLARA',                                    valor: 810.20,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-10', status: 'A Vencer' },
  { id: 16, nome: 'ROTAEXATA',                                       valor: 806.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-10', status: 'A Vencer' },
  { id: 17, nome: 'CURSO S.K',                                       valor: 379.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-10', status: 'A Vencer' },
  { id: 18, nome: 'UNIVERSO ONLINE ATÉ JULHO',                       valor: 111.88,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-10', status: 'A Vencer' },
  { id: 19, nome: 'PSICOLOGA NANCY',                                 valor: 1500.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-12', status: 'A Vencer' },
  { id: 20, nome: 'JOSÉ PROCESSO',                                   valor: 3000.00,   tipo: 'Quinzenal', criada: '2026-05-01', vencimento: '2026-06-12', status: 'A Vencer' },
  { id: 21, nome: 'SABESP AGUA BRÁS',                                valor: 88.64,     tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-14', status: 'A Vencer' },
  { id: 22, nome: 'ASSINATURA INFOJOBS ATÉ 19/08',                   valor: 299.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-15', status: 'A Vencer' },
  { id: 23, nome: 'GOTO',                                            valor: 570.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-15', status: 'A Vencer' },
  { id: 24, nome: 'TELEFONE VIVO-SERRALHERIA FIBRA 300',             valor: 82.32,     tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-15', status: 'A Vencer' },
  { id: 25, nome: 'SABESP AGUA EDMUNDO',                             valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-16', status: 'A Vencer' },
  { id: 26, nome: 'CARTÃO CAIXA',                                    valor: 3000.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-16', status: 'A Vencer' },
  { id: 27, nome: 'TELEFONE VIVO-QUETER/FUZA-99937-0069',            valor: 180.76,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-17', status: 'A Vencer' },
  { id: 28, nome: 'TELEFONE VIVO-SERRALHERIA 4 CHIPS',               valor: 220.78,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-17', status: 'A Vencer' },
  { id: 29, nome: 'METROMED ELEVADORES (vence 19)',                  valor: 2466.20,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-19', status: 'A Vencer' },
  { id: 30, nome: 'CONSIGAS',                                        valor: 55.00,     tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-19', status: 'A Vencer' },
  { id: 31, nome: 'CONT ANDERSON ALEX ALENCAR HOLDING',              valor: 5000.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 32, nome: 'CONTABILIDADE ANDERSON ALEX ALENCAR ELEVADORES',  valor: 1800.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-20', status: 'Vencido' },
  { id: 33, nome: 'CONTABILIDADE ANDERSON ALEX ALENCAR MANUTENÇÃO',  valor: 1200.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-20', status: 'Vencido' },
  { id: 34, nome: 'CONTABILIDADE ANDERSON ALEX ALENCAR SERRALHERIA', valor: 554.75,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-20', status: 'Vencido' },
  { id: 35, nome: 'LOVELY ALUGUEL BRÁS',                             valor: 1500.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 36, nome: 'QUADRA DE FUTEBOL',                               valor: 350.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 37, nome: 'ENEL ENERGIA EDMUNDO',                            valor: 1800.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 38, nome: 'ELEKTRO NEOENERGIA',                              valor: 130.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 39, nome: 'FOMENT CONNECTION',                               valor: 3600.00,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 40, nome: 'IPTU BERTIOGA',                                   valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 41, nome: 'ARIANE DAS SIMPLES NACIONAL',                     valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 42, nome: 'ARIANE DARF UNIFICADA',                           valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 43, nome: 'ARIANE FGTS/RECISÓRIO',                           valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 44, nome: 'ELEVADORES DAS SIMPLES NACIONAL',                 valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 45, nome: 'ELEVADORES DARF UNIFICADA',                       valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 46, nome: 'ELEVADORES FGTS/RECISÓRIO',                       valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-20', status: 'A Vencer' },
  { id: 47, nome: 'TELEFONE VIVO-MANUTENÇÃO-FIBRA 300',              valor: 87.02,     tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-06-21', status: 'A Vencer' },
  { id: 48, nome: 'AUVO',                                            valor: 826.74,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-25', status: 'A Vencer' },
  { id: 49, nome: 'CONDOMINIO BURITI',                               valor: 1424.60,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-25', status: 'A Vencer' },
  { id: 50, nome: 'ALUGUEL IMPRESSORA MA MAX',                       valor: 830.35,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-25', status: 'A Vencer' },
  { id: 51, nome: 'REP RELOGIOS',                                    valor: 447.80,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-25', status: 'A Vencer' },
  { id: 52, nome: 'TELEFONE VIVO-ELEVADORES-31 CHIPS',               valor: 1331.72,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-25', status: 'A Vencer' },
  { id: 53, nome: 'OLIMPIO ERICK (semanal)',                         valor: 875.00,    tipo: 'Semanal',   criada: '2026-05-01', vencimento: '2026-05-29', status: 'A Vencer' },
  { id: 54, nome: 'CABELO ANDERSON DEOMIRO',                         valor: 750.00,    tipo: 'Semanal',   criada: '2026-05-01', vencimento: '2026-05-29', status: 'A Vencer' },
  { id: 55, nome: 'METROMED MANUTENÇÃO',                             valor: 1641.60,   tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 56, nome: 'ESCOLA DANIEL',                                   valor: 917.84,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 57, nome: 'ESCOLA SAMUEL',                                   valor: 874.79,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 58, nome: 'CAPRICE',                                         valor: 130.00,    tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 59, nome: 'ELEVADORES ICMS',                                 valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 60, nome: 'ELEVADORES ACORDO DARF PREV',                     valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 61, nome: 'ELEVADORES ACORDO PARCELADO',                     valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 62, nome: 'ELEVADORES ACORDO 2021',                          valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
  { id: 63, nome: 'ELEVADORES ACORDO PGFN',                          valor: 0,         tipo: 'Mensal',    criada: '2026-05-01', vencimento: '2026-05-30', status: 'A Vencer' },
]

const EMPTY_FORM = {
  nome: '',
  valor: '',
  tipo: 'Mensal',
  criada: '',
  vencimento: '',
  status: 'A Vencer',
}

type Tab = 'vencidos' | 'avencer' | 'solicitado' | 'vencimentos' | 'historico'

export default function FinanceFlow() {
  const [tab, setTab] = useState<Tab>('avencer')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [historicoPagamentos, setHistoricoPagamentos] = useState<Record<string, RegistroPagamento[]>>({})
  const [showHistorico, setShowHistorico] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [contas, setContas] = useState<Conta[]>(DEFAULT_CONTAS)
  const [deletedNomes, setDeletedNomes] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualForm, setManualForm] = useState({ valor: '', data: '', obs: '' })
  const [showAlerta, setShowAlerta] = useState(false)
  const [alertaContas, setAlertaContas] = useState<Conta[]>([])
  const [calendarDate, setCalendarDate] = useState(() => { const d = new Date(); return { month: d.getMonth(), year: d.getFullYear() } })
  const [calendarDiaSelecionado, setCalendarDiaSelecionado] = useState<number | null>(null)
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const alertadoRef = useRef(false)

  const playAlertSound = () => {
    try {
      const ctx = new AudioContext()
      const playBeep = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
        osc.start(ctx.currentTime + start)
        osc.stop(ctx.currentTime + start + duration)
      }
      playBeep(880, 0, 0.2)
      playBeep(660, 0.25, 0.2)
      playBeep(880, 0.5, 0.4)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    try {
      const savedDeleted: string[] = JSON.parse(localStorage.getItem('financeflow-deleted') || '[]')
      setDeletedNomes(savedDeleted)
      const saved = localStorage.getItem('financeflow-contas')
      const parsed: Conta[] = saved ? JSON.parse(saved) : []
      // Adiciona apenas contas novas que ainda não existem (por nome) e não foram deletadas
      const novas = DEFAULT_CONTAS.filter(
        d => !parsed.some(p => p.nome === d.nome) && !savedDeleted.includes(d.nome)
      )
      const merged = [...parsed, ...novas]
      setContas(merged.length > 0 ? merged : DEFAULT_CONTAS)
      localStorage.setItem('financeflow-version', APP_VERSION)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('financeflow-contas', JSON.stringify(contas)) } catch { /* ignore */ }
  }, [contas])

  useEffect(() => {
    try { localStorage.setItem('financeflow-deleted', JSON.stringify(deletedNomes)) } catch { /* ignore */ }
  }, [deletedNomes])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('financeflow-historico')
      if (saved) setHistoricoPagamentos(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('financeflow-historico', JSON.stringify(historicoPagamentos)) } catch { /* ignore */ }
  }, [historicoPagamentos])

  useEffect(() => () => { Object.values(timersRef.current).forEach(clearTimeout) }, [])

  useEffect(() => {
    if (alertadoRef.current) return
    const urgentes = contas.filter(c => {
      if (c.status === 'Vencido') return false
      const days = getDaysRemaining(c.vencimento)
      return days <= 0
    })
    const hoje = contas.filter(c => {
      if (c.status === 'Vencido') return false
      const days = getDaysRemaining(c.vencimento)
      return days === 0
    })
    const alerta = contas.filter(c => {
      if (c.status === 'Vencido') return false
      const days = getDaysRemaining(c.vencimento)
      return days <= 3
    })
    if (alerta.length > 0) {
      alertadoRef.current = true
      setAlertaContas(alerta.sort((a, b) =>
        new Date(a.vencimento + 'T12:00:00').getTime() - new Date(b.vencimento + 'T12:00:00').getTime()
      ))
      setTimeout(() => {
        setShowAlerta(true)
        if (urgentes.length > 0 || hoje.length > 0) playAlertSound()
      }, 800)
    }
  }, [contas])

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
    if (conta.status === 'Vencido') return 'green'
    if (conta.status === 'Solicitado') return 'blue'
    const days = getDaysRemaining(conta.vencimento)
    if (days <= 0) return 'red'
    if (days <= 5) return 'yellow'
    return 'default'
  }

  const getPriority = (conta: Conta) => {
    if (conta.status === 'Vencido') return { label: 'Vencido', color: 'green' }
    const days = getDaysRemaining(conta.vencimento)
    if (days <= 1) return { label: 'URGENTE', color: 'red' }
    if (days <= 5) return { label: 'PRÓXIMO', color: 'yellow' }
    return { label: 'OK', color: 'green' }
  }

  const proximoVencimento = (vencimento: string, tipo: string): string => {
    const d = new Date(vencimento + 'T12:00:00')
    switch (tipo) {
      case 'Semanal':   d.setDate(d.getDate() + 7); break
      case 'Quinzenal': d.setDate(d.getDate() + 15); break
      case 'Anual':     d.setFullYear(d.getFullYear() + 1); break
      case 'Única':     return vencimento
      default:          d.setMonth(d.getMonth() + 1); break
    }
    return d.toISOString().split('T')[0]
  }

  const filteredContas = useMemo(() => {
    const byTab = contas.filter(c => {
      if (c.status === 'Vencido') return false
      const days = getDaysRemaining(c.vencimento)
      if (tab === 'vencidos') return c.status === 'A Vencer' && days <= 0
      if (tab === 'avencer') return c.status === 'A Vencer' && days > 0
      if (tab === 'solicitado') return c.status === 'Solicitado'
      return false
    })
    const filtered = byTab.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()))
    return [...filtered].sort((a, b) => {
      const da = new Date(a.vencimento + 'T12:00:00').getTime()
      const db = new Date(b.vencimento + 'T12:00:00').getTime()
      return sortOrder === 'asc' ? da - db : db - da
    })
  }, [search, contas, sortOrder, tab])

  const vencimentosSorted = useMemo(
    () => [...contas].sort((a, b) =>
      new Date(a.vencimento + 'T12:00:00').getTime() - new Date(b.vencimento + 'T12:00:00').getTime()
    ),
    [contas]
  )

  const urgentAccounts = contas.filter(c => getPriority(c).label === 'URGENTE')
  const nextAccounts = contas.filter(c => getPriority(c).label === 'PRÓXIMO')
  const paidAccounts = contas.filter(c => c.status === 'Vencido')
  const totalMonth = contas.reduce((acc, c) => acc + (c.valor || 0), 0)

  const handleSubmit = () => {
    if (!form.nome.trim() || !form.vencimento) return
    if (editingId !== null) {
      setContas(prev => prev.map(c => c.id === editingId ? { ...c, ...form, valor: Number(form.valor) || 0 } : c))
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
      const conta = contas.find(c => c.id === id)
      if (conta) {
        setDeletedNomes(prev => prev.includes(conta.nome) ? prev : [...prev, conta.nome])
      }
      setContas(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleStatusChange = (conta: Conta, newStatus: string) => {
    if (newStatus === 'Vencido' && conta.status !== 'Vencido') {
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
    }
    const solicitadoEm = newStatus === 'Solicitado' && conta.status !== 'Solicitado'
      ? new Date().toISOString()
      : conta.solicitadoEm
    setContas(prev => prev.map(c => c.id === conta.id ? { ...c, status: newStatus, solicitadoEm } : c))
  }

  const deleteHistoricoEntry = (nomeConta: string, registroId: number) => {
    setHistoricoPagamentos(prev => ({
      ...prev,
      [nomeConta]: (prev[nomeConta] || []).filter(r => r.id !== registroId),
    }))
  }

  const handleManualEntry = () => {
    if (!showHistorico || !manualForm.data) return
    const [dia, mes, ano] = manualForm.data.includes('/')
      ? manualForm.data.split('/')
      : new Date(manualForm.data + 'T12:00:00').toLocaleDateString('pt-BR').split('/')
    const registro: RegistroPagamento = {
      id: Date.now(),
      valor: Number(manualForm.valor) || 0,
      data: manualForm.data.includes('/') ? manualForm.data : `${dia}/${mes}/${ano}`,
      hora: '00:00:00',
      timestamp: manualForm.data.includes('/') ? new Date().toISOString() : new Date(manualForm.data + 'T12:00:00').toISOString(),
      manual: true,
      obs: manualForm.obs,
    }
    setHistoricoPagamentos(prev => ({
      ...prev,
      [showHistorico]: [...(prev[showHistorico] || []), registro],
    }))
    setManualForm({ valor: '', data: '', obs: '' })
    setShowManualEntry(false)
  }

  const statusSelectClass = (status: string, size: 'normal' | 'small' = 'normal') => {
    const base = size === 'normal'
      ? 'rounded-xl text-sm font-semibold outline-none border transition-colors cursor-pointer px-4 py-2.5'
      : 'rounded-xl text-xs font-semibold outline-none border transition-colors cursor-pointer px-3 py-2'
    const color = status === 'Vencido'
      ? 'bg-emerald-500 border-emerald-600 text-white'
      : status === 'Solicitado'
      ? 'bg-blue-500 border-blue-600 text-white'
      : 'bg-yellow-400 border-yellow-500 text-yellow-900'
    return `${base} ${color}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-100 relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl" />
      </div>

      {/* Alerta de Vencimentos */}
      {showAlerta && alertaContas.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-once">
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-white animate-pulse" size={24} />
                <div>
                  <h2 className="text-white font-black text-xl">⚠️ Alerta de Vencimentos</h2>
                  <p className="text-red-100 text-sm">{alertaContas.length} conta{alertaContas.length > 1 ? 's' : ''} vencendo em breve</p>
                </div>
              </div>
              <button onClick={() => setShowAlerta(false)} className="text-white hover:text-red-200 transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100">
              {alertaContas.map(conta => {
                const days = getDaysRemaining(conta.vencimento)
                const isVencido = days < 0
                const isHoje = days === 0
                return (
                  <div key={conta.id} className={`px-6 py-4 flex items-center justify-between gap-3 ${isVencido ? 'bg-red-50' : isHoje ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-900 truncate">{conta.nome}</p>
                      <p className="text-sm text-zinc-500">{formatMoney(conta.valor)}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black border flex-shrink-0 ${
                      isVencido ? 'bg-red-600 text-white border-red-700' :
                      isHoje ? 'bg-orange-500 text-white border-orange-600' :
                      'bg-yellow-500 text-white border-yellow-600'
                    }`}>
                      {isVencido ? `${Math.abs(days)}d atraso` : isHoje ? 'HOJE!' : `${days} dias`}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="px-6 py-4 bg-zinc-50 flex gap-3">
              <button
                onClick={() => { setShowAlerta(false); setTab('avencer') }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl text-sm transition-colors"
              >
                Ver A Vencer
              </button>
              <button
                onClick={() => setShowAlerta(false)}
                className="px-5 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-semibold rounded-2xl text-sm transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-zinc-500 text-base mt-1.5 font-medium">Gestão financeira inteligente</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {(tab === 'vencidos' || tab === 'avencer' || tab === 'solicitado') && (
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
          <SummaryCard emoji="✅" label="Vencidos" value={String(paidAccounts.length)} accent="green" />
          <SummaryCard emoji="💰" label="Total do Mês" value={formatMoney(totalMonth)} accent="blue" />
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setTab('vencidos')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'vencidos' ? 'bg-red-600 text-white shadow-lg' : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <Bell size={16} />
            Vencidos ({contas.filter(c => c.status === 'A Vencer' && getDaysRemaining(c.vencimento) <= 0).length})
          </button>
          <button
            onClick={() => setTab('avencer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'avencer' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <List size={16} />
            A Vencer ({contas.filter(c => c.status === 'A Vencer' && getDaysRemaining(c.vencimento) > 0).length})
          </button>
          <button
            onClick={() => setTab('solicitado')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'solicitado' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <List size={16} />
            Solicitado ({contas.filter(c => c.status === 'Solicitado').length})
          </button>
          <button
            onClick={() => setTab('vencimentos')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'vencimentos' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <CalendarClock size={16} />
            Vencimentos
          </button>
          <button
            onClick={() => setTab('historico')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              tab === 'historico' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/60 text-zinc-600 hover:bg-white/80 border border-white/50'
            }`}
          >
            <CalendarClock size={16} />
            Histórico
          </button>
        </div>

        {/* Tab: Vencidos / A Vencer / Solicitado */}
        {(tab === 'vencidos' || tab === 'avencer' || tab === 'solicitado') && (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {tab === 'vencidos' && <h2 className="text-2xl font-bold text-red-700">🔴 Contas Vencidas</h2>}
                {tab === 'avencer' && <h2 className="text-2xl font-bold text-zinc-900">📅 A Vencer</h2>}
                {tab === 'solicitado' && <h2 className="text-2xl font-bold text-blue-700">🔵 Boleto Solicitado</h2>}
                <p className="text-zinc-500 text-sm mt-1">
                  {tab === 'vencidos' ? 'Prazo ultrapassado — pagar com urgência' : tab === 'avencer' ? 'Próximas a vencer' : 'Aguardando confirmação de pagamento'}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  📅 Vencimento {sortOrder === 'asc' ? '↑ Menor primeiro' : '↓ Maior primeiro'}
                </button>
                {urgentAccounts.length > 0 && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-2xl font-semibold text-sm">
                    <Bell size={16} />
                    {urgentAccounts.length} {urgentAccounts.length === 1 ? 'conta urgente' : 'contas urgentes'}
                  </div>
                )}
              </div>
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
                const isPagoRecente = false
                return (
                  <div
                    key={conta.id}
                    className={`px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all ${
                      isPagoRecente ? 'bg-emerald-50 opacity-60' : 'hover:bg-white/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className={`text-lg font-bold text-zinc-900 truncate ${isPagoRecente ? 'line-through text-zinc-400' : ''}`}>
                          {conta.nome}
                        </h3>
                        {isPagoRecente && (
                          <span className="text-emerald-600 text-sm font-semibold animate-pulse">✓ Pago! Renovando...</span>
                        )}
                        {!isPagoRecente && (
                          <>
                            <span className="bg-zinc-100 text-zinc-600 px-3 py-0.5 rounded-full text-xs font-medium border border-zinc-200">
                              {conta.tipo}
                            </span>
                            <PriorityBadge label={priority.label} color={priority.color} />
                          </>
                        )}
                      </div>
                      {!isPagoRecente && (
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                          <span>💰 <span className="font-semibold text-zinc-800">{formatMoney(conta.valor)}</span></span>
                          <span>📅 <span className="font-semibold text-zinc-800">Dia {String(new Date(conta.vencimento + 'T12:00:00').getDate()).padStart(2, '0')}</span></span>
                          <span className={days <= 1 && conta.status !== 'Vencido' ? 'text-red-600 font-semibold' : ''}>
                            ⏰ {conta.status === 'Vencido' ? 'Vencido' : days <= 0 ? 'Vence hoje!' : `${days} dias restantes`}
                          </span>
                        </div>
                      )}
                    </div>

                    {!isPagoRecente && (
                      <div className="flex items-center flex-wrap gap-2 xl:flex-nowrap xl:gap-2">
                        <select
                          value={conta.status}
                          onChange={e => handleStatusChange(conta, e.target.value)}
                          className={statusSelectClass(conta.status)}
                        >
                          <option value="A Vencer">A Vencer</option>
                          <option value="Vencido">Vencido</option>
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
                    )}
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

            <div className="px-8 py-4 border-b border-zinc-100 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                <span className="w-4 h-4 rounded-full bg-red-600 inline-block" />Vence hoje / Vencido
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-700">
                <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block" />Faltando até 5 dias
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                <span className="w-4 h-4 rounded-full bg-blue-600 inline-block" />Boleto já solicitado
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <span className="w-4 h-4 rounded-full bg-emerald-500 inline-block" />Pago
              </div>
            </div>

            <div className="divide-y divide-zinc-100/80">
              {vencimentosSorted.map((conta, idx) => {
                const color = getVencimentoColor(conta)
                const days = getDaysRemaining(conta.vencimento)
                const isPagoRecente = false

                const rowBg: Record<string, string> = {
                  red: 'bg-red-100 hover:bg-red-200/70 border-l-4 border-l-red-500',
                  yellow: 'bg-yellow-100 hover:bg-yellow-200/70 border-l-4 border-l-yellow-400',
                  blue: 'bg-blue-100 hover:bg-blue-200/70 border-l-4 border-l-blue-500',
                  green: 'bg-emerald-50 hover:bg-emerald-100/70 border-l-4 border-l-emerald-400',
                  default: 'hover:bg-white/50 border-l-4 border-l-zinc-200',
                }
                const dotColor: Record<string, string> = {
                  red: 'bg-red-600', yellow: 'bg-yellow-500', blue: 'bg-blue-600', green: 'bg-emerald-500', default: 'bg-zinc-400',
                }
                const dateColor: Record<string, string> = {
                  red: 'text-red-800 font-bold', yellow: 'text-yellow-800 font-bold', blue: 'text-blue-800 font-semibold', green: 'text-emerald-800 font-semibold', default: 'text-zinc-700 font-semibold',
                }
                const statusLabel: Record<string, string> = {
                  red: days <= 0 ? 'VENCIDO' : 'VENCE HOJE', yellow: `${days} dias`, blue: 'Solicitado', green: 'Vencido', default: `${days} dias`,
                }
                const badgeBg: Record<string, string> = {
                  red: 'bg-red-600 text-white border-red-700', yellow: 'bg-yellow-500 text-white border-yellow-600', blue: 'bg-blue-600 text-white border-blue-700', green: 'bg-emerald-600 text-white border-emerald-700', default: 'bg-zinc-200 text-zinc-700 border-zinc-300',
                }

                return (
                  <div
                    key={conta.id}
                    className={`px-6 py-4 flex items-center gap-4 transition-all ${
                      isPagoRecente ? 'bg-emerald-50 opacity-60' : rowBg[color]
                    }`}
                  >
                    <span className="text-zinc-400 text-sm font-mono w-6 text-right flex-shrink-0">{idx + 1}</span>
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${isPagoRecente ? 'bg-emerald-500' : dotColor[color]}`} />
                    <span className={`flex-1 font-bold text-zinc-900 text-base truncate ${isPagoRecente ? 'line-through text-zinc-400' : ''}`}>
                      {conta.nome}
                    </span>
                    {isPagoRecente
                      ? <span className="text-emerald-600 text-sm font-semibold animate-pulse flex-shrink-0">✓ Renovando...</span>
                      : <>
                          <span className="text-zinc-700 font-semibold text-sm hidden sm:block flex-shrink-0">{formatMoney(conta.valor)}</span>
                          <span className={`text-sm flex-shrink-0 ${dateColor[color]}`}>📅 Dia {String(new Date(conta.vencimento + 'T12:00:00').getDate()).padStart(2, '0')}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${badgeBg[color]}`}>{statusLabel[color]}</span>
                          <select
                            value={conta.status}
                            onChange={e => handleStatusChange(conta, e.target.value)}
                            className={`flex-shrink-0 ${statusSelectClass(conta.status, 'small')}`}
                          >
                            <option value="A Vencer">A Vencer</option>
                            <option value="Vencido">Vencido</option>
                            <option value="Solicitado">Solicitado</option>
                          </select>
                        </>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab: Histórico */}
        {tab === 'historico' && (() => {
          const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
          const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
          const { month, year } = calendarDate
          const primeiroDia = new Date(year, month, 1).getDay()
          const totalDias = new Date(year, month + 1, 0).getDate()
          const hoje = new Date()

          const contasDoDia = (dia: number) =>
            contas.filter(c => {
              const d = new Date(c.vencimento + 'T12:00:00')
              return d.getFullYear() === year && d.getMonth() === month && d.getDate() === dia
            })

          const solicitados = contas
            .filter(c => c.status === 'Solicitado')
            .sort((a, b) => (b.solicitadoEm || '').localeCompare(a.solicitadoEm || ''))

          const aVencer = contas
            .filter(c => c.status === 'A Vencer')
            .sort((a, b) => new Date(a.vencimento + 'T12:00:00').getTime() - new Date(b.vencimento + 'T12:00:00').getTime())

          const diasSelecionadosContas = calendarDiaSelecionado !== null ? contasDoDia(calendarDiaSelecionado) : []

          return (
            <div className="space-y-6">
              {/* Calendário */}
              <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200/60 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">📅 Calendário</h2>
                    <p className="text-zinc-500 text-sm mt-0.5">Veja as contas por dia do mês</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setCalendarDiaSelecionado(null)
                        setCalendarDate(p => {
                          const m = p.month === 0 ? 11 : p.month - 1
                          const y = p.month === 0 ? p.year - 1 : p.year
                          return { month: m, year: y }
                        })
                      }}
                      className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold transition-colors"
                    >‹</button>
                    <span className="font-bold text-zinc-800 min-w-[140px] text-center">{meses[month]} {year}</span>
                    <button
                      onClick={() => {
                        setCalendarDiaSelecionado(null)
                        setCalendarDate(p => {
                          const m = p.month === 11 ? 0 : p.month + 1
                          const y = p.month === 11 ? p.year + 1 : p.year
                          return { month: m, year: y }
                        })
                      }}
                      className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold transition-colors"
                    >›</button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Dias da semana */}
                  <div className="grid grid-cols-7 mb-2">
                    {diasSemana.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-zinc-400 py-1">{d}</div>
                    ))}
                  </div>
                  {/* Células do calendário */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: primeiroDia }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: totalDias }).map((_, i) => {
                      const dia = i + 1
                      const contasDia = contasDoDia(dia)
                      const isHoje = hoje.getDate() === dia && hoje.getMonth() === month && hoje.getFullYear() === year
                      const isSelecionado = calendarDiaSelecionado === dia
                      const temSolicitado = contasDia.some(c => c.status === 'Solicitado')
                      const temVencido = contasDia.some(c => c.status === 'A Vencer' && getDaysRemaining(c.vencimento) <= 0)
                      const temAvencer = contasDia.some(c => c.status === 'A Vencer' && getDaysRemaining(c.vencimento) > 0)
                      return (
                        <button
                          key={dia}
                          onClick={() => setCalendarDiaSelecionado(isSelecionado ? null : dia)}
                          className={`relative flex flex-col items-center justify-start py-1.5 rounded-xl min-h-[52px] transition-all text-sm font-semibold
                            ${isSelecionado ? 'bg-purple-600 text-white shadow-lg' : isHoje ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-400' : contasDia.length > 0 ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800' : 'text-zinc-400 hover:bg-zinc-50'}
                          `}
                        >
                          <span>{dia}</span>
                          {contasDia.length > 0 && (
                            <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                              {temVencido && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                              {temSolicitado && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                              {temAvencer && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                            </div>
                          )}
                          {contasDia.length > 0 && (
                            <span className={`text-[10px] font-bold mt-0.5 ${isSelecionado ? 'text-white/80' : 'text-zinc-500'}`}>{contasDia.length}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Legenda */}
                  <div className="flex gap-4 mt-4 px-1 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Vencido</div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Solicitado</div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />A Vencer</div>
                  </div>
                </div>

                {/* Contas do dia selecionado */}
                {calendarDiaSelecionado !== null && (
                  <div className="border-t border-zinc-200/60 px-6 py-4">
                    <h3 className="font-bold text-zinc-800 mb-3">
                      Dia {String(calendarDiaSelecionado).padStart(2, '0')} de {meses[month]}
                      <span className="ml-2 text-zinc-500 font-normal text-sm">
                        {diasSelecionadosContas.length === 0 ? '— nenhuma conta' : `— ${diasSelecionadosContas.length} conta(s)`}
                      </span>
                    </h3>
                    {diasSelecionadosContas.length === 0
                      ? <p className="text-zinc-400 text-sm">Nenhuma conta vence neste dia.</p>
                      : (
                        <div className="space-y-2">
                          {diasSelecionadosContas.map(c => {
                            const statusColor = c.status === 'Solicitado' ? 'bg-blue-100 text-blue-700 border-blue-200' : c.status === 'A Vencer' && getDaysRemaining(c.vencimento) <= 0 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            return (
                              <div key={c.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-zinc-100 shadow-sm gap-3">
                                <span className="font-semibold text-zinc-800 text-sm truncate flex-1">{c.nome}</span>
                                <span className="text-zinc-600 text-sm font-medium flex-shrink-0">{formatMoney(c.valor)}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex-shrink-0 ${statusColor}`}>{c.status}</span>
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
                  </div>
                )}
              </div>

              {/* Solicitados */}
              <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200/60">
                  <h2 className="text-xl font-bold text-blue-700">🔵 Solicitados</h2>
                  <p className="text-zinc-500 text-sm mt-0.5">Boletos já enviados aguardando pagamento</p>
                </div>
                <div className="divide-y divide-zinc-100">
                  {solicitados.length === 0
                    ? <p className="px-6 py-6 text-zinc-400 text-sm">Nenhum boleto solicitado ainda.</p>
                    : solicitados.map(c => (
                      <div key={c.id} className="flex items-center gap-3 px-6 py-4 hover:bg-blue-50/40 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-zinc-800 truncate">{c.nome}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {c.solicitadoEm
                              ? `Solicitado em ${new Date(c.solicitadoEm).toLocaleDateString('pt-BR')} às ${new Date(c.solicitadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                              : 'Data não registrada'}
                            {' · '}Vence Dia {String(new Date(c.vencimento + 'T12:00:00').getDate()).padStart(2, '0')}
                          </p>
                        </div>
                        <span className="text-zinc-700 font-bold text-sm flex-shrink-0">{formatMoney(c.valor)}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* A Vencer completo */}
              <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200/60">
                  <h2 className="text-xl font-bold text-zinc-800">📋 Todas as contas a vencer</h2>
                  <p className="text-zinc-500 text-sm mt-0.5">Lista completa — {aVencer.length} contas</p>
                </div>
                <div className="divide-y divide-zinc-100">
                  {aVencer.length === 0
                    ? <p className="px-6 py-6 text-zinc-400 text-sm">Nenhuma conta a vencer.</p>
                    : aVencer.map(c => {
                      const days = getDaysRemaining(c.vencimento)
                      const urgente = days <= 0
                      return (
                        <div key={c.id} className={`flex items-center gap-3 px-6 py-4 transition-colors ${urgente ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-zinc-50/60'}`}>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${urgente ? 'bg-red-500' : days <= 5 ? 'bg-yellow-500' : 'bg-zinc-300'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-800 truncate">{c.nome}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">Vence Dia {String(new Date(c.vencimento + 'T12:00:00').getDate()).padStart(2, '0')}</p>
                          </div>
                          <span className="text-zinc-700 font-bold text-sm flex-shrink-0">{formatMoney(c.valor)}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex-shrink-0 ${urgente ? 'bg-red-100 text-red-700 border-red-200' : days <= 5 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                            {urgente ? 'Vencido' : `${days} dias`}
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Histórico Modal */}
      {showHistorico && (
        <Modal onClose={() => { setShowHistorico(null); setShowManualEntry(false); setManualForm({ valor: '', data: '', obs: '' }) }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{showHistorico}</h2>
              <p className="text-zinc-500 text-sm mt-1">Histórico completo de pagamentos</p>
            </div>
            <button
              onClick={() => { setShowHistorico(null); setShowManualEntry(false) }}
              className="ml-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Adicionar manualmente */}
          <div className="mb-5">
            {!showManualEntry ? (
              <button
                onClick={() => setShowManualEntry(true)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <PlusCircle size={16} />
                Adicionar pagamento manualmente
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-bold text-blue-800">Registrar pagamento manual</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1 block">Valor (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={manualForm.valor}
                      onChange={e => setManualForm(f => ({ ...f, valor: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1 block">Data *</label>
                    <input
                      type="date"
                      value={manualForm.data}
                      onChange={e => setManualForm(f => ({ ...f, data: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1 block">Observação (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Pago via boleto..."
                    value={manualForm.obs}
                    onChange={e => setManualForm(f => ({ ...f, obs: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleManualEntry}
                    disabled={!manualForm.data}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => { setShowManualEntry(false); setManualForm({ valor: '', data: '', obs: '' }) }}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
            {(historicoPagamentos[showHistorico] || []).length === 0 ? (
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-10 text-center text-zinc-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="font-medium">Nenhum pagamento registrado ainda.</p>
              </div>
            ) : (
              [...(historicoPagamentos[showHistorico] || [])]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(registro => (
                  <div key={registro.id} className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-sm gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-900">{showHistorico}</p>
                        {registro.manual && (
                          <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">Manual</span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm mt-0.5">
                        {registro.manual
                          ? `Registrado em ${registro.data}${registro.obs ? ` — ${registro.obs}` : ''}`
                          : `Pago em ${registro.data} às ${registro.hora}`}
                      </p>
                    </div>
                    <p className="text-lg font-black text-emerald-600 flex-shrink-0">{formatMoney(registro.valor)}</p>
                    <button
                      onClick={() => {
                        if (confirm('Excluir este registro do histórico?')) {
                          deleteHistoricoEntry(showHistorico!, registro.id)
                        }
                      }}
                      className="flex-shrink-0 p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 transition-colors"
                      title="Excluir registro"
                    >
                      <Trash2 size={15} />
                    </button>
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
            <button onClick={closeModal} className="ml-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors">
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
                <option value="Vencido">Vencido</option>
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
            <button onClick={closeModal} className="px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-sm transition-colors">
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
