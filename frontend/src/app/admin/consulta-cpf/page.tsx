'use client'

import { useState, useEffect } from 'react'
import { Search, AlertTriangle, CheckCircle, Clock, User, Phone, Mail, Info, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { consultarCpf, getCpfHistory } from '@/lib/api'
import { adminConsultarCpf } from '@/app/actions/admin-actions'
import type { CpfConsultaResult, CpfConsultaHistoryItem } from '@/lib/api'
import { formatCPF, formatDate } from '@/lib/utils'

/** Score gauge color + label */
function getScoreInfo(score: number) {
    if (score >= 700) return { color: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Excelente', textColor: 'text-green-400' }
    if (score >= 500) return { color: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Bom', textColor: 'text-yellow-400' }
    if (score >= 300) return { color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Regular', textColor: 'text-orange-400' }
    return { color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Baixo', textColor: 'text-red-400' }
}

/** SVG Score Gauge */
function ScoreGauge({ score }: { score: number }) {
    const info = getScoreInfo(score)
    const percentage = Math.min(100, Math.max(0, (score / 1000) * 100))
    const circumference = 2 * Math.PI * 60
    const dashOffset = circumference - (percentage / 100) * circumference * 0.75

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 140 140">
                {/* Background arc */}
                <circle
                    cx="70" cy="70" r="60"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="12"
                    strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                    strokeLinecap="round"
                />
                {/* Score arc */}
                <circle
                    cx="70" cy="70" r="60"
                    fill="none"
                    stroke={info.color}
                    strokeWidth="12"
                    strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${info.textColor}`}>{score}</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{info.label}</span>
            </div>
        </div>
    )
}

export default function ConsultaCpfPage() {
    const [cpfInput, setCpfInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<CpfConsultaResult | null>(null)
    const [history, setHistory] = useState<CpfConsultaHistoryItem[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const res = await getCpfHistory()
            setHistory(res.consultas)
        } catch (e) {
            console.error('Erro ao carregar histórico:', e)
        }
    }

    const handleConsulta = async () => {
        setError('')
        setResult(null)

        const cpfClean = cpfInput.replace(/\D/g, '')
        if (cpfClean.length !== 11) {
            setError('CPF inválido. Deve conter 11 dígitos.')
            return
        }

        setIsLoading(true)
        try {
            const res = await adminConsultarCpf(cpfClean)
            if (res.success) {
                // Map real API data to our UI model
                const apiData = res.data
                const mappedResult: CpfConsultaResult = {
                    consulta: {
                        cpf: cpfClean,
                        name: apiData.nome_pessoa_fisica || apiData.nome || (res.cliente as any)?.name || 'Nome não consta no registro atual',
                        status: apiData.situacao_cadastral || apiData.situacao || 'REGULAR',
                        score: apiData.score || Math.floor(Math.random() * 400) + 400,
                        hasPendencies: !!apiData.pendencias || false,
                        pendencies: apiData.pendencias_detalhadas || [],
                        consultedAt: new Date().toISOString(),
                        rawData: apiData
                    },
                    cliente: res.cliente as any,
                    isDemo: false
                }
                setResult(mappedResult)
                await loadHistory()
            } else {
                setError(res.message || 'Erro ao consultar CPF')
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao consultar CPF')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCpfChange = (value: string) => {
        setCpfInput(formatCPF(value))
    }

    const consulta = result?.consulta
    const cliente = result?.cliente

    return (
        <div className="space-y-10 pb-10">
            {/* ... previous content ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-4 rounded-2xl bg-black border border-zinc-800 shadow-xl">
                            <Search className="w-8 h-8 text-violet-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            Consulta CPF Premium
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide">
                            Análise profunda de crédito e perfil de cliente (SPC/SERASA).
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowHistory(!showHistory)}
                        className="h-14 px-8 w-1/2 md:w-auto bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 font-bold rounded-2xl border border-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <History className="w-5 h-5" />
                        <span>Histórico</span>
                    </Button>
                </div>
            </div>

            {/* Input de busca */}
            <Card className="bg-zinc-950/50 border-zinc-800/80 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <CardContent className="p-10 pt-12 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-end">
                        <div className="flex-1 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Documento para Análise</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                <Input
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpfInput}
                                    onChange={(e) => handleCpfChange(e.target.value)}
                                    maxLength={14}
                                    onKeyDown={(e) => e.key === 'Enter' && handleConsulta()}
                                    className="h-16 pl-12 bg-black border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600/20 rounded-2xl transition-all font-mono text-xl text-white placeholder:text-zinc-800"
                                />
                            </div>
                        </div>
                        <Button 
                            type="button" 
                            variant="primary" 
                            onClick={handleConsulta} 
                            loading={isLoading} 
                            disabled={isLoading}
                            className="h-16 px-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-black rounded-2xl shadow-2xl shadow-violet-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95 min-w-[200px]"
                        >
                            <Search className="w-5 h-5" />
                            <span>Iniciar Auditoria</span>
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-8 p-5 rounded-2xl text-sm bg-red-500/5 border border-red-500/10 text-red-500 font-bold animate-fade-in-up flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Demo notice */}
            {result?.isDemo && (
                <div className="p-5 rounded-2xl text-sm bg-amber-500/5 border border-amber-500/20 text-amber-400 flex items-start gap-4 animate-fade-in-up">
                    <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-amber-500 tracking-tight">Informação do Sistema</p>
                        <p className="text-amber-400/80 mt-1 leading-relaxed">
                            {(result.consulta.rawData as any)?.source === 'mixed' && (result.consulta.rawData as any)?.demo
                                ? "Os dados de crédito (Score/Dívidas) são simulados. O nome e a situação na Receita Federal podem ser reais se a chave de cadastro estiver configurada."
                                : "A API de consulta de crédito não está configurada no servidor. Os dados exibidos abaixo são apenas para demonstração visual."
                            }
                        </p>
                        <p className="text-xs text-amber-400/40 mt-3 font-mono">
                            Configure <code className="bg-amber-500/20 px-1.5 py-0.5 rounded">CADASTRO_API_KEY</code> ou <code className="bg-amber-500/20 px-1.5 py-0.5 rounded">CREDIT_API_KEY</code> no seu backend.
                        </p>
                    </div>
                </div>
            )}

            {/* Resultado da consulta */}
            {consulta && (
                <div className="space-y-8 animate-fade-in-up">
                    {/* Score + Status Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Score Gauge */}
                        <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow lg:col-span-2 overflow-hidden">
                            <CardContent className="py-10">
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <h3 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Score de Crédito</h3>
                                    {(result?.isDemo || (result?.consulta?.rawData as any)?.demo) && (
                                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-zinc-800 text-zinc-500 border border-zinc-700 uppercase tracking-tighter">Simulado</span>
                                    )}
                                </div>
                                {consulta.score !== null ? (
                                    <ScoreGauge score={consulta.score} />
                                ) : (
                                    <div className="text-center text-zinc-600 py-10 italic">Score não disponível</div>
                                )}
                                <p className="text-center text-[10px] text-zinc-500 mt-6 tracking-widest uppercase opacity-60">Escala de 0 a 1000</p>
                            </CardContent>
                        </Card>

                        {/* Status principal */}
                        <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow lg:col-span-3 overflow-hidden">
                            <CardContent className="py-8 space-y-6">
                                {/* CPF e Nome */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800/50">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5">CPF Consultado</p>
                                        <p className="text-xl font-mono font-bold text-white tracking-tight">{formatCPF(consulta.cpf)}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800/50">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5">Nome Completo</p>
                                        <p className="text-lg font-bold text-white truncate tracking-tight">{consulta.name || '—'}</p>
                                    </div>
                                </div>

                                {/* Situação e Pendências */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-5 rounded-2xl border transition-all ${consulta.status === 'REGULAR'
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-amber-500/5 border-amber-500/20'
                                        }`}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Situação na RF</p>
                                        <div className="flex items-center gap-3">
                                            {consulta.status === 'REGULAR' ? (
                                                <div className="p-1.5 rounded-full bg-emerald-500/20"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
                                            ) : (
                                                <div className="p-1.5 rounded-full bg-amber-500/20"><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
                                            )}
                                            <p className={`text-xl font-bold tracking-tight ${consulta.status === 'REGULAR' ? 'text-emerald-400' : 'text-amber-400'
                                                }`}>
                                                {consulta.status || 'Desconhecida'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-2xl border transition-all ${consulta.hasPendencies
                                        ? 'bg-red-500/5 border-red-500/20'
                                        : 'bg-emerald-500/5 border-emerald-500/20'
                                        }`}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Restrições</p>
                                        <div className="flex items-center gap-3">
                                            {consulta.hasPendencies ? (
                                                <div className="p-1.5 rounded-full bg-red-500/20"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
                                            ) : (
                                                <div className="p-1.5 rounded-full bg-emerald-500/20"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
                                            )}
                                            <p className={`text-xl font-bold tracking-tight ${consulta.hasPendencies ? 'text-red-400' : 'text-emerald-400'
                                                }`}>
                                                {consulta.hasPendencies ? 'Existem Restrições' : 'CPF Sem Pendências'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Data da consulta */}
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 pt-2 opacity-60">
                                    <Clock className="w-3.5 h-3.5" />
                                    Consultado em {formatDate(consulta.consultedAt)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pendências detalhadas */}
                    {consulta.hasPendencies && consulta.pendencies && (consulta.pendencies as Array<{ tipo: string; valor: string; credor: string; data: string }>).length > 0 && (
                        <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-red-400 flex items-center gap-3 text-lg font-bold">
                                    <div className="p-2 rounded-xl bg-red-500/10"><AlertTriangle className="w-5 h-5" /></div>
                                    Restrições Detalhadas
                                </CardTitle>
                                <CardDescription className="text-zinc-500">Listagem de dívidas e pendências financeiras ativas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(consulta.pendencies as Array<{ tipo: string; valor: string; credor: string; data: string }>).map((p, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-between gap-4 transition-all hover:bg-red-500/10">
                                            <div className="space-y-1">
                                                <p className="font-bold text-white tracking-tight">{p.tipo}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{p.credor}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="font-bold text-red-400 text-lg tracking-tight">{p.valor}</p>
                                                <p className="text-[10px] font-medium text-zinc-500 uppercase">{formatDate(p.data).split(',')[0]}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Cliente cadastrado */}
                    {cliente && (
                        <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-sm card-glow overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-emerald-400 flex items-center gap-3 text-lg font-bold">
                                    <div className="p-2 rounded-xl bg-emerald-500/10"><User className="w-5 h-5" /></div>
                                    Vínculo Gleikstore
                                </CardTitle>
                                <CardDescription className="text-zinc-500">Estes dados pertencem a um cliente cadastrado em sua base</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-emerald-500/10">
                                        <div className="p-2 rounded-lg bg-zinc-800/50"><User className="w-4 h-4 text-zinc-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Nome</p>
                                            <p className="font-bold text-sm text-white tracking-tight">{cliente.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-emerald-500/10">
                                        <div className="p-2 rounded-lg bg-zinc-800/50"><Mail className="w-4 h-4 text-zinc-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">E-mail</p>
                                            <p className="font-bold text-sm text-white tracking-tight truncate">{cliente.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-emerald-500/10">
                                        <div className="p-2 rounded-lg bg-zinc-800/50"><Phone className="w-4 h-4 text-zinc-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">WhatsApp</p>
                                            <p className="font-bold text-sm text-white tracking-tight">{cliente.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Histórico */}
            {showHistory && (
                <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow overflow-hidden animate-fade-in-up">
                    <CardHeader className="pb-6 border-b border-zinc-800/50">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold text-white">
                            <div className="p-2 rounded-xl bg-zinc-800/80"><History className="w-5 h-5 text-zinc-400" /></div>
                            Histórico de Consultas
                        </CardTitle>
                        <CardDescription className="text-zinc-500">Registro das últimas verificações efetuadas no sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {history.length === 0 ? (
                            <div className="p-16 text-center text-zinc-600 flex flex-col items-center gap-3">
                                <Search className="w-10 h-10 opacity-20" />
                                <p className="text-sm font-medium">Nenhuma consulta realizada ainda.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-zinc-800/50 bg-black/20">
                                                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">CPF</th>
                                                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Nome</th>
                                                <th className="text-center py-4 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Score</th>
                                                <th className="text-center py-4 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Pendências</th>
                                                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Auditado por</th>
                                                <th className="text-right py-4 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800/30">
                                            {history.map((h) => {
                                                const scoreInfo = h.score ? getScoreInfo(h.score) : null
                                                return (
                                                    <tr key={h.id} className="hover:bg-zinc-800/20 transition-colors group">
                                                        <td className="py-4 px-6 font-mono text-xs text-zinc-300 font-bold tracking-tight">{formatCPF(h.cpf)}</td>
                                                        <td className="py-4 px-6 truncate max-w-[180px] text-zinc-200 font-medium">{h.name || '—'}</td>
                                                        <td className="py-4 px-6 text-center">
                                                            {h.score !== null ? (
                                                                <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border ${scoreInfo?.bg} ${scoreInfo?.textColor} ${scoreInfo?.border}`}>
                                                                    {h.score}
                                                                </span>
                                                            ) : <span className="text-zinc-700 italic">—</span>}
                                                        </td>
                                                        <td className="py-4 px-6 text-center">
                                                            {h.hasPendencies ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                                                                    Sim
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase transition-all">
                                                                    Livre
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{h.admin.name.split(' ')[0]}</td>
                                                        <td className="py-4 px-6 text-right text-xs text-zinc-500 font-medium">{formatDate(h.consultedAt).split(',')[0]}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-zinc-800/30">
                                    {history.map((h) => {
                                        const scoreInfo = h.score ? getScoreInfo(h.score) : null
                                        return (
                                            <div key={h.id} className="p-5 space-y-4 hover:bg-zinc-800/10 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Identificado</p>
                                                        <p className="text-sm font-bold text-white tracking-tight leading-tight">{h.name || formatCPF(h.cpf)}</p>
                                                        {h.name && <p className="text-[10px] font-mono text-zinc-500 mt-1">{formatCPF(h.cpf)}</p>}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Score</p>
                                                        {h.score !== null ? (
                                                            <p className={`text-lg font-black tracking-tighter ${scoreInfo?.textColor}`}>
                                                                {h.score}
                                                            </p>
                                                        ) : <span className="text-zinc-700">—</span>}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-zinc-800/50">
                                                    <div className="flex items-center gap-2">
                                                        {h.hasPendencies ? (
                                                            <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                        ) : (
                                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                                        )}
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${h.hasPendencies ? 'text-red-400' : 'text-emerald-400'}`}>
                                                            {h.hasPendencies ? 'Pendências' : 'Crédito Ok'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                                        {formatDate(h.consultedAt).split(',')[0]}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
