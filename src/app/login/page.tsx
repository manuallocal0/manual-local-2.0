"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validações básicas
      if (!formData.email || !formData.password) {
        throw new Error("Preencha todos os campos")
      }

      // 1. FAZER LOGIN
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error("E-mail ou senha incorretos")
        }
        throw authError
      }

      if (!authData.user) {
        throw new Error("Erro ao fazer login. Tente novamente.")
      }

      // 2. VERIFICAR SE USUÁRIO TEM ACESSO PAGO
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profileData) {
        throw new Error("Perfil não encontrado. Contate o suporte.")
      }

      if (!profileData.is_paid) {
        // Bloquear acesso se não está pago
        await supabase.auth.signOut()
        throw new Error(
          "Sua compra ainda não foi aprovada ou você não tem acesso ao produto. Aguarde a confirmação do pagamento."
        )
      }

      // 3. VERIFICAR SE ACESSO AINDA ESTÁ ATIVO (não foi cancelado/reembolsado)
      const { data: accessData, error: accessError } = await supabase
        .from('allowed_access')
        .select('*')
        .eq('buyer_cpf', profileData.cpf)
        .single()

      if (accessError || !accessData || !accessData.is_allowed) {
        await supabase.auth.signOut()
        throw new Error(
          "Seu acesso foi bloqueado. Isso pode acontecer em caso de reembolso ou cancelamento. Contate o suporte."
        )
      }

      // Login bem-sucedido - redirecionar
      router.push('/dashboard')

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || "Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">
            Entrar
          </h1>
          <p className="text-gray-400 text-sm">
            Acesse sua conta do Manual Local
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Digite sua senha"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-12 pr-12 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Ainda não tem conta?{" "}
              <button
                onClick={() => router.push('/cadastro')}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        {/* Aviso */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-xs text-blue-400 text-center">
            🔒 Apenas clientes com compra aprovada têm acesso ao conteúdo
          </p>
        </div>
      </div>
    </div>
  )
}
