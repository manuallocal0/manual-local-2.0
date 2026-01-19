"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, normalizeCPF, formatCPF, isValidCPF } from "@/lib/supabase"
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    cpf: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatCPF(value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Validações básicas
      if (!formData.cpf || !formData.email || !formData.password) {
        throw new Error("Preencha todos os campos")
      }

      if (!isValidCPF(formData.cpf)) {
        throw new Error("CPF inválido. Digite 11 dígitos.")
      }

      if (formData.password.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      const cpfNormalizado = normalizeCPF(formData.cpf)

      // 1. VERIFICAR SE EXISTE COMPRA APROVADA
      const { data: accessData, error: accessError } = await supabase
        .from('allowed_access')
        .select('*')
        .eq('buyer_cpf', cpfNormalizado)
        .eq('is_allowed', true)
        .single()

      if (accessError || !accessData) {
        throw new Error(
          "Compra não encontrada para este CPF. Verifique se você comprou com este CPF ou aguarde a aprovação do pagamento."
        )
      }

      // 2. CRIAR USUÁRIO NO SUPABASE AUTH
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error("Este e-mail já está cadastrado. Faça login.")
        }
        throw authError
      }

      if (!authData.user) {
        throw new Error("Erro ao criar usuário. Tente novamente.")
      }

      // 3. CRIAR PERFIL COM CPF E MARCAR COMO PAGO
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          cpf: cpfNormalizado,
          is_paid: true,
          paid_at: accessData.allowed_at,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        throw new Error("Erro ao criar perfil. Contate o suporte.")
      }

      setSuccess("✅ Conta criada com sucesso! Redirecionando...")
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || "Erro ao criar conta. Tente novamente.")
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
            Criar Conta
          </h1>
          <p className="text-gray-400 text-sm">
            Apenas clientes que compraram o produto podem se cadastrar
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CPF */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CPF (usado na compra)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use o mesmo CPF que você usou na compra
              </p>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Digite a senha novamente"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Mensagens de erro/sucesso */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-400">{success}</p>
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:cursor-not-allowed"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{" "}
              <button
                onClick={() => router.push('/login')}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        {/* Aviso de segurança */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-xs text-blue-400 text-center">
            🔒 Seus dados estão protegidos. Apenas clientes com compra aprovada podem criar conta.
          </p>
        </div>
      </div>
    </div>
  )
}
