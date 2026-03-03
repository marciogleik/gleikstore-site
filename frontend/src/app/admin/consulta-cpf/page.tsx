'use client'

import { useState, useEffect } from 'react'
import { Search, AlertTriangle, CheckCircle, Clock, User, Phone, Mail, Info, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { consultarCpf, getCpfHistory } from '@/lib/api'
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
            const res = await consultarCpf(cpfClean)
            setResult(res)
            await loadHistory()
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-500/15">
                    <Search className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">Consulta CPF</h1>
                    <p className="text-sm text-zinc-400">
                        Verifique a situação financeira e score de crédito de um CPF (SPC/SERASA)
                    </p>
                </div>
            </div>

            {/* Input de busca */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle>Consultar CPF</CardTitle>
                    <CardDescription>Digite o CPF do cliente para verificar a situação de crédito</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpfInput}
                                onChange={(e) => handleCpfChange(e.target.value)}
                                maxLength={14}
                                onKeyDown={(e) => e.key === 'Enter' && handleConsulta()}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="primary" onClick={handleConsulta} loading={isLoading}>
                                <Search className="w-4 h-4 mr-2" />
                                Consultar
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowHistory(!showHistory)}
                            >
                                <History className="w-4 h-4 mr-2" />
                                Histórico
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Demo notice */}
            {result?.isDemo && (
                <div className="p-4 rounded-xl text-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start gap-3">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Modo demonstração</p>
                        <p className="text-amber-400/80 mt-1">
                            API de crédito não configurada. Os dados exibidos são simulados.
                            Para consultas reais, configure <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-xs">CREDIT_API_KEY</code> e <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-xs">CREDIT_API_URL</code> no .env do backend.
                        </p>
                    </div>
                </div>
            )}

            {/* Resultado da consulta */}
            {consulta && (
                <div className="space-y-6">
                    {/* Score + Status Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Score Gauge */}
                        <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-1">
                            <CardContent className="py-8">
                                <h3 className="text-sm uppercase text-zinc-400 text-center mb-4 tracking-wider">Score de Crédito</h3>
                                {consulta.score !== null ? (
                                    <ScoreGauge score={consulta.score} />
                                ) : (
                                    <div className="text-center text-zinc-500">Score não disponível</div>
                                )}
                                <p className="text-center text-xs text-zinc-500 mt-4">Escala de 0 a 1000</p>
                            </CardContent>
                        </Card>

                        {/* Status principal */}
                        <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
                            <CardContent className="py-6 space-y-4">
                                {/* CPF e Nome */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-zinc-800/50">
                                        <p className="text-xs text-zinc-500 uppercase mb-1">CPF Consultado</p>
                                        <p className="text-lg font-mono font-semibold">{formatCPF(consulta.cpf)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-zinc-800/50">
                                        <p className="text-xs text-zinc-500 uppercase mb-1">Nome</p>
                                        <p className="text-lg font-semibold truncate">{consulta.name || '—'}</p>
                                    </div>
                                </div>

                                {/* Situação e Pendências */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-xl border ${consulta.status === 'REGULAR'
                                            ? 'bg-green-500/5 border-green-500/20'
                                            : 'bg-amber-500/5 border-amber-500/20'
                                        }`}>
                                        <p className="text-xs text-zinc-500 uppercase mb-1">Situação RF</p>
                                        <div className="flex items-center gap-2">
                                            {consulta.status === 'REGULAR' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                                            )}
                                            <p className={`text-lg font-semibold ${consulta.status === 'REGULAR' ? 'text-green-400' : 'text-amber-400'
                                                }`}>
                                                {consulta.status || 'Desconhecida'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl border ${consulta.hasPendencies
                                            ? 'bg-red-500/5 border-red-500/20'
                                            : 'bg-green-500/5 border-green-500/20'
                                        }`}>
                                        <p className="text-xs text-zinc-500 uppercase mb-1">Pendências</p>
                                        <div className="flex items-center gap-2">
                                            {consulta.hasPendencies ? (
                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            )}
                                            <p className={`text-lg font-semibold ${consulta.hasPendencies ? 'text-red-400' : 'text-green-400'
                                                }`}>
                                                {consulta.hasPendencies ? 'Sim — Restrições encontradas' : 'Nenhuma'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Data da consulta */}
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    Consultado em {formatDate(consulta.consultedAt)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pendências detalhadas */}
                    {consulta.hasPendencies && consulta.pendencies && (consulta.pendencies as Array<{ tipo: string; valor: string; credor: string; data: string }>).length > 0 && (
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Pendências Encontradas
                                </CardTitle>
                                <CardDescription>Detalhes das restrições financeiras no CPF consultado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {(consulta.pendencies as Array<{ tipo: string; valor: string; credor: string; data: string }>).map((p, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{p.tipo}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{p.credor}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-400">{p.valor}</p>
                                                <p className="text-xs text-zinc-500">{formatDate(p.data)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Cliente cadastrado */}
                    {cliente && (
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-emerald-400 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Cliente Cadastrado na GLEIKSTORE
                                </CardTitle>
                                <CardDescription>Este CPF pertence a um cliente da sua base</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
                                        <User className="w-4 h-4 text-zinc-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Nome</p>
                                            <p className="font-medium text-sm">{cliente.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
                                        <Mail className="w-4 h-4 text-zinc-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Email</p>
                                            <p className="font-medium text-sm truncate">{cliente.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
                                        <Phone className="w-4 h-4 text-zinc-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Telefone</p>
                                            <p className="font-medium text-sm">{cliente.phone}</p>
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
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-zinc-400" />
                            Histórico de Consultas
                        </CardTitle>
                        <CardDescription>Últimas 50 consultas realizadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <p className="text-sm text-zinc-500 text-center py-8">Nenhuma consulta realizada ainda.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-800">
                                            <th className="text-left py-3 px-3 text-xs uppercase text-zinc-500 font-medium">CPF</th>
                                            <th className="text-left py-3 px-3 text-xs uppercase text-zinc-500 font-medium">Nome</th>
                                            <th className="text-center py-3 px-3 text-xs uppercase text-zinc-500 font-medium">Score</th>
                                            <th className="text-center py-3 px-3 text-xs uppercase text-zinc-500 font-medium">Pendências</th>
                                            <th className="text-left py-3 px-3 text-xs uppercase text-zinc-500 font-medium">Consultado por</th>
                                            <th className="text-left py-3 px-3 text-xs uppercase text-zinc-500 font-medium">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((h) => {
                                            const scoreInfo = h.score ? getScoreInfo(h.score) : null
                                            return (
                                                <tr key={h.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                                    <td className="py-3 px-3 font-mono text-xs">{formatCPF(h.cpf)}</td>
                                                    <td className="py-3 px-3 truncate max-w-[140px]">{h.name || '—'}</td>
                                                    <td className="py-3 px-3 text-center">
                                                        {h.score !== null ? (
                                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${scoreInfo?.bg} ${scoreInfo?.textColor} border ${scoreInfo?.border}`}>
                                                                {h.score}
                                                            </span>
                                                        ) : '—'}
                                                    </td>
                                                    <td className="py-3 px-3 text-center">
                                                        {h.hasPendencies ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                                                                <AlertTriangle className="w-3 h-3" /> Sim
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                                                                <CheckCircle className="w-3 h-3" /> Não
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-3 text-xs text-zinc-400">{h.admin.name}</td>
                                                    <td className="py-3 px-3 text-xs text-zinc-500">{formatDate(h.consultedAt)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
