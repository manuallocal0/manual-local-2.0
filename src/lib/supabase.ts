import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as credenciais existirem
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Função para normalizar CPF (apenas números)
export function normalizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

// Função para formatar CPF (XXX.XXX.XXX-XX)
export function formatCPF(cpf: string): string {
  const normalized = normalizeCPF(cpf)
  return normalized.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Validar CPF básico (11 dígitos)
export function isValidCPF(cpf: string): boolean {
  const normalized = normalizeCPF(cpf)
  return normalized.length === 11 && /^\d{11}$/.test(normalized)
}
