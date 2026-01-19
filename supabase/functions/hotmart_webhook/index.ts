import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hotmart-token',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validação de segurança - Token secreto
    const hotmartToken = req.headers.get('X-HOTMART-TOKEN')
    const expectedToken = Deno.env.get('HOTMART_WEBHOOK_SECRET')
    
    if (!hotmartToken || hotmartToken !== expectedToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse payload da Hotmart
    const payload = await req.json()
    
    // Extrair dados importantes
    const {
      event,
      data: {
        transaction_id,
        product: { id: product_id } = {},
        buyer: { email: buyer_email, checkout_phone } = {},
        purchase: { status, approved_date, order_date } = {}
      } = {}
    } = payload

    // Extrair CPF do telefone ou payload (Hotmart envia CPF em diferentes formatos)
    let buyer_cpf = payload.data?.buyer?.cpf || payload.data?.buyer?.document || ''
    buyer_cpf = buyer_cpf.replace(/\D/g, '') // Remove tudo que não é número

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Gravar/Atualizar em hotmart_orders (upsert)
    const { error: orderError } = await supabase
      .from('hotmart_orders')
      .upsert({
        transaction_id,
        product_id,
        buyer_email,
        buyer_cpf,
        status,
        event_type: event,
        purchase_date: order_date,
        approved_at: approved_date,
        raw_payload: payload,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'transaction_id'
      })

    if (orderError) {
      console.error('Error saving order:', orderError)
      throw orderError
    }

    // 2. Processar autorização de acesso
    if (status === 'approved' || status === 'paid' || status === 'complete') {
      // Compra aprovada - liberar acesso
      const { error: accessError } = await supabase
        .from('allowed_access')
        .upsert({
          buyer_cpf,
          buyer_email,
          product_id,
          is_allowed: true,
          allowed_at: new Date().toISOString(),
          last_status: status,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'buyer_cpf'
        })

      if (accessError) {
        console.error('Error updating access:', accessError)
        throw accessError
      }

      console.log(`✅ Acesso liberado para CPF: ${buyer_cpf}`)

    } else if (status === 'refunded' || status === 'canceled' || status === 'chargeback') {
      // Compra cancelada/reembolsada - bloquear acesso
      const { error: accessError } = await supabase
        .from('allowed_access')
        .update({
          is_allowed: false,
          last_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('buyer_cpf', buyer_cpf)

      if (accessError) {
        console.error('Error blocking access:', accessError)
        throw accessError
      }

      console.log(`❌ Acesso bloqueado para CPF: ${buyer_cpf}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        transaction_id,
        status
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
