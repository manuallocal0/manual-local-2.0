"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LogOut, User, CheckCircle, Calendar } from "lucide-react"

interface Profile {
  email: string
  cpf: string
  is_paid: boolean
  paid_at: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Verificar se está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile error:', profileError)
        router.push('/login')
        return
      }

      // Verificar se ainda tem acesso
      if (!profileData.is_paid) {
        await supabase.auth.signOut()
        router.push('/login')
        return
      }

      setProfile(profileData)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#111111]">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Card de Boas-vindas */}
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold text-gray-100">
              Bem-vindo ao Manual Local!
            </h2>
          </div>
          <p className="text-gray-300">
            Você tem acesso completo ao conteúdo. Aproveite todos os recursos disponíveis.
          </p>
        </div>

        {/* Informações do Perfil */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card Email */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-medium text-gray-400">E-mail</h3>
              </div>
              <p className="text-lg text-gray-100">{profile.email}</p>
            </div>

            {/* Card CPF */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-medium text-gray-400">CPF</h3>
              </div>
              <p className="text-lg text-gray-100">
                {profile.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
              </p>
            </div>

            {/* Card Status */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-medium text-gray-400">Status</h3>
              </div>
              <p className="text-lg text-emerald-400 font-semibold">
                ✅ Acesso Ativo
              </p>
            </div>

            {/* Card Data de Ativação */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-medium text-gray-400">Membro desde</h3>
              </div>
              <p className="text-lg text-gray-100">
                {new Date(profile.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* Botão para acessar conteúdo */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
          >
            Acessar Manual Local
          </button>
        </div>
      </div>
    </div>
  )
}
