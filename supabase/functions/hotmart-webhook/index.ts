import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HotmartWebhookData {
  event: string
  version: string
  data: {
    buyer: {
      name: string
      email: string
      checkout_phone?: string
      document?: string
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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // GET - Validação da Hotmart
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    
    if (token) {
      return new Response(token, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
        },
      })
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'Webhook Hotmart está ativo',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // POST - Processar webhook
  if (req.method === 'POST') {
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const body: HotmartWebhookData = await req.json()
      console.log('Webhook recebido:', body)

      // Verifica se é compra aprovada
      if (body.event !== 'PURCHASE_APPROVED' && body.data.purchase.status !== 'approved') {
        return new Response(
          JSON.stringify({ message: 'Evento não processado - aguardando aprovação' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const { buyer, purchase, product } = body.data
      const cpf = buyer.document || ''
      const phone = buyer.checkout_phone || ''

      // Verifica se já existe
      const { data: existingMember } = await supabase
        .from('members')
        .select('*')
        .eq('email', buyer.email)
        .single()

      if (existingMember) {
        console.log('Comprador já cadastrado:', buyer.email)
        return new Response(
          JSON.stringify({ message: 'Comprador já cadastrado', member: existingMember }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Insere novo membro
      const { data: newMember, error: insertError } = await supabase
        .from('members')
        .insert({
          name: buyer.name,
          email: buyer.email,
          phone: phone || cpf,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Erro ao inserir:', insertError)
        return new Response(
          JSON.stringify({ error: 'Erro ao cadastrar', details: insertError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Cria usuário no Auth
      try {
        await supabase.auth.admin.createUser({
          email: buyer.email,
          email_confirm: true,
          user_metadata: {
            name: buyer.name,
            cpf: cpf,
            phone: phone,
            hotmart_order: purchase.order_ref,
            product_name: product.name,
          },
        })
      } catch (authError) {
        console.error('Erro ao criar usuário:', authError)
      }

      return new Response(
        JSON.stringify({
          message: 'Comprador cadastrado com sucesso',
          member: newMember,
          order: purchase.order_ref,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      return new Response(
        JSON.stringify({
          error: 'Erro ao processar webhook',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
})
