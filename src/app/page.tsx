"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ChevronDown, ChevronUp, X, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Tipos
type PotencialVenda = "Alto" | "Médio" | "Baixo"
type Categoria = "Alimentício" | "Serviços" | "Venda" | "Pet" | "Artesanal" | "Delivery" | "Eventos" | "Bônus"

interface Produto {
  id: number
  nome: string
  categoria: Categoria
  potencial: PotencialVenda
  bonus?: boolean
  conteudo: {
    oQueE: string
    quantoPrecisa: string
    oQueComprar: string[]
    comoExecutar: string[]
    comoPrecificar: string
    comoDivulgar: string
    crescimento: string
    automacaoIA: string
  }
}

// Base de dados completa dos produtos
const produtos: Produto[] = [
  {
    id: 1,
    nome: "Salgados congelados para venda local",
    categoria: "Alimentício",
    potencial: "Alto",
    conteudo: {
      oQueE: "Produção caseira de salgados (coxinha, pastel, risoles, empada) para venda congelada. Cliente compra e frita em casa quando quiser. Ideal para festas, lanches rápidos e revenda.",
      quantoPrecisa: "R$ 300 a R$ 800 (ingredientes iniciais, embalagens, freezer pequeno ou espaço na geladeira)",
      oQueComprar: [
        "Farinha de trigo, óleo, temperos, recheios (frango, carne, queijo)",
        "Embalagens plásticas transparentes ou sacos zip",
        "Etiquetas adesivas para identificação",
        "Freezer ou congelador (pode começar com o de casa)"
      ],
      comoExecutar: [
        "Escolha 3-4 tipos de salgados para começar (coxinha, pastel, risoles)",
        "Prepare em lotes de 50-100 unidades por vez",
        "Congele em porções de 10, 20 ou 50 unidades",
        "Embale com etiqueta contendo: sabor, quantidade, validade, modo de preparo",
        "Armazene no freezer e venda sob encomenda ou pronta entrega"
      ],
      comoPrecificar: "Calcule custo por unidade (R$ 0,50 a R$ 1,20) e venda por R$ 2,00 a R$ 3,50 cada. Pacotes com 10 unidades: R$ 20 a R$ 30. Margem de lucro: 60-80%.",
      comoDivulgar: "Poste fotos dos salgados prontos no Instagram e Stories. Ofereça degustação grátis para vizinhos e peça indicações. Crie grupo no WhatsApp para pedidos. Divulgue em grupos de bairro no Facebook. Faça parcerias com revendedores locais.",
      crescimento: "Aumente variedade (mini pizzas, esfihas, quibes). Contrate ajudante para produção. Venda para buffets, lanchonetes e escolas. Crie assinatura mensal (100 salgados/mês). Invista em freezer maior e produza em escala.",
      automacaoIA: "Use a LASY para criar cardápio digital automático no WhatsApp. Configure respostas automáticas para pedidos, preços e disponibilidade. Crie lembretes de produção e controle de estoque. Gere posts para redes sociais com fotos e descrições atrativas."
    }
  },
  {
    id: 2,
    nome: "Revenda de perfumes importados + árabes + cremes",
    categoria: "Venda",
    potencial: "Alto",
    conteudo: {
      oQueE: "Revenda de perfumes importados (réplicas premium), perfumes árabes concentrados e cremes hidratantes de marcas famosas. Compra no atacado e vende no varejo com margem alta.",
      quantoPrecisa: "R$ 500 a R$ 1.500 (estoque inicial de 20-30 produtos variados)",
      oQueComprar: [
        "Perfumes importados (réplicas de marcas famosas) - atacado online",
        "Perfumes árabes concentrados (25ml, 50ml)",
        "Cremes hidratantes e cosméticos premium",
        "Embalagens para presente (saquinhos, laços)",
        "Catálogo impresso ou digital com fotos e preços"
      ],
      comoExecutar: [
        "Pesquise fornecedores confiáveis no Mercado Livre, Shopee ou atacados especializados",
        "Compre mix variado: 10 perfumes masculinos, 10 femininos, 5 árabes, 5 cremes",
        "Teste os produtos você mesmo para conhecer qualidade e fixação",
        "Monte catálogo com fotos reais e descrição de cada fragrância",
        "Ofereça teste (borrifar no cliente) antes da venda"
      ],
      comoPrecificar: "Perfumes importados: compra R$ 15-25, venda R$ 45-80. Árabes: compra R$ 20-35, venda R$ 60-120. Cremes: compra R$ 10-20, venda R$ 35-60. Margem: 100-200%.",
      comoDivulgar: "Crie perfil no Instagram com fotos dos produtos e vídeos mostrando fixação. Faça lives demonstrando fragrâncias. Ofereça amostras grátis para influenciadoras locais. Venda em feiras, praças e eventos. Crie catálogo PDF para enviar no WhatsApp.",
      crescimento: "Aumente estoque para 100+ produtos. Crie kits presente (perfume + creme). Venda por consignação em salões de beleza e lojas. Contrate revendedores (sistema de comissão). Monte loja física pequena ou quiosque.",
      automacaoIA: "Use LASY para criar catálogo interativo no WhatsApp com busca por tipo de fragrância. Configure atendimento automático com sugestões personalizadas. Crie sistema de pedidos e controle de estoque. Gere descrições atrativas para cada produto automaticamente."
    }
  },
  {
    id: 3,
    nome: "Marmitas fitness por assinatura",
    categoria: "Alimentício",
    potencial: "Alto",
    conteudo: {
      oQueE: "Preparo e entrega de marmitas saudáveis (baixo carboidrato, proteína magra, legumes) para clientes que querem emagrecer ou ganhar massa muscular. Sistema de assinatura semanal ou mensal.",
      quantoPrecisa: "R$ 800 a R$ 2.000 (ingredientes, marmitas, geladeira, transporte)",
      oQueComprar: [
        "Frango, carne magra, peixe, ovos (proteínas)",
        "Batata doce, arroz integral, legumes variados",
        "Marmitas descartáveis ou reutilizáveis (500ml-1L)",
        "Etiquetas com informações nutricionais",
        "Bolsa térmica para entrega"
      ],
      comoExecutar: [
        "Defina 3-4 opções de cardápio (low carb, tradicional fit, vegano)",
        "Calcule macros de cada refeição (proteína, carboidrato, gordura)",
        "Prepare as marmitas 1-2x por semana em lotes",
        "Embale, etiquete e armazene na geladeira",
        "Entregue nos dias combinados (domingo e quarta, por exemplo)"
      ],
      comoPrecificar: "Custo por marmita: R$ 8-12. Venda: R$ 18-25 cada. Plano semanal (5 marmitas): R$ 90-120. Plano mensal (20 marmitas): R$ 350-450. Margem: 50-70%.",
      comoDivulgar: "Poste fotos das marmitas montadas no Instagram com informações nutricionais. Ofereça primeira semana com desconto. Faça parcerias com personal trainers e nutricionistas. Divulgue em academias (deixe cartões). Crie grupo VIP no WhatsApp para clientes.",
      crescimento: "Aumente para 50-100 clientes. Contrate cozinheira e entregador. Ofereça opções de café da manhã e jantar. Crie app ou site para pedidos. Expanda para empresas (marmitas corporativas). Monte cozinha industrial.",
      automacaoIA: "Use LASY para gerenciar assinaturas e renovações automáticas. Configure lembretes de entrega e cardápio semanal. Crie sistema de feedback automático pós-entrega. Gere relatórios nutricionais personalizados para cada cliente. Automatize cobrança e confirmação de pagamento."
    }
  },
  {
    id: 4,
    nome: "Produtos de limpeza perfumados premium",
    categoria: "Venda",
    potencial: "Médio",
    conteudo: {
      oQueE: "Fabricação caseira de produtos de limpeza com fragrâncias premium (amaciante, sabão líquido, multiuso, aromatizador). Foco em qualidade superior e cheiro marcante.",
      quantoPrecisa: "R$ 400 a R$ 1.000 (matéria-prima, embalagens, essências)",
      oQueComprar: [
        "Base para amaciante, sabão líquido e multiuso (atacado)",
        "Essências premium (lavanda francesa, vanilla, bamboo)",
        "Embalagens PET (500ml, 1L, 2L)",
        "Rótulos personalizados adesivos",
        "Funil, medidor, luvas"
      ],
      comoExecutar: [
        "Compre bases prontas em atacados de produtos de limpeza",
        "Adicione essências premium na proporção indicada (1-3%)",
        "Misture bem e deixe descansar 24h para fixar fragrância",
        "Envase em embalagens limpas e rotuladas",
        "Teste qualidade e cheiro antes de vender em grande escala"
      ],
      comoPrecificar: "Custo por litro: R$ 3-6. Venda: R$ 12-20 (500ml), R$ 20-35 (1L), R$ 35-60 (2L). Margem: 150-250%. Ofereça combos (3 produtos por R$ 50).",
      comoDivulgar: "Ofereça amostras grátis (100ml) para vizinhos testarem. Poste vídeos no Instagram mostrando o cheiro e resultado. Venda porta a porta no bairro. Crie grupo de pedidos no WhatsApp. Faça parcerias com revendedoras (Avon, Natura).",
      crescimento: "Aumente linha de produtos (sabonete líquido, detergente, desinfetante). Crie marca própria com identidade visual. Venda para condomínios e empresas. Contrate revendedores com comissão. Monte pequena fábrica em casa.",
      automacaoIA: "Use LASY para criar catálogo digital interativo com descrição de cada fragrância. Configure sistema de pedidos recorrentes (entrega mensal automática). Crie lembretes de produção baseados em estoque. Gere conteúdo para redes sociais com dicas de uso."
    }
  },
  {
    id: 5,
    nome: "Pizza artesanal (delivery ou congelada)",
    categoria: "Alimentício",
    potencial: "Alto",
    conteudo: {
      oQueE: "Produção de pizzas artesanais de qualidade superior para delivery imediato ou venda congelada (cliente assa em casa). Foco em massa fermentada e ingredientes premium.",
      quantoPrecisa: "R$ 600 a R$ 1.500 (ingredientes, embalagens, forno elétrico ou a gás)",
      oQueComprar: [
        "Farinha de trigo especial, fermento biológico, azeite",
        "Molho de tomate, queijo mussarela, ingredientes variados",
        "Caixas de pizza (delivery) ou embalagens plásticas (congelada)",
        "Forno elétrico grande ou forno a gás",
        "Pás, formas, utensílios"
      ],
      comoExecutar: [
        "Prepare massa artesanal com fermentação de 24-48h",
        "Monte pizzas com ingredientes frescos e de qualidade",
        "Para delivery: asse e entregue quente em até 40min",
        "Para congelada: monte, congele crua e embale com instruções de preparo",
        "Ofereça 5-8 sabores inicialmente (margherita, calabresa, portuguesa, 4 queijos)"
      ],
      comoPrecificar: "Custo por pizza: R$ 8-15. Venda delivery: R$ 35-55 (média), R$ 45-70 (grande). Congelada: R$ 25-40. Margem: 100-200%. Ofereça combos (2 pizzas + refri).",
      comoDivulgar: "Crie perfil no Instagram com fotos profissionais das pizzas. Ofereça degustação grátis para influenciadores locais. Cadastre em apps de delivery (iFood, Rappi). Distribua panfletos no bairro. Faça promoções de lançamento (compre 1, leve 2).",
      crescimento: "Aumente cardápio (pizzas doces, calzones, esfihas). Contrate pizzaiolo e entregador. Monte cozinha profissional. Abra ponto físico pequeno. Venda para empresas (eventos corporativos). Crie franquia caseira.",
      automacaoIA: "Use LASY para automatizar pedidos via WhatsApp com cardápio interativo. Configure sistema de rastreamento de entrega. Crie lembretes de produção e controle de ingredientes. Gere promoções automáticas baseadas em horário (happy hour). Automatize feedback pós-entrega."
    }
  },
  {
    id: 6,
    nome: "Doces gourmet (brownie, bolo no pote)",
    categoria: "Alimentício",
    potencial: "Alto",
    conteudo: {
      oQueE: "Produção artesanal de doces gourmet sofisticados (brownies recheados, bolos no pote, palha italiana, brigadeiros gourmet) para venda local e encomendas.",
      quantoPrecisa: "R$ 400 a R$ 1.000 (ingredientes premium, embalagens, utensílios)",
      oQueComprar: [
        "Chocolate nobre (50-70% cacau), leite condensado, creme de leite",
        "Farinha, ovos, manteiga, açúcar, essências",
        "Potes de vidro ou plástico transparente (200ml-500ml)",
        "Embalagens kraft, fitas, etiquetas personalizadas",
        "Formas, batedeira, fouet"
      ],
      comoExecutar: [
        "Escolha 3-4 produtos principais (brownie, bolo no pote, brigadeiro gourmet)",
        "Desenvolva receitas com ingredientes premium e apresentação impecável",
        "Produza em lotes de 20-50 unidades",
        "Embale com capricho (laços, etiquetas, embalagens bonitas)",
        "Venda sob encomenda ou pronta entrega (validade 3-7 dias refrigerado)"
      ],
      comoPrecificar: "Custo por unidade: R$ 3-8. Venda: brownie R$ 12-18, bolo no pote R$ 15-25, brigadeiro gourmet R$ 3-5 cada. Kits presente: R$ 40-80. Margem: 100-200%.",
      comoDivulgar: "Invista em fotos profissionais (luz natural, fundo neutro). Poste diariamente no Instagram e Stories. Ofereça degustação em eventos locais. Faça parcerias com cafeterias. Crie cardápio digital para WhatsApp. Venda em feiras gastronômicas.",
      crescimento: "Aumente variedade (tortas, cheesecakes, trufas). Crie linha de doces sem açúcar. Venda para festas e eventos corporativos. Contrate confeiteira. Monte ateliê profissional. Crie curso online de doces gourmet.",
      automacaoIA: "Use LASY para criar cardápio interativo com fotos e descrições. Configure sistema de encomendas com data e horário de entrega. Crie lembretes de produção e validade. Gere posts automáticos para redes sociais. Automatize mensagens de agradecimento pós-venda."
    }
  },
  {
    id: 7,
    nome: "Loja de réplicas premium (camisas + tênis)",
    categoria: "Venda",
    potencial: "Alto",
    conteudo: {
      oQueE: "Revenda de réplicas premium de camisas de time, tênis de marca e roupas esportivas de alta qualidade. Compra no atacado e vende no varejo com margem alta.",
      quantoPrecisa: "R$ 1.000 a R$ 3.000 (estoque inicial de 30-50 peças variadas)",
      oQueComprar: [
        "Camisas de futebol (times brasileiros e europeus) - atacado",
        "Tênis réplicas premium (Nike, Adidas, Jordan)",
        "Shorts, meias, bonés esportivos",
        "Cabideiro, araras ou prateleiras",
        "Embalagens (sacolas personalizadas)"
      ],
      comoExecutar: [
        "Pesquise fornecedores confiáveis (Brás-SP, atacados online, importadores)",
        "Compre mix variado: camisas de times populares, tênis clássicos, tamanhos variados",
        "Teste qualidade (costura, tecido, acabamento) antes de comprar em grande escala",
        "Tire fotos profissionais de cada produto",
        "Venda online (Instagram, WhatsApp) ou monte banca em feira/evento"
      ],
      comoPrecificar: "Camisas: compra R$ 25-40, venda R$ 80-120. Tênis: compra R$ 80-150, venda R$ 250-400. Shorts: compra R$ 15-25, venda R$ 50-80. Margem: 100-150%.",
      comoDivulgar: "Crie perfil no Instagram com fotos dos produtos em uso (modelos vestindo). Faça parcerias com influenciadores esportivos locais. Venda em dias de jogos (monte barraca perto de estádios). Ofereça frete grátis acima de R$ 200. Crie grupo VIP no WhatsApp.",
      crescimento: "Aumente estoque para 200+ peças. Monte loja física ou container. Venda online em marketplaces (Shopee, Mercado Livre). Contrate vendedores com comissão. Crie marca própria. Importe direto da China.",
      automacaoIA: "Use LASY para criar catálogo digital com busca por time, marca ou tamanho. Configure atendimento automático com sugestões de produtos. Crie sistema de controle de estoque e tamanhos. Gere descrições e posts para redes sociais automaticamente."
    }
  },
  {
    id: 8,
    nome: "Cestas básicas / kits alimentação premium",
    categoria: "Alimentício",
    potencial: "Médio",
    conteudo: {
      oQueE: "Montagem e venda de cestas básicas completas ou kits de alimentação premium (café da manhã, churrasco, italiana) para famílias, empresas e presentes.",
      quantoPrecisa: "R$ 800 a R$ 2.000 (produtos variados, cestas, embalagens)",
      oQueComprar: [
        "Produtos básicos (arroz, feijão, óleo, açúcar, café, macarrão)",
        "Produtos premium (azeite, vinhos, queijos, geleias artesanais)",
        "Cestas de vime, caixas de madeira ou papelão kraft",
        "Papel celofane, laços, fitas decorativas",
        "Etiquetas personalizadas"
      ],
      comoExecutar: [
        "Defina 3-5 tipos de cestas (básica R$ 100, premium R$ 200, luxo R$ 400)",
        "Compre produtos em atacados (Atacadão, Makro, distribuidores)",
        "Monte cestas com variedade e apresentação impecável",
        "Embale com celofane e laço grande",
        "Ofereça entrega grátis acima de 2 cestas"
      ],
      comoPrecificar: "Custo cesta básica: R$ 70-80, venda R$ 120-150. Cesta premium: custo R$ 130-150, venda R$ 220-280. Margem: 40-60%. Ofereça descontos para empresas (10+ cestas).",
      comoDivulgar: "Poste fotos das cestas montadas no Instagram. Ofereça para empresas como presente de fim de ano. Venda em datas comemorativas (Natal, Páscoa, Dia das Mães). Faça parcerias com RH de empresas. Distribua panfletos em condomínios.",
      crescimento: "Crie cestas temáticas (vegana, sem glúten, fitness). Venda para prefeituras e ONGs. Monte serviço de assinatura mensal. Contrate montador e entregador. Expanda para kits de limpeza e higiene.",
      automacaoIA: "Use LASY para criar catálogo digital com opções de personalização. Configure sistema de pedidos corporativos em grande escala. Crie lembretes de datas comemorativas para oferecer cestas. Gere orçamentos automáticos baseados em quantidade. Automatize confirmação de entrega."
    }
  },
  {
    id: 9,
    nome: "Kits presenteáveis (datas comemorativas)",
    categoria: "Venda",
    potencial: "Alto",
    conteudo: {
      oQueE: "Montagem de kits presente personalizados para datas comemorativas (Dia das Mães, Namorados, Natal, aniversários) com produtos variados e embalagem caprichada.",
      quantoPrecisa: "R$ 600 a R$ 1.500 (produtos variados, embalagens, decoração)",
      oQueComprar: [
        "Produtos variados (chocolates, vinhos, cosméticos, canecas, pelúcias)",
        "Caixas de presente (MDF, papelão kraft, acrílico)",
        "Papel seda, celofane, fitas, laços",
        "Cartões personalizados, tags decorativas",
        "Enchimento decorativo (palha, papel picado)"
      ],
      comoExecutar: [
        "Defina tema de cada kit (romântico, relaxante, gourmet, infantil)",
        "Compre produtos no atacado (25 de Março-SP, Shopee, fornecedores)",
        "Monte kits com 5-8 itens complementares",
        "Embale com capricho (camadas, cores harmoniosas, laço grande)",
        "Tire fotos profissionais de cada kit montado"
      ],
      comoPrecificar: "Custo por kit: R$ 40-80. Venda: R$ 100-200 (básico), R$ 200-350 (premium). Margem: 80-120%. Ofereça personalização (nome, mensagem) por +R$ 20.",
      comoDivulgar: "Poste fotos dos kits 30 dias antes de cada data comemorativa. Faça lives mostrando montagem. Ofereça entrega grátis acima de R$ 150. Crie urgência (últimas unidades). Venda em feiras e eventos. Faça parcerias com floriculturas.",
      crescimento: "Crie kits corporativos para empresas. Ofereça assinatura trimestral (kit surpresa a cada 3 meses). Monte ateliê de personalização. Contrate montador. Expanda para decoração de eventos. Crie loja online.",
      automacaoIA: "Use LASY para criar catálogo sazonal com kits de cada data comemorativa. Configure lembretes automáticos 45 dias antes de cada data. Crie sistema de personalização (cliente escolhe produtos). Gere mensagens de cartão automaticamente. Automatize confirmação de entrega com foto."
    }
  },
  {
    id: 10,
    nome: "Churrasco no kg para compra e levar (com acompanhamentos)",
    categoria: "Alimentício",
    potencial: "Alto",
    conteudo: {
      oQueE: "Venda de churrasco pronto por quilo para cliente comprar e levar para casa. Inclui carnes variadas, acompanhamentos (farofa, vinagrete, pão de alho) e molhos. Ideal para finais de semana.",
      quantoPrecisa: "R$ 1.000 a R$ 2.500 (carnes, churrasqueira, carvão, embalagens)",
      oQueComprar: [
        "Carnes variadas (picanha, costela, linguiça, frango, coração)",
        "Carvão, acendedor, sal grosso, temperos",
        "Ingredientes para acompanhamentos (farofa, vinagrete, pão de alho)",
        "Marmitas de alumínio (1kg, 2kg)",
        "Churrasqueira grande ou grelha profissional"
      ],
      comoExecutar: [
        "Prepare churrasco aos sábados e domingos (horário de pico: 11h-14h)",
        "Asse carnes variadas e mantenha aquecidas",
        "Prepare acompanhamentos frescos (farofa, vinagrete, molhos)",
        "Cliente escolhe quantidade (500g, 1kg, 2kg) e você embala na hora",
        "Ofereça opção de entrega local (raio de 3km)"
      ],
      comoPrecificar: "Custo por kg: R$ 25-35. Venda: R$ 60-80/kg (com acompanhamentos). Margem: 60-80%. Ofereça combos (2kg + 2L refri por R$ 150).",
      comoDivulgar: "Poste fotos e vídeos do churrasco sendo preparado no Instagram. Ofereça degustação grátis no primeiro final de semana. Distribua panfletos no bairro durante a semana. Crie grupo de pedidos no WhatsApp. Faça parcerias com mercadinhos locais.",
      crescimento: "Aumente produção para 50-100kg por dia. Contrate churrasqueiro e atendente. Monte ponto fixo (container, trailer). Ofereça delivery em raio maior. Venda para eventos e festas. Crie serviço de churrasco a domicílio (churrasqueiro vai na casa do cliente).",
      automacaoIA: "Use LASY para receber pedidos antecipados via WhatsApp. Configure cardápio com opções de carnes e acompanhamentos. Crie sistema de agendamento de retirada. Gere lembretes de produção baseados em pedidos. Automatize confirmação de pedido pronto para retirada."
    }
  },
  {
    id: 11,
    nome: "Velas aromatizadas artesanais",
    categoria: "Artesanal",
    potencial: "Médio",
    conteudo: {
      oQueE: "Produção artesanal de velas decorativas aromatizadas com fragrâncias premium. Foco em design moderno, embalagem bonita e aromas exclusivos para venda local e online.",
      quantoPrecisa: "R$ 400 a R$ 1.000 (parafina/cera, essências, potes, pavio)",
      oQueComprar: [
        "Parafina ou cera de soja (5-10kg)",
        "Essências aromáticas premium (lavanda, vanilla, canela)",
        "Potes de vidro transparente ou colorido (200ml-500ml)",
        "Pavios de algodão, suporte para pavio",
        "Corantes (opcional), termômetro, panela para derreter"
      ],
      comoExecutar: [
        "Derreta a cera em banho-maria (60-70°C)",
        "Adicione essência (5-10% do peso da cera) e corante se desejar",
        "Fixe o pavio no centro do pote",
        "Despeje a cera derretida no pote e deixe esfriar 24h",
        "Finalize com tampa, rótulo e embalagem decorativa"
      ],
      comoPrecificar: "Custo por vela: R$ 8-15. Venda: R$ 35-60 (200ml), R$ 50-90 (500ml). Kits com 3 velas: R$ 120-180. Margem: 150-250%.",
      comoDivulgar: "Invista em fotos profissionais com luz natural. Poste no Instagram com foco em decoração e bem-estar. Venda em feiras de artesanato e lojas de decoração. Ofereça personalização (nome, mensagem). Crie kits presente para datas comemorativas.",
      crescimento: "Crie linha de velas temáticas (Natal, relaxamento, energizante). Ofereça workshops de fabricação. Venda para spas, hotéis e lojas de decoração. Monte ateliê profissional. Crie loja online e venda nacional. Desenvolva marca própria.",
      automacaoIA: "Use LASY para criar catálogo digital com descrição de cada fragrância. Configure sistema de pedidos personalizados (cliente escolhe aroma, cor, tamanho). Crie lembretes de produção e controle de estoque. Gere conteúdo para redes sociais com dicas de uso e decoração."
    }
  },
  {
    id: 12,
    nome: "Banho de pet a domicílio",
    categoria: "Pet",
    potencial: "Alto",
    conteudo: {
      oQueE: "Serviço de banho e tosa de cães e gatos na casa do cliente. Você leva todos os equipamentos e produtos, realiza o serviço no local e deixa o pet limpo e cheiroso.",
      quantoPrecisa: "R$ 800 a R$ 2.000 (equipamentos, produtos, transporte)",
      oQueComprar: [
        "Banheira portátil ou lona grande",
        "Shampoo, condicionador, perfume pet",
        "Secador profissional, escova, pente, tesoura",
        "Toalhas, avental impermeável",
        "Carro ou moto para transporte de equipamentos"
      ],
      comoExecutar: [
        "Agende horário com cliente via WhatsApp",
        "Chegue no local com todos os equipamentos",
        "Monte estrutura (banheira, lona para proteger o chão)",
        "Realize banho completo (shampoo, condicionador, secagem, escovação)",
        "Limpe e organize tudo antes de sair"
      ],
      comoPrecificar: "Banho simples: R$ 50-80 (pequeno porte), R$ 70-100 (médio), R$ 90-150 (grande). Banho + tosa: +R$ 30-50. Margem: 60-70%. Ofereça pacotes mensais com desconto.",
      comoDivulgar: "Poste fotos de antes e depois no Instagram. Ofereça primeiro banho com 30% desconto. Distribua panfletos em pet shops e clínicas veterinárias. Crie grupo no WhatsApp para agendamentos. Faça parcerias com veterinários e adestradores.",
      crescimento: "Contrate banhista e compre segunda van equipada. Ofereça serviços extras (corte de unhas, limpeza de ouvidos, hidratação). Crie planos de assinatura mensal. Expanda para serviços de veterinário a domicílio. Monte pet shop móvel completo.",
      automacaoIA: "Use LASY para automatizar agendamentos via WhatsApp com calendário disponível. Configure lembretes automáticos 1 dia antes do banho. Crie sistema de histórico do pet (última visita, preferências). Gere mensagens de pós-atendimento com foto do pet. Automatize cobrança e confirmação de pagamento."
    }
  },
  {
    id: 13,
    nome: "Limpeza de estofados a domicílio",
    categoria: "Serviços",
    potencial: "Alto",
    conteudo: {
      oQueE: "Serviço profissional de limpeza de sofás, colchões, cadeiras, tapetes e estofados em geral na casa do cliente. Uso de equipamentos profissionais (extratora, aspirador) e produtos específicos.",
      quantoPrecisa: "R$ 1.500 a R$ 4.000 (extratora, aspirador, produtos, transporte)",
      oQueComprar: [
        "Extratora profissional (equipamento principal)",
        "Aspirador de pó potente",
        "Produtos de limpeza específicos (shampoo, removedor de manchas)",
        "Escova, pano, luvas",
        "Carro ou van para transporte"
      ],
      comoExecutar: [
        "Agende visita para avaliar estado dos estofados",
        "Chegue com equipamentos e produtos",
        "Aspire todo o estofado para remover sujeira superficial",
        "Aplique produto de limpeza e use extratora para sugar sujeira profunda",
        "Deixe secar (ventilador acelera processo) e finalize com perfume"
      ],
      comoPrecificar: "Sofá 2 lugares: R$ 80-120. Sofá 3 lugares: R$ 120-180. Colchão solteiro: R$ 80-120, casal: R$ 120-180. Tapete: R$ 15-25/m². Margem: 60-80%.",
      comoDivulgar: "Poste vídeos de antes e depois no Instagram (resultado impressiona). Ofereça primeira limpeza com desconto. Distribua panfletos em condomínios. Faça parcerias com imobiliárias (limpeza pós-mudança). Anuncie em grupos de bairro no Facebook.",
      crescimento: "Contrate ajudante e compre segunda extratora. Ofereça serviços extras (impermeabilização, higienização com ozônio). Crie pacotes para condomínios. Expanda para limpeza de carros. Monte franquia do serviço.",
      automacaoIA: "Use LASY para automatizar agendamentos e orçamentos via WhatsApp. Configure sistema de lembretes de manutenção (cliente deve limpar a cada 6 meses). Crie histórico de serviços realizados. Gere mensagens de pós-atendimento com dicas de conservação. Automatize cobrança e emissão de recibos."
    }
  },
  {
    id: 14,
    nome: "Hotelzinho / canil em casa (hospedagem pet)",
    categoria: "Pet",
    potencial: "Médio",
    conteudo: {
      oQueE: "Hospedagem de cães e gatos na sua casa enquanto os donos viajam. Você cuida, alimenta, passeia e dá atenção aos pets como se fossem seus. Ideal para quem ama animais e tem espaço em casa.",
      quantoPrecisa: "R$ 500 a R$ 1.500 (casinhas, comedouros, brinquedos, cerca)",
      oQueComprar: [
        "Casinhas ou camas confortáveis para pets",
        "Comedouros e bebedouros",
        "Brinquedos, coleiras, guias",
        "Cerca ou portão para delimitar área segura",
        "Produtos de limpeza e higiene"
      ],
      comoExecutar: [
        "Prepare espaço seguro e confortável em casa (quintal, varanda, cômodo)",
        "Receba o pet com ficha de informações (alimentação, medicação, comportamento)",
        "Cuide como se fosse seu: alimente, passeie, brinque, dê carinho",
        "Envie fotos e vídeos diários para o dono via WhatsApp",
        "Devolva o pet limpo e feliz"
      ],
      comoPrecificar: "Diária: R$ 40-70 (pequeno porte), R$ 60-90 (médio), R$ 80-120 (grande). Desconto para hospedagens longas (7+ dias: -15%). Margem: 70-80%.",
      comoDivulgar: "Poste fotos e vídeos dos pets hospedados no Instagram (com autorização dos donos). Ofereça primeira diária com desconto. Faça parcerias com pet shops e veterinários. Distribua cartões em clínicas veterinárias. Crie grupo no WhatsApp para clientes.",
      crescimento: "Aumente capacidade (receba 5-10 pets simultaneamente). Contrate cuidador. Monte estrutura profissional (canis individuais, área de recreação). Ofereça serviços extras (banho, adestramento). Crie creche para pets (day care). Expanda para hotel pet profissional.",
      automacaoIA: "Use LASY para automatizar reservas via WhatsApp com calendário de disponibilidade. Configure lembretes de alimentação e medicação de cada pet. Crie sistema de envio automático de fotos diárias. Gere relatório de comportamento do pet. Automatize cobrança e confirmação de pagamento."
    }
  },
  {
    id: 15,
    nome: "Sorvete na casquinha com recheios",
    categoria: "Alimentício",
    potencial: "Alto",
    conteudo: {
      oQueE: "Venda de sorvete artesanal na casquinha com recheios variados (Nutella, doce de leite, morango, paçoca) em ponto fixo ou carrinho móvel. Foco em qualidade e variedade de sabores.",
      quantoPrecisa: "R$ 1.500 a R$ 4.000 (freezer, sorvetes, casquinhas, recheios, carrinho)",
      oQueComprar: [
        "Freezer horizontal ou vertical",
        "Sorvetes de qualidade (compre de fornecedor ou faça artesanal)",
        "Casquinhas, copinhos, colheres",
        "Recheios variados (Nutella, doce de leite, geleias, caldas)",
        "Carrinho ou barraca (se for ponto móvel)"
      ],
      comoExecutar: [
        "Escolha ponto estratégico (praça, praia, parque, eventos)",
        "Ofereça 8-12 sabores de sorvete + 5-8 recheios",
        "Monte casquinha na hora: bola de sorvete + recheio no meio + cobertura",
        "Capriche na apresentação (granulado, chantilly, frutas)",
        "Atenda com simpatia e agilidade"
      ],
      comoPrecificar: "Custo por casquinha: R$ 3-5. Venda: R$ 12-18 (simples), R$ 15-25 (com recheio e cobertura). Margem: 150-250%. Ofereça combos (2 casquinhas por R$ 30).",
      comoDivulgar: "Poste fotos e vídeos das casquinhas montadas no Instagram. Ofereça degustação grátis no primeiro dia. Distribua panfletos no bairro. Faça parcerias com eventos locais. Crie promoções em dias quentes. Anuncie em grupos de bairro.",
      crescimento: "Aumente variedade (açaí, milk-shake, picolés gourmet). Contrate atendente. Monte segundo ponto em local diferente. Ofereça delivery. Crie franquia do carrinho. Expanda para sorveteria física.",
      automacaoIA: "Use LASY para receber pedidos antecipados via WhatsApp (cliente busca pronto). Configure cardápio digital com fotos de cada combinação. Crie sistema de fidelidade (a cada 10 casquinhas, ganhe 1). Gere promoções automáticas em dias de calor. Automatize controle de estoque de recheios."
    }
  },
  {
    id: 16,
    nome: "Guaraná da Amazônia gourmet",
    categoria: "Alimentício",
    potencial: "Médio",
    conteudo: {
      oQueE: "Venda de guaraná natural da Amazônia em versão gourmet (com frutas, especiarias, zero açúcar) em garrafas de vidro. Produto premium, saudável e diferenciado para venda local.",
      quantoPrecisa: "R$ 600 a R$ 1.500 (guaraná em pó, ingredientes, garrafas, liquidificador)",
      oQueComprar: [
        "Guaraná em pó 100% natural (1-2kg)",
        "Frutas (morango, limão, maracujá, açaí)",
        "Adoçantes naturais (stévia, xilitol) ou mel",
        "Garrafas de vidro (500ml, 1L) com tampa",
        "Rótulos personalizados, liquidificador potente"
      ],
      comoExecutar: [
        "Prepare guaraná natural: dissolva pó em água gelada",
        "Adicione frutas batidas, especiarias (gengibre, canela) ou zero açúcar",
        "Bata no liquidificador até ficar homogêneo",
        "Envase em garrafas de vidro limpas e rotuladas",
        "Armazene na geladeira (validade 3-5 dias)"
      ],
      comoPrecificar: "Custo por litro: R$ 8-12. Venda: R$ 25-35 (500ml), R$ 40-60 (1L). Margem: 150-200%. Ofereça assinatura semanal (4L por mês: R$ 140).",
      comoDivulgar: "Poste fotos e vídeos do preparo no Instagram. Ofereça degustação grátis em academias e eventos esportivos. Faça parcerias com nutricionistas e personal trainers. Venda em feiras orgânicas. Distribua amostras em crossfit e estúdios de yoga.",
      crescimento: "Crie linha de bebidas naturais (açaí, cupuaçu, cacau). Venda para restaurantes saudáveis e cafeterias. Ofereça delivery assinatura. Contrate produção. Monte pequena fábrica. Expanda para venda online nacional.",
      automacaoIA: "Use LASY para gerenciar assinaturas e entregas semanais. Configure cardápio digital com opções de sabores. Crie lembretes de produção baseados em pedidos. Gere conteúdo educativo sobre benefícios do guaraná. Automatize cobrança recorrente de assinantes."
    }
  },
  {
    id: 17,
    nome: "Marmitex delivery tradicional",
    categoria: "Delivery",
    potencial: "Alto",
    conteudo: {
      oQueE: "Preparo e entrega de marmitex tradicional (arroz, feijão, carne, salada) para almoço e jantar. Foco em comida caseira, saborosa e preço acessível para trabalhadores e famílias.",
      quantoPrecisa: "R$ 800 a R$ 2.000 (ingredientes, marmitas, fogão industrial, geladeira)",
      oQueComprar: [
        "Ingredientes básicos (arroz, feijão, carnes, legumes, temperos)",
        "Marmitas descartáveis (500ml, 1L)",
        "Fogão industrial ou fogão grande",
        "Geladeira para armazenar ingredientes",
        "Moto ou bicicleta para entrega"
      ],
      comoExecutar: [
        "Defina cardápio semanal (2-3 opções de carne por dia)",
        "Prepare comida em grande quantidade (50-100 marmitas/dia)",
        "Monte marmitas: arroz, feijão, carne, acompanhamento, salada",
        "Embale, etiquete e mantenha aquecidas",
        "Entregue entre 11h-13h (almoço) e 18h-20h (jantar)"
      ],
      comoPrecificar: "Custo por marmita: R$ 6-9. Venda: R$ 15-22 (500ml), R$ 18-28 (1L). Margem: 60-80%. Ofereça vale-refeição (20 marmitas: R$ 300).",
      comoDivulgar: "Poste fotos do cardápio diário no Instagram e Stories. Distribua panfletos em empresas, escritórios e construções. Ofereça primeira marmita grátis. Crie grupo de pedidos no WhatsApp. Faça parcerias com empresas (entrega corporativa).",
      crescimento: "Aumente produção para 200-500 marmitas/dia. Contrate cozinheira e entregadores. Monte cozinha industrial. Ofereça café da manhã e lanches. Crie app de pedidos. Expanda para múltiplos bairros. Abra restaurante físico.",
      automacaoIA: "Use LASY para receber pedidos automáticos via WhatsApp. Configure cardápio diário com atualização automática. Crie sistema de assinatura (pedido recorrente). Gere lembretes de produção baseados em pedidos. Automatize roteirização de entregas por região."
    }
  },
  {
    id: 18,
    nome: "Venda de carne de sol crua (1kg e 2kg)",
    categoria: "Alimentício",
    potencial: "Médio",
    conteudo: {
      oQueE: "Preparo e venda de carne de sol artesanal crua (dessalgada e embalada a vácuo) para cliente preparar em casa. Produto regional de alta demanda, especialmente no Nordeste.",
      quantoPrecisa: "R$ 1.000 a R$ 2.500 (carne, sal, embaladora a vácuo, geladeira)",
      oQueComprar: [
        "Carne bovina de qualidade (alcatra, coxão duro)",
        "Sal grosso para salga",
        "Embaladora a vácuo e sacos plásticos",
        "Geladeira ou freezer para armazenar",
        "Etiquetas com informações e validade"
      ],
      comoExecutar: [
        "Compre carne de qualidade em açougue ou atacado",
        "Faça salga: cubra carne com sal grosso e deixe 24-48h",
        "Lave bem para dessalgar (deixe de molho 6-12h trocando água)",
        "Corte em porções de 1kg ou 2kg",
        "Embale a vácuo, etiquete e armazene refrigerado"
      ],
      comoPrecificar: "Custo por kg: R$ 25-35. Venda: R$ 50-70/kg. Margem: 60-80%. Ofereça pacotes (3kg por R$ 140).",
      comoDivulgar: "Poste fotos da carne embalada e pronta no Instagram. Ofereça degustação (carne preparada) em eventos. Venda em feiras livres e mercados locais. Distribua panfletos em bairros. Faça parcerias com restaurantes regionais.",
      crescimento: "Aumente produção para 50-100kg/semana. Crie linha de produtos (carne de sol temperada, charque, jerked beef). Venda para restaurantes e churrascarias. Contrate ajudante. Monte pequena fábrica. Expanda para venda online nacional.",
      automacaoIA: "Use LASY para receber pedidos via WhatsApp com opções de peso. Configure sistema de controle de produção e validade. Crie lembretes de dessalga e embalagem. Gere receitas e dicas de preparo para clientes. Automatize confirmação de pedido pronto."
    }
  },
  {
    id: 19,
    nome: "Aluguel + decoração de aniversários simples",
    categoria: "Eventos",
    potencial: "Alto",
    conteudo: {
      oQueE: "Aluguel de itens decorativos (mesas, cadeiras, toalhas, balões, painéis) e montagem de decoração simples para festas de aniversário infantil e adulto em casa ou salão pequeno.",
      quantoPrecisa: "R$ 1.500 a R$ 4.000 (itens decorativos, mesas, cadeiras, painéis)",
      oQueComprar: [
        "Mesas e cadeiras dobráveis (10-20 unidades)",
        "Toalhas de mesa coloridas, capas de cadeira",
        "Balões, painéis de tecido ou lona, suportes",
        "Itens temáticos (personagens infantis, cores específicas)",
        "Carro ou van para transporte"
      ],
      comoExecutar: [
        "Receba pedido com tema, data, local e número de convidados",
        "Separe itens necessários (mesas, cadeiras, decoração)",
        "Chegue 3-4h antes da festa para montar tudo",
        "Decore conforme tema (balões, painel, mesa do bolo, centro de mesa)",
        "Desmonte e recolha itens após a festa"
      ],
      comoPrecificar: "Decoração simples (até 30 pessoas): R$ 300-500. Decoração completa (até 50 pessoas): R$ 600-900. Aluguel de mesas e cadeiras: +R$ 200-400. Margem: 60-70%.",
      comoDivulgar: "Poste fotos de festas decoradas no Instagram (antes, durante, depois). Ofereça primeira decoração com desconto. Distribua cartões em escolas e creches. Faça parcerias com buffets e salões de festa. Anuncie em grupos de mães no Facebook.",
      crescimento: "Aumente estoque de itens (mais temas, mais mesas). Ofereça pacotes completos (decoração + buffet + bolo). Contrate montador. Expanda para casamentos e eventos corporativos. Monte loja de aluguel de itens para festa.",
      automacaoIA: "Use LASY para automatizar orçamentos via WhatsApp com base em tema e número de convidados. Configure calendário de disponibilidade. Crie lembretes de montagem e desmontagem. Gere contratos automáticos. Automatize cobrança e confirmação de pagamento."
    }
  },
  {
    id: 20,
    nome: "Aluguel de enxoval para recém-nascidos",
    categoria: "Serviços",
    potencial: "Médio",
    conteudo: {
      oQueE: "Aluguel de enxoval completo para bebês recém-nascidos (berço, banheira, carrinho, roupinhas, fraldas de pano) para famílias que querem economizar ou testar produtos antes de comprar.",
      quantoPrecisa: "R$ 2.000 a R$ 5.000 (berços, carrinhos, banheiras, roupas, acessórios)",
      oQueComprar: [
        "Berços portáteis, carrinhos de bebê",
        "Banheiras, trocadores, cadeirinhas",
        "Roupinhas (bodies, macacões, mantas) - tamanhos RN a 6 meses",
        "Fraldas de pano, toalhas, lençóis",
        "Produtos de higienização profissional"
      ],
      comoExecutar: [
        "Receba pedido com data prevista do parto e itens desejados",
        "Higienize e prepare enxoval completo",
        "Entregue na casa da família 1 semana antes do parto",
        "Aluguel por 1-3 meses (renovável)",
        "Recolha, higienize profissionalmente e prepare para próximo cliente"
      ],
      comoPrecificar: "Aluguel mensal: R$ 200-400 (enxoval básico), R$ 400-700 (enxoval completo). Caução: R$ 300-500 (devolvida ao final). Margem: 60-70% após custos de higienização.",
      comoDivulgar: "Poste fotos dos enxovais montados no Instagram. Faça parcerias com maternidades, pediatras e lojas de bebê. Ofereça primeira semana grátis. Distribua panfletos em cursos de gestante. Anuncie em grupos de mães no Facebook.",
      crescimento: "Aumente estoque (atenda 10-20 famílias simultaneamente). Ofereça itens premium (berços de luxo, carrinhos importados). Crie serviço de consultoria (ajude mãe a escolher produtos). Expanda para aluguel de brinquedos educativos. Monte loja física.",
      automacaoIA: "Use LASY para gerenciar reservas e disponibilidade de itens. Configure lembretes de entrega e recolhimento. Crie sistema de controle de higienização. Gere contratos automáticos. Automatize cobrança mensal e renovação de aluguel."
    }
  },
  {
    id: 21,
    nome: "Acompanhamento e organização de mudanças",
    categoria: "Serviços",
    potencial: "Médio",
    conteudo: {
      oQueE: "Serviço de acompanhamento profissional de mudanças residenciais: você organiza, embala, supervisiona transporte e desembala na nova casa. Ideal para pessoas sem tempo ou que querem evitar estresse.",
      quantoPrecisa: "R$ 500 a R$ 1.500 (materiais de embalagem, transporte próprio ou parceria)",
      oQueComprar: [
        "Caixas de papelão variadas, fita adesiva larga",
        "Plástico bolha, papel pardo, etiquetas",
        "Carrinhos de carga, cordas, lonas",
        "Ferramentas básicas (chave de fenda, alicate)",
        "Carro, van ou parceria com transportadora"
      ],
      comoExecutar: [
        "Faça visita prévia para avaliar volume e complexidade",
        "Organize embalagem por cômodo (etiquete tudo)",
        "Embale itens frágeis com cuidado especial",
        "Supervisione carregamento e transporte",
        "Desembale e organize na nova casa conforme orientação do cliente"
      ],
      comoPrecificar: "Mudança pequena (1-2 cômodos): R$ 400-700. Média (3-4 cômodos): R$ 800-1.200. Grande (casa completa): R$ 1.500-2.500. Margem: 50-60% (inclui materiais e mão de obra).",
      comoDivulgar: "Poste fotos de antes e depois (casa organizada) no Instagram. Faça parcerias com imobiliárias e corretores. Ofereça primeira mudança com desconto. Distribua cartões em condomínios. Anuncie em grupos de bairro e classificados online.",
      crescimento: "Contrate ajudantes e compre van própria. Ofereça serviços extras (limpeza pós-mudança, montagem de móveis, descarte de entulho). Crie pacotes corporativos (mudança de escritórios). Expanda para organização de ambientes (personal organizer).",
      automacaoIA: "Use LASY para automatizar orçamentos via WhatsApp com base em metragem e cômodos. Configure checklist de itens para embalar. Crie lembretes de agendamento e confirmação. Gere contratos automáticos. Automatize feedback pós-mudança."
    }
  },
  {
    id: 22,
    nome: "Canecas e capas personalizadas extra",
    categoria: "Artesanal",
    potencial: "Alto",
    conteudo: {
      oQueE: "Personalização de canecas, capas de celular, almofadas, camisetas e outros itens com fotos, frases e designs exclusivos. Venda para presentes, eventos e uso pessoal.",
      quantoPrecisa: "R$ 1.500 a R$ 4.000 (prensa térmica, impressora sublimática, materiais)",
      oQueComprar: [
        "Prensa térmica 8 em 1 (canecas, camisetas, bonés, pratos)",
        "Impressora sublimática + tintas",
        "Canecas brancas, capas de celular, almofadas",
        "Papel transfer, papel sublimático",
        "Computador para criar artes"
      ],
      comoExecutar: [
        "Cliente envia foto/frase ou escolhe design pronto",
        "Crie arte no computador (Photoshop, Canva, CorelDraw)",
        "Imprima em papel sublimático ou transfer",
        "Transfira para o produto usando prensa térmica (180°C, 60-120s)",
        "Embale com capricho e entregue"
      ],
      comoPrecificar: "Custo por caneca: R$ 8-12. Venda: R$ 30-45. Capa de celular: custo R$ 5-8, venda R$ 25-40. Almofada: custo R$ 15-20, venda R$ 50-80. Margem: 150-250%.",
      comoDivulgar: "Poste fotos dos produtos personalizados no Instagram. Ofereça personalização grátis na primeira compra. Venda em feiras, eventos e datas comemorativas. Faça parcerias com papelarias e lojas de presente. Crie catálogo digital para WhatsApp.",
      crescimento: "Aumente variedade (copos, garrafinhas, mousepad, quebra-cabeça). Ofereça serviço para empresas (brindes corporativos). Contrate designer e operador. Monte loja física ou quiosque. Crie loja online e venda nacional.",
      automacaoIA: "Use LASY para receber pedidos com upload de foto via WhatsApp. Configure catálogo de designs prontos. Crie sistema de aprovação de arte antes da produção. Gere lembretes de produção e entrega. Automatize confirmação de pedido pronto."
    }
  },
  {
    id: 23,
    nome: "Sucos naturais em garrafa (1,5L e 2L)",
    categoria: "Alimentício",
    potencial: "Médio",
    conteudo: {
      oQueE: "Produção e venda de sucos naturais de frutas em garrafas grandes (1,5L e 2L) para consumo familiar. Foco em sabor, qualidade e preço acessível. Sem conservantes.",
      quantoPrecisa: "R$ 600 a R$ 1.500 (frutas, garrafas, liquidificador industrial, geladeira)",
      oQueComprar: [
        "Frutas variadas (laranja, limão, maracujá, abacaxi, morango)",
        "Garrafas PET transparentes (1,5L, 2L) com tampa",
        "Liquidificador industrial ou processador",
        "Coador, funil, medidor",
        "Geladeira para armazenar"
      ],
      comoExecutar: [
        "Compre frutas frescas em atacados ou CEASA",
        "Higienize e prepare frutas (descasque, corte, retire sementes)",
        "Bata no liquidificador com água filtrada (proporção 1:2 ou 1:3)",
        "Coe, adoce levemente (opcional) e envase em garrafas limpas",
        "Rotule com sabor, data e validade (3-5 dias refrigerado)"
      ],
      comoPrecificar: "Custo por litro: R$ 3-6. Venda: R$ 12-18 (1,5L), R$ 15-22 (2L). Margem: 100-150%. Ofereça combos (3 garrafas por R$ 40).",
      comoDivulgar: "Poste fotos dos sucos coloridos no Instagram. Ofereça degustação grátis em feiras e eventos. Venda porta a porta no bairro. Faça parcerias com lanchonetes e restaurantes. Distribua panfletos em academias e escolas.",
      crescimento: "Crie linha de sucos detox e funcionais (com gengibre, chia, açaí). Ofereça assinatura semanal (entrega 2x/semana). Venda para empresas (refeitórios). Contrate produção. Monte pequena fábrica. Expanda para venda em supermercados.",
      automacaoIA: "Use LASY para gerenciar pedidos e assinaturas via WhatsApp. Configure cardápio semanal com frutas da estação. Crie lembretes de produção e validade. Gere receitas e benefícios de cada suco. Automatize cobrança de assinantes."
    }
  },
  {
    id: 24,
    nome: "Abatedor de aves para venda fresca",
    categoria: "Alimentício",
    potencial: "Médio",
    conteudo: {
      oQueE: "Abate e venda de aves frescas (frango, galinha caipira, pato) para consumo imediato. Cliente compra ave viva ou encomenda abatida. Produto fresco, sem conservantes, direto do produtor.",
      quantoPrecisa: "R$ 2.000 a R$ 5.000 (aves, estrutura de abate, freezer, equipamentos)",
      oQueComprar: [
        "Aves vivas (compre de granjas ou crie você mesmo)",
        "Estrutura para abate (mesa, facas, água corrente)",
        "Freezer para armazenar aves abatidas",
        "Embalagens a vácuo ou sacos plásticos",
        "Equipamentos de higiene e segurança"
      ],
      comoExecutar: [
        "Compre aves vivas de granjas confiáveis ou crie em casa",
        "Realize abate humanitário seguindo normas sanitárias",
        "Limpe, depenhe e prepare ave completa",
        "Embale a vácuo ou em saco plástico limpo",
        "Venda fresca (mesmo dia) ou congele para venda posterior"
      ],
      comoPrecificar: "Custo por ave: R$ 15-25. Venda: R$ 35-55 (frango), R$ 50-80 (galinha caipira). Margem: 80-120%. Ofereça descontos para compras acima de 5 aves.",
      comoDivulgar: "Divulgue em grupos de bairro e WhatsApp. Ofereça entrega grátis acima de 3 aves. Faça parcerias com feiras livres e mercados locais. Distribua panfletos em bairros. Venda em datas comemorativas (Natal, festas juninas).",
      crescimento: "Crie própria granja (produza 100-500 aves/mês). Ofereça aves temperadas e marinadas. Venda para restaurantes e churrascarias. Contrate abatedor. Monte pequeno frigorífico. Expanda para venda de ovos caipiras.",
      automacaoIA: "Use LASY para receber encomendas via WhatsApp com data de abate desejada. Configure sistema de controle de estoque de aves vivas. Crie lembretes de abate e entrega. Gere receitas e dicas de preparo. Automatize confirmação de pedido pronto."
    }
  },
  {
    id: 25,
    nome: "Hambúrguer artesanal delivery",
    categoria: "Delivery",
    potencial: "Alto",
    conteudo: {
      oQueE: "Produção e entrega de hambúrgueres artesanais gourmet com ingredientes premium, pão caseiro e molhos especiais. Foco em qualidade superior e experiência gastronômica.",
      quantoPrecisa: "R$ 1.000 a R$ 3.000 (ingredientes, chapa, embalagens, moto)",
      oQueComprar: [
        "Carne moída de qualidade (acém, costela, patinho)",
        "Pães de hambúrguer artesanais ou faça você mesmo",
        "Queijos especiais (cheddar, gorgonzola, brie)",
        "Ingredientes premium (bacon, cebola caramelizada, rúcula)",
        "Chapa elétrica ou a gás, embalagens térmicas"
      ],
      comoExecutar: [
        "Prepare hambúrgueres artesanais (180-200g, tempero especial)",
        "Faça ou compre pães de qualidade",
        "Prepare molhos especiais (maionese temperada, barbecue caseiro)",
        "Monte hambúrguer na hora do pedido (pão, carne, queijo, ingredientes)",
        "Embale em caixa térmica e entregue em até 40min"
      ],
      comoPrecificar: "Custo por hambúrguer: R$ 12-18. Venda: R$ 35-55 (clássico), R$ 45-70 (premium). Combos (hambúrguer + fritas + refri): R$ 50-80. Margem: 100-150%.",
      comoDivulgar: "Invista em fotos profissionais dos hambúrgueres no Instagram. Ofereça degustação grátis para influenciadores locais. Cadastre em apps de delivery. Faça promoções de lançamento. Distribua panfletos no bairro. Crie grupo VIP no WhatsApp.",
      crescimento: "Aumente cardápio (hambúrgueres especiais, vegetarianos, fritas artesanais). Contrate chapeiro e entregador. Monte cozinha profissional. Abra ponto físico (hamburgeria). Crie franquia. Expanda para múltiplos bairros.",
      automacaoIA: "Use LASY para automatizar pedidos via WhatsApp com cardápio interativo. Configure sistema de rastreamento de entrega. Crie combos automáticos (sugestões baseadas em pedido). Gere promoções em horários específicos. Automatize feedback pós-entrega."
    }
  },
  {
    id: 26,
    nome: "Espetinho gourmet delivery",
    categoria: "Bônus",
    potencial: "Alto",
    bonus: true,
    conteudo: {
      oQueE: "Produção e entrega de espetinhos gourmet (carne, frango, linguiça, queijo coalho) com tempero especial e acompanhamentos. Ideal para finais de semana e eventos em casa.",
      quantoPrecisa: "R$ 800 a R$ 2.000 (carnes, espetos, churrasqueira, embalagens)",
      oQueComprar: [
        "Carnes variadas (picanha, frango, linguiça, coração)",
        "Queijo coalho, legumes (tomate, pimentão, cebola)",
        "Espetos de madeira ou inox",
        "Churrasqueira ou grelha, carvão",
        "Embalagens térmicas, molhos especiais"
      ],
      comoExecutar: [
        "Prepare espetos com carnes de qualidade e tempero especial",
        "Asse na churrasqueira ou grelha (ponto perfeito)",
        "Embale em caixa térmica com molhos e farofa",
        "Entregue quente em até 40min",
        "Ofereça combos (10, 20, 30 espetinhos)"
      ],
      comoPrecificar: "Custo por espeto: R$ 2-4. Venda: R$ 8-12 cada. Combo 10 espetos: R$ 70-100. Combo 20 espetos: R$ 130-180. Margem: 100-150%.",
      comoDivulgar: "Poste fotos e vídeos dos espetos sendo preparados no Instagram. Ofereça degustação grátis no primeiro final de semana. Venda em eventos e praças. Crie grupo de pedidos no WhatsApp. Faça promoções em dias de jogos.",
      crescimento: "Aumente variedade (espetos premium, vegetarianos, frutos do mar). Contrate churrasqueiro e entregador. Monte ponto fixo (trailer, container). Ofereça serviço de churrasqueiro a domicílio. Expanda para catering de eventos.",
      automacaoIA: "Use LASY para receber pedidos via WhatsApp com opções de espetos e combos. Configure sistema de agendamento (cliente escolhe horário de entrega). Crie lembretes de produção. Gere promoções automáticas em finais de semana. Automatize confirmação de pedido pronto."
    }
  },
  {
    id: 27,
    nome: "10 Receitas de trufas zero açúcar",
    categoria: "Bônus",
    potencial: "Médio",
    bonus: true,
    conteudo: {
      oQueE: "Produção e venda de trufas gourmet zero açúcar (adoçadas com stévia, xilitol ou eritritol) para público fitness, diabéticos e pessoas que buscam alimentação saudável.",
      quantoPrecisa: "R$ 400 a R$ 1.000 (chocolate zero açúcar, adoçantes, ingredientes, embalagens)",
      oQueComprar: [
        "Chocolate meio amargo zero açúcar (70% cacau)",
        "Adoçantes naturais (stévia, xilitol, eritritol)",
        "Creme de leite, leite condensado zero açúcar",
        "Recheios (pasta de amendoim, coco, café)",
        "Forminhas, embalagens, etiquetas"
      ],
      comoExecutar: [
        "Desenvolva 10 receitas variadas (tradicional, café, coco, maracujá, limão, etc.)",
        "Prepare trufas com ingredientes zero açúcar de qualidade",
        "Modele em bolinhas uniformes e passe no chocolate ou cacau",
        "Embale em forminhas e caixas bonitas",
        "Venda sob encomenda ou pronta entrega (validade 7-10 dias refrigerado)"
      ],
      comoPrecificar: "Custo por trufa: R$ 1,50-2,50. Venda: R$ 5-8 cada. Caixa com 6 trufas: R$ 30-45. Caixa com 12 trufas: R$ 55-80. Margem: 100-150%.",
      comoDivulgar: "Poste fotos das trufas no Instagram com foco em 'zero açúcar' e 'saudável'. Ofereça degustação em academias e nutricionistas. Faça parcerias com personal trainers. Venda em lojas de produtos naturais. Crie catálogo digital para WhatsApp.",
      crescimento: "Crie linha completa de doces zero açúcar (brownies, cookies, bolos). Ofereça assinatura mensal (caixa surpresa). Venda para diabéticos e celíacos. Contrate confeiteira. Monte ateliê profissional. Crie curso online de doces saudáveis.",
      automacaoIA: "Use LASY para criar cardápio digital com as 10 receitas e informações nutricionais. Configure sistema de encomendas com data de entrega. Crie lembretes de produção e validade. Gere conteúdo educativo sobre alimentação saudável. Automatize mensagens de agradecimento pós-venda."
    }
  }
]

