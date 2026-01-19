import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente Supabase com service role para operações administrativas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Tipos para o webhook da Hotmart
interface HotmartWebhookData {
  event: string
  version: string
  data: {
    buyer: {
      name: string
      email: string
      checkout_phone?: string
      document?: string // CPF
    }
    product: {
      id: number
      name: string
    }
    purchase: {
      order_ref: string
      status: string
      approved_date?: number
    }
    commissions?: Array<{
      name: string
      email: string
    }>
  }
}

// Configuração de CORS e headers para aceitar requisições da Hotmart
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handler para OPTIONS (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// Endpoint GET para validação da Hotmart
export async function GET(request: NextRequest) {
  try {
    // A Hotmart envia um parâmetro 'token' para validar o endpoint
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    console.log('[HOTMART WEBHOOK] GET request recebido', { token, url: request.url })
    
    if (token) {
      // Responde com o token recebido para validar o endpoint
      console.log('[HOTMART WEBHOOK] Validando token:', token)
      return new NextResponse(token, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          ...corsHeaders,
        },
      })
    }

    // Resposta padrão para testes manuais
    return NextResponse.json(
      {
        status: 'ok',
        message: 'Webhook Hotmart está ativo e funcionando',
        endpoint: '/api/webhook/hotmart',
        timestamp: new Date().toISOString(),
        server: 'Next.js API Route',
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('[HOTMART WEBHOOK] Erro no GET:', error)
    return new NextResponse('OK', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log da requisição recebida
    console.log('[HOTMART WEBHOOK] POST request recebido')
    
    // Recebe os dados do webhook
    const body: HotmartWebhookData = await request.json()

    console.log('[HOTMART WEBHOOK] Dados recebidos:', JSON.stringify(body, null, 2))

    // Verifica se é um evento de compra aprovada
    if (body.event !== 'PURCHASE_APPROVED' && body.data.purchase.status !== 'approved') {
      console.log('[HOTMART WEBHOOK] Evento não processado:', body.event, body.data.purchase.status)
      return NextResponse.json(
        { 
          success: true,
          message: 'Evento não processado - aguardando aprovação de compra',
          event: body.event,
          status: body.data.purchase.status,
        },
        { 
          status: 200,
          headers: corsHeaders,
        }
      )
    }

    // Extrai os dados do comprador
    const { buyer, purchase, product } = body.data
    const cpf = buyer.document || ''
    const phone = buyer.checkout_phone || ''

    console.log('[HOTMART WEBHOOK] Processando compra aprovada:', {
      buyer: buyer.email,
      order: purchase.order_ref,
      product: product.name,
    })

    // Verifica se o comprador já existe no banco
    const { data: existingMember, error: checkError } = await supabase
      .from('members')
      .select('*')
      .eq('email', buyer.email)
      .single()

    if (existingMember) {
      console.log('[HOTMART WEBHOOK] Comprador já cadastrado:', buyer.email)
      return NextResponse.json(
        { 
          success: true,
          message: 'Comprador já cadastrado', 
          member: existingMember,
        },
        { 
          status: 200,
          headers: corsHeaders,
        }
      )
    }

    // Insere o novo comprador na tabela members
    const { data: newMember, error: insertError } = await supabase
      .from('members')
      .insert({
        name: buyer.name,
        email: buyer.email,
        phone: phone || cpf, // Armazena telefone ou CPF no campo phone
      })
      .select()
      .single()

    if (insertError) {
      console.error('[HOTMART WEBHOOK] Erro ao inserir comprador:', insertError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Erro ao cadastrar comprador', 
          details: insertError.message,
        },
        { 
          status: 500,
          headers: corsHeaders,
        }
      )
    }

    console.log('[HOTMART WEBHOOK] Comprador cadastrado com sucesso:', newMember)

    // Opcional: Criar usuário no Supabase Auth para permitir login
    try {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: buyer.email,
        email_confirm: true,
        user_metadata: {
          name: buyer.name,
          cpf: cpf,
          phone: phone,
          hotmart_order: purchase.order_ref,
          product_name: product.name,
        }
      })

      if (authError) {
        console.error('[HOTMART WEBHOOK] Erro ao criar usuário no Auth:', authError)
      } else {
        console.log('[HOTMART WEBHOOK] Usuário criado no Auth:', authUser.user?.id)
      }
    } catch (authError) {
      console.error('[HOTMART WEBHOOK] Erro ao criar usuário no Auth:', authError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Comprador cadastrado com sucesso',
        member: newMember,
        order: purchase.order_ref,
      },
      { 
        status: 201,
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error('[HOTMART WEBHOOK] Erro ao processar webhook:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao processar webhook', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}