export default function Home() {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | "Todas">("Todas")
  const [potencialFiltro, setPotencialFiltro] = useState<PotencialVenda | "Todos">("Todos")
  const [produtoExpandido, setProdutoExpandido] = useState<number | null>(null)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Se Supabase não está configurado, permitir acesso direto
      if (!supabase) {
        setIsAuthenticated(true)
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Verificar se tem acesso pago
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_paid')
          .eq('id', user.id)
          .single()

        if (profileData?.is_paid) {
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Em caso de erro, permitir acesso
      setIsAuthenticated(true)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar produtos
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(produto => {
      const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = categoriaFiltro === "Todas" || produto.categoria === categoriaFiltro
      const matchPotencial = potencialFiltro === "Todos" || produto.potencial === potencialFiltro
      return matchBusca && matchCategoria && matchPotencial
    })
  }, [busca, categoriaFiltro, potencialFiltro])

  // Obter categorias únicas
  const categorias: Categoria[] = Array.from(new Set(produtos.map(p => p.categoria)))

  // Cores de badge por potencial
  const corPotencial = (potencial: PotencialVenda) => {
    switch (potencial) {
      case "Alto": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Médio": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "Baixo": return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const handleTelegramClick = () => {
    window.open('https://t.me/+AyKbYv2fR085ZmE5', '_blank', 'noopener,noreferrer')
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

  // Se não está autenticado, mostrar tela de bloqueio
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
            <Lock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-100 mb-3">
              Conteúdo Protegido
            </h1>
            <p className="text-gray-400 mb-6">
              Este conteúdo é exclusivo para clientes que compraram o Manual Local.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/cadastro')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
              >
                Criar Conta
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 text-gray-300 font-semibold py-3 rounded-xl transition-colors"
              >
                Já tenho conta
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-6">
            🔒 Apenas clientes com compra aprovada têm acesso
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#111111] sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Manual Local
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl text-sm text-gray-300 transition-colors"
            >
              Minha Conta
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm md:text-base">
            25 Formas de Ganhar Dinheiro + Produtos Bônus
          </p>
          
          {/* Botão Telegram */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleTelegramClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              Acesse a Comunidade do Telegram
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-2">
            Se não conseguir entrar na comunidade através do botão, copie esse link: https://t.me/+AyKbYv2fR085ZmE5
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Barra de busca e filtros */}
        <div className="mb-8 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Botão de filtros (mobile) */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="md:hidden w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-gray-300 hover:border-orange-500/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </span>
            {mostrarFiltros ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {/* Filtros */}
          <div className={`${mostrarFiltros ? 'block' : 'hidden'} md:block space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4`}>
            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Categoria</label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value as Categoria | "Todas")}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
              >
                <option value="Todas">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Potencial */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Potencial de Venda</label>
              <select
                value={potencialFiltro}
                onChange={(e) => setPotencialFiltro(e.target.value as PotencialVenda | "Todos")}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
              >
                <option value="Todos">Todos os potenciais</option>
                <option value="Alto">Alto</option>
                <option value="Médio">Médio</option>
                <option value="Baixo">Baixo</option>
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="text-center text-sm text-gray-500">
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </div>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map(produto => (
            <div
              key={produto.id}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-100 leading-tight">
                    {produto.nome}
                  </h3>
                  {produto.bonus && (
                    <span className="shrink-0 px-2 py-1 text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full">
                      BÔNUS
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                    {produto.categoria}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium border rounded-full ${corPotencial(produto.potencial)}`}>
                    {produto.potencial}
                  </span>
                </div>
              </div>

              {/* Botão expandir */}
              <button
                onClick={() => setProdutoExpandido(produtoExpandido === produto.id ? null : produto.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-gray-300 hover:text-orange-400 transition-colors"
              >
                <span className="text-sm font-medium">
                  {produtoExpandido === produto.id ? 'Ocultar detalhes' : 'Ver detalhes completos'}
                </span>
                {produtoExpandido === produto.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {/* Conteúdo expandido */}
              {produtoExpandido === produto.id && (
                <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {/* O que é */}
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                      O que é esse negócio
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{produto.conteudo.oQueE}</p>
                  </div>

                  {/* Quanto precisa */}
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      Quanto precisa para começar
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{produto.conteudo.quantoPrecisa}</p>
                  </div>

                  {/* O que comprar */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      O que comprar para começar
                    </h4>
                    <ul className="space-y-1.5">
                      {produto.conteudo.oQueComprar.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Como executar */}
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      Como executar na prática
                    </h4>
                    <ol className="space-y-1.5">
                      {produto.conteudo.comoExecutar.map((passo, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400 font-medium shrink-0">{idx + 1}.</span>
                          <span>{passo}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Como precificar */}
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                      Como precificar e vender
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{produto.conteudo.comoPrecificar}</p>
                  </div>

                  {/* Como divulgar */}
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      Como divulgar do jeito certo
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{produto.conteudo.comoDivulgar}</p>
                  </div>

                  {/* Crescimento */}
                  <div>
                    <h4 className="text-sm font-semibold text-pink-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                      Crescimento e escala
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{produto.conteudo.crescimento}</p>
                  </div>

                  {/* Automação com IA */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                      Automação com IA (LASY)
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{produto.conteudo.automacaoIA}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {produtosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <X className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#111111] mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">
            Manual Local - Todos os direitos reservados © 2024
          </p>
          <p className="text-gray-600 text-xs mt-2">
            27 produtos completos com estratégias práticas de execução
          </p>
        </div>
      </footer>
    </div>
  )
}
