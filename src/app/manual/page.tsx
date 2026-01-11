"use client";

import { useState } from "react";
import { CheckCircle, ArrowLeft, Lock, TrendingUp, DollarSign, Users, Clock, Crosshair, Zap, Star, BookOpen, Download, Play, Send } from "lucide-react";
import Link from "next/link";

export default function ManualPage() {
  const [expandedBusiness, setExpandedBusiness] = useState<number | null>(null);

  const businesses = [
    {
      id: 1,
      name: "Marmitas Fit",
      profit: "R$ 3.000 - R$ 8.000/mês",
      difficulty: "Fácil",
      investment: "R$ 200 - R$ 500",
      time: "2-3 horas/dia",
      description: "Prepare refeições saudáveis e venda para pessoas que querem emagrecer ou ganhar massa muscular.",
      howToStart: [
        "Defina seu cardápio (3-5 opções de marmitas)",
        "Calcule custos e defina preços (margem de 60-70%)",
        "Crie perfil no Instagram com fotos das marmitas",
        "Ofereça para amigos e vizinhos primeiro",
        "Use grupos de WhatsApp do bairro para divulgar"
      ],
      tips: [
        "Comece pequeno: 5-10 marmitas por dia",
        "Foque em um nicho: fit, vegano, low carb",
        "Entregue no mesmo dia para garantir frescor",
        "Peça depoimentos e fotos dos clientes"
      ]
    },
    {
      id: 2,
      name: "Lavagem de Carros a Seco",
      profit: "R$ 2.500 - R$ 6.000/mês",
      difficulty: "Fácil",
      investment: "R$ 150 - R$ 300",
      time: "3-4 horas/dia",
      description: "Lave carros sem usar água, direto na casa ou trabalho do cliente.",
      howToStart: [
        "Compre kit de lavagem a seco (produtos + panos)",
        "Pratique no seu carro ou de amigos",
        "Defina preços: R$ 50-80 por lavagem completa",
        "Ofereça para vizinhos e colegas de trabalho",
        "Crie pacotes mensais (4 lavagens por mês)"
      ],
      tips: [
        "Atenda em condomínios e empresas",
        "Ofereça desconto para clientes recorrentes",
        "Trabalhe por agendamento para otimizar rotas",
        "Invista em produtos de qualidade"
      ]
    },
    {
      id: 3,
      name: "Personal Organizer",
      profit: "R$ 4.000 - R$ 10.000/mês",
      difficulty: "Médio",
      investment: "R$ 100 - R$ 200",
      time: "4-6 horas/dia",
      description: "Organize armários, closets e ambientes de casas e escritórios.",
      howToStart: [
        "Estude métodos de organização (Marie Kondo, etc)",
        "Organize sua própria casa e tire fotos",
        "Ofereça serviço gratuito para 2-3 pessoas em troca de depoimento",
        "Crie portfólio com antes e depois",
        "Divulgue em grupos de decoração e organização"
      ],
      tips: [
        "Cobre por projeto, não por hora",
        "Venda produtos organizadores como extra",
        "Especialize-se em um tipo: closets, cozinhas, etc",
        "Faça parcerias com arquitetos e designers"
      ]
    },
    {
      id: 4,
      name: "Aulas Particulares",
      profit: "R$ 3.500 - R$ 9.000/mês",
      difficulty: "Fácil",
      investment: "R$ 0 - R$ 100",
      time: "3-5 horas/dia",
      description: "Ensine matérias escolares, idiomas ou habilidades específicas.",
      howToStart: [
        "Escolha sua especialidade (matemática, inglês, etc)",
        "Defina preço por hora: R$ 40-80",
        "Ofereça primeira aula grátis ou com desconto",
        "Divulgue em escolas, grupos de pais e redes sociais",
        "Crie material didático próprio"
      ],
      tips: [
        "Atenda online para ampliar alcance",
        "Crie pacotes mensais (8-12 aulas)",
        "Especialize-se em preparação para vestibular/ENEM",
        "Peça indicações aos pais satisfeitos"
      ]
    },
    {
      id: 5,
      name: "Cuidador de Pets",
      profit: "R$ 2.000 - R$ 5.000/mês",
      difficulty: "Fácil",
      investment: "R$ 50 - R$ 150",
      time: "2-4 horas/dia",
      description: "Cuide de animais de estimação enquanto os donos trabalham ou viajam.",
      howToStart: [
        "Defina serviços: passeio, hospedagem, day care",
        "Prepare sua casa para receber pets (se for hospedar)",
        "Crie perfil em apps como DogHero e PetLove",
        "Ofereça serviço para vizinhos primeiro",
        "Tire fotos e vídeos dos pets para enviar aos donos"
      ],
      tips: [
        "Comece com passeios (menor investimento)",
        "Especialize-se em um tipo de pet",
        "Cobre por dia ou por serviço",
        "Tenha seguro para pets sob seus cuidados"
      ]
    },
    {
      id: 6,
      name: "Jardinagem e Paisagismo",
      profit: "R$ 3.000 - R$ 7.500/mês",
      difficulty: "Médio",
      investment: "R$ 300 - R$ 800",
      time: "4-6 horas/dia",
      description: "Cuide de jardins, plantas e crie projetos de paisagismo.",
      howToStart: [
        "Compre ferramentas básicas (tesoura, enxada, mangueira)",
        "Aprenda sobre plantas da sua região",
        "Ofereça manutenção mensal de jardins",
        "Tire fotos do antes e depois",
        "Divulgue em condomínios e bairros residenciais"
      ],
      tips: [
        "Cobre mensalidade fixa por jardim",
        "Venda plantas e produtos como extra",
        "Especialize-se em jardins verticais ou hortas",
        "Faça parcerias com lojas de jardinagem"
      ]
    },
    {
      id: 7,
      name: "Confeitaria Artesanal",
      profit: "R$ 4.500 - R$ 12.000/mês",
      difficulty: "Médio",
      investment: "R$ 200 - R$ 600",
      time: "3-5 horas/dia",
      description: "Faça bolos, doces e sobremesas personalizadas para festas e eventos.",
      howToStart: [
        "Escolha sua especialidade (bolos, doces finos, cupcakes)",
        "Pratique receitas até dominar",
        "Calcule custos e defina preços com margem de 70-80%",
        "Crie portfólio com fotos profissionais",
        "Divulgue em grupos de festas e eventos"
      ],
      tips: [
        "Comece com encomendas sob demanda",
        "Especialize-se em um nicho (bolos decorados, doces veganos)",
        "Trabalhe com antecedência (encomendas com 7 dias)",
        "Invista em embalagens bonitas"
      ]
    },
    {
      id: 8,
      name: "Manutenção Residencial",
      profit: "R$ 3.500 - R$ 8.500/mês",
      difficulty: "Médio",
      investment: "R$ 400 - R$ 1.000",
      time: "4-6 horas/dia",
      description: "Faça pequenos reparos em casas: elétrica, hidráulica, pintura, etc.",
      howToStart: [
        "Liste suas habilidades (elétrica, hidráulica, marcenaria)",
        "Compre ferramentas básicas",
        "Ofereça serviços para vizinhos e familiares",
        "Crie lista de preços por serviço",
        "Divulgue em grupos de condomínios"
      ],
      tips: [
        "Cobre por serviço ou por hora (R$ 50-80/hora)",
        "Tenha fornecedores de materiais com desconto",
        "Especialize-se em um tipo de manutenção",
        "Ofereça pacotes de manutenção preventiva"
      ]
    },
    {
      id: 9,
      name: "Estética Domiciliar",
      profit: "R$ 5.000 - R$ 15.000/mês",
      difficulty: "Médio",
      investment: "R$ 500 - R$ 1.500",
      time: "4-6 horas/dia",
      description: "Ofereça serviços de manicure, pedicure, design de sobrancelhas na casa do cliente.",
      howToStart: [
        "Faça curso básico de manicure/estética",
        "Compre kit profissional de ferramentas",
        "Defina preços competitivos",
        "Ofereça para amigas e vizinhas primeiro",
        "Crie agenda online para agendamentos"
      ],
      tips: [
        "Atenda em domicílio para cobrar mais",
        "Venda produtos de beleza como extra",
        "Crie pacotes mensais (4 atendimentos)",
        "Especialize-se em técnicas específicas (alongamento, blindagem)"
      ]
    },
    {
      id: 10,
      name: "Delivery de Produtos Locais",
      profit: "R$ 2.500 - R$ 6.500/mês",
      difficulty: "Fácil",
      investment: "R$ 100 - R$ 300",
      time: "3-5 horas/dia",
      description: "Entregue produtos de mercados, farmácias e lojas locais.",
      howToStart: [
        "Faça parceria com 3-5 estabelecimentos locais",
        "Defina área de entrega (seu bairro)",
        "Crie sistema de pedidos (WhatsApp ou app simples)",
        "Defina taxa de entrega: R$ 5-10",
        "Divulgue em grupos do bairro"
      ],
      tips: [
        "Comece com bicicleta ou moto",
        "Atenda em horários de pico (almoço e jantar)",
        "Ofereça entrega rápida (30-45 minutos)",
        "Crie programa de fidelidade"
      ]
    },
    {
      id: 11,
      name: "Consultoria Financeira",
      profit: "R$ 6.000 - R$ 18.000/mês",
      difficulty: "Difícil",
      investment: "R$ 200 - R$ 500",
      time: "4-6 horas/dia",
      description: "Ajude pessoas a organizar finanças, sair de dívidas e investir.",
      howToStart: [
        "Estude educação financeira (livros, cursos online)",
        "Organize suas próprias finanças como case",
        "Ofereça consultoria gratuita para 3-5 pessoas",
        "Crie método próprio de organização financeira",
        "Divulgue resultados e depoimentos"
      ],
      tips: [
        "Cobre por sessão ou pacote mensal",
        "Especialize-se em um público (empreendedores, assalariados)",
        "Crie planilhas e ferramentas personalizadas",
        "Faça parcerias com contadores"
      ]
    },
    {
      id: 12,
      name: "Fotografia de Eventos",
      profit: "R$ 4.000 - R$ 11.000/mês",
      difficulty: "Médio",
      investment: "R$ 1.500 - R$ 4.000",
      time: "Variável (finais de semana)",
      description: "Fotografe festas, casamentos, formaturas e eventos corporativos.",
      howToStart: [
        "Invista em câmera semi-profissional",
        "Pratique fotografia (cursos online gratuitos)",
        "Ofereça serviço gratuito para 2-3 eventos",
        "Crie portfólio online",
        "Divulgue em grupos de eventos e festas"
      ],
      tips: [
        "Cobre por evento, não por hora",
        "Ofereça pacotes com edição e álbum",
        "Especialize-se em um tipo de evento",
        "Tenha backup de equipamentos"
      ]
    },
    {
      id: 13,
      name: "Serviços de Limpeza",
      profit: "R$ 3.000 - R$ 7.000/mês",
      difficulty: "Fácil",
      investment: "R$ 150 - R$ 400",
      time: "4-6 horas/dia",
      description: "Ofereça limpeza residencial ou comercial profissional.",
      howToStart: [
        "Compre produtos e equipamentos de limpeza",
        "Defina tipos de limpeza (diária, semanal, pós-obra)",
        "Calcule preços por m² ou por serviço",
        "Ofereça para vizinhos e conhecidos",
        "Crie checklist de limpeza profissional"
      ],
      tips: [
        "Especialize-se em limpeza pós-obra (paga mais)",
        "Monte equipe para atender mais clientes",
        "Ofereça contratos mensais",
        "Invista em produtos ecológicos (diferencial)"
      ]
    },
    {
      id: 14,
      name: "Personal Trainer",
      profit: "R$ 5.500 - R$ 16.000/mês",
      difficulty: "Médio",
      investment: "R$ 500 - R$ 2.000",
      time: "4-6 horas/dia",
      description: "Treine pessoas em casa, parques ou academias.",
      howToStart: [
        "Faça curso de personal trainer (CREF obrigatório)",
        "Defina sua especialidade (emagrecimento, hipertrofia)",
        "Crie treinos personalizados",
        "Ofereça avaliação física gratuita",
        "Divulgue em academias e grupos fitness"
      ],
      tips: [
        "Atenda em domicílio para cobrar mais",
        "Crie treinos online para escalar",
        "Ofereça pacotes mensais (12-16 sessões)",
        "Especialize-se em um público (idosos, gestantes)"
      ]
    },
    {
      id: 15,
      name: "Costura e Ajustes",
      profit: "R$ 2.000 - R$ 5.500/mês",
      difficulty: "Fácil",
      investment: "R$ 300 - R$ 800",
      time: "3-5 horas/dia",
      description: "Faça ajustes em roupas, consertos e customizações.",
      howToStart: [
        "Compre máquina de costura básica",
        "Pratique ajustes simples (barra, cintura)",
        "Defina tabela de preços por serviço",
        "Ofereça para vizinhos e lojas de roupas",
        "Divulgue em grupos de moda e brechós"
      ],
      tips: [
        "Especialize-se em roupas de festa (paga mais)",
        "Faça parcerias com lojas de noivas",
        "Ofereça serviço de customização",
        "Atenda por agendamento"
      ]
    },
    {
      id: 16,
      name: "Serviços de Pintura",
      profit: "R$ 4.000 - R$ 10.000/mês",
      difficulty: "Médio",
      investment: "R$ 400 - R$ 1.000",
      time: "5-7 horas/dia",
      description: "Pinte casas, apartamentos e estabelecimentos comerciais.",
      howToStart: [
        "Compre ferramentas básicas (rolos, pincéis, lonas)",
        "Pratique técnicas de pintura",
        "Calcule preços por m² (R$ 15-30/m²)",
        "Ofereça orçamento gratuito",
        "Divulgue em grupos de construção e reforma"
      ],
      tips: [
        "Especialize-se em técnicas decorativas",
        "Tenha fornecedores de tinta com desconto",
        "Ofereça garantia do serviço",
        "Monte equipe para obras maiores"
      ]
    },
    {
      id: 17,
      name: "Buffet Caseiro",
      profit: "R$ 5.000 - R$ 14.000/mês",
      difficulty: "Médio",
      investment: "R$ 500 - R$ 1.500",
      time: "Variável (finais de semana)",
      description: "Prepare comida para festas e eventos em casa.",
      howToStart: [
        "Defina seu cardápio (salgados, doces, pratos principais)",
        "Calcule custos e defina preços por pessoa",
        "Faça evento teste para amigos/família",
        "Crie portfólio com fotos dos pratos",
        "Divulgue em grupos de festas e eventos"
      ],
      tips: [
        "Comece com eventos pequenos (20-50 pessoas)",
        "Especialize-se em um tipo de evento",
        "Trabalhe com antecedência (15-30 dias)",
        "Tenha ajudantes para eventos maiores"
      ]
    },
    {
      id: 18,
      name: "Aulas de Idiomas",
      profit: "R$ 3.500 - R$ 9.500/mês",
      difficulty: "Fácil",
      investment: "R$ 100 - R$ 300",
      time: "3-5 horas/dia",
      description: "Ensine inglês, espanhol ou outro idioma que você domina.",
      howToStart: [
        "Defina seu método de ensino",
        "Crie material didático próprio",
        "Ofereça aula experimental gratuita",
        "Defina preços: R$ 50-100/hora",
        "Divulgue em escolas e grupos de estudos"
      ],
      tips: [
        "Atenda online para ampliar alcance",
        "Especialize-se em conversação ou business",
        "Crie pacotes mensais (8-12 aulas)",
        "Ofereça preparação para exames de proficiência"
      ]
    },
    {
      id: 19,
      name: "Serviços de TI",
      profit: "R$ 6.500 - R$ 20.000/mês",
      difficulty: "Difícil",
      investment: "R$ 200 - R$ 500",
      time: "4-6 horas/dia",
      description: "Ofereça suporte técnico, manutenção de computadores e redes.",
      howToStart: [
        "Liste suas habilidades técnicas",
        "Defina serviços (formatação, instalação, redes)",
        "Crie tabela de preços por serviço",
        "Ofereça para vizinhos e pequenas empresas",
        "Divulgue em grupos de tecnologia"
      ],
      tips: [
        "Atenda empresas (contratos mensais)",
        "Especialize-se em um nicho (segurança, cloud)",
        "Ofereça suporte remoto",
        "Tenha fornecedores de peças com desconto"
      ]
    },
    {
      id: 20,
      name: "Artesanato Personalizado",
      profit: "R$ 2.500 - R$ 7.000/mês",
      difficulty: "Médio",
      investment: "R$ 200 - R$ 600",
      time: "3-5 horas/dia",
      description: "Crie produtos artesanais personalizados (lembrancinhas, decoração).",
      howToStart: [
        "Escolha seu nicho (lembrancinhas, decoração, presentes)",
        "Aprenda técnicas (cursos online gratuitos)",
        "Crie produtos de amostra",
        "Tire fotos profissionais",
        "Venda em feiras e online"
      ],
      tips: [
        "Especialize-se em um tipo de produto",
        "Trabalhe sob encomenda",
        "Crie kits e combos",
        "Venda em marketplaces (Elo7, Etsy)"
      ]
    },
    {
      id: 21,
      name: "Consultoria de Marketing",
      profit: "R$ 7.000 - R$ 22.000/mês",
      difficulty: "Difícil",
      investment: "R$ 200 - R$ 500",
      time: "4-6 horas/dia",
      description: "Ajude pequenas empresas a crescer com marketing digital.",
      howToStart: [
        "Estude marketing digital (cursos online)",
        "Crie cases próprios (seu perfil ou de amigos)",
        "Defina serviços (redes sociais, anúncios, SEO)",
        "Ofereça consultoria gratuita para 2-3 empresas",
        "Divulgue resultados e depoimentos"
      ],
      tips: [
        "Cobre por projeto ou mensalidade",
        "Especialize-se em um nicho de mercado",
        "Mostre resultados com números",
        "Crie pacotes de serviços"
      ]
    },
    {
      id: 22,
      name: "Serviços de Barbeiro",
      profit: "R$ 4.500 - R$ 12.000/mês",
      difficulty: "Médio",
      investment: "R$ 800 - R$ 2.500",
      time: "4-6 horas/dia",
      description: "Corte cabelo e faça barba em domicílio ou barbearia própria.",
      howToStart: [
        "Faça curso de barbeiro",
        "Compre kit profissional de ferramentas",
        "Pratique com amigos e familiares",
        "Defina preços competitivos",
        "Divulgue em grupos do bairro"
      ],
      tips: [
        "Atenda em domicílio para começar",
        "Crie agenda online",
        "Ofereça pacotes mensais",
        "Especialize-se em estilos específicos"
      ]
    },
    {
      id: 23,
      name: "Aluguel de Equipamentos",
      profit: "R$ 3.000 - R$ 8.000/mês",
      difficulty: "Médio",
      investment: "R$ 1.000 - R$ 5.000",
      time: "2-4 horas/dia",
      description: "Alugue ferramentas, equipamentos de festa ou esportivos.",
      howToStart: [
        "Escolha nicho (festas, construção, esportes)",
        "Compre equipamentos de qualidade",
        "Defina preços de aluguel (diária/semanal)",
        "Crie contrato de locação",
        "Divulgue em grupos específicos"
      ],
      tips: [
        "Comece com poucos itens de alta demanda",
        "Tenha seguro dos equipamentos",
        "Cobre caução",
        "Ofereça entrega e retirada"
      ]
    },
    {
      id: 24,
      name: "Serviços de Eletricista",
      profit: "R$ 4.000 - R$ 11.000/mês",
      difficulty: "Médio",
      investment: "R$ 500 - R$ 1.500",
      time: "4-6 horas/dia",
      description: "Faça instalações e manutenções elétricas residenciais e comerciais.",
      howToStart: [
        "Faça curso de eletricista (NR10 obrigatório)",
        "Compre ferramentas e equipamentos de segurança",
        "Comece com serviços simples",
        "Defina preços por serviço",
        "Divulgue em grupos de construção"
      ],
      tips: [
        "Especialize-se em automação residencial",
        "Atenda empresas (contratos mensais)",
        "Tenha fornecedores com desconto",
        "Ofereça garantia dos serviços"
      ]
    },
    {
      id: 25,
      name: "Produção de Conteúdo Local",
      profit: "R$ 3.500 - R$ 10.000/mês",
      difficulty: "Médio",
      investment: "R$ 200 - R$ 500",
      time: "3-5 horas/dia",
      description: "Crie conteúdo para redes sociais de empresas locais.",
      howToStart: [
        "Aprenda sobre redes sociais e criação de conteúdo",
        "Crie portfólio com conteúdo próprio",
        "Ofereça serviço gratuito para 2-3 empresas",
        "Defina pacotes de posts mensais",
        "Divulgue para comércios locais"
      ],
      tips: [
        "Especialize-se em um tipo de negócio",
        "Cobre por pacote mensal de posts",
        "Ofereça gestão completa das redes",
        "Mostre resultados com métricas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff6b00] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para página inicial
          </Link>
          
          <div className="inline-block bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-[0_0_20px_rgba(255,107,0,0.6)]">
            🎯 MANUAL COMPLETO
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            25 Formas de Ganhar Dinheiro{" "}
            <span className="text-[#ff6b00] drop-shadow-[0_0_20px_rgba(255,107,0,0.8)]">no Seu Bairro</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Negócios locais validados, testados e prontos para você começar hoje mesmo. Sem teoria, sem enrolação.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <Crosshair className="w-10 h-10 text-[#ff6b00] mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-2">25</div>
            <div className="text-gray-400">Negócios Validados</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <DollarSign className="w-10 h-10 text-[#4ade80] mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-2">R$ 2k-22k</div>
            <div className="text-gray-400">Potencial Mensal</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <Clock className="w-10 h-10 text-[#60a5fa] mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-2">2-7h</div>
            <div className="text-gray-400">Horas por Dia</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <Zap className="w-10 h-10 text-[#fbbf24] mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-2">Hoje</div>
            <div className="text-gray-400">Comece Agora</div>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#ff6b00] rounded-2xl p-8 md:p-12 mb-12 shadow-[0_0_50px_rgba(255,107,0,0.4)]">
          <BookOpen className="w-12 h-12 text-[#ff6b00] mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">Como usar este manual:</h2>
          <div className="space-y-4 text-lg text-gray-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0 mt-1" />
              <p><strong className="text-white">Leia todos os 25 negócios</strong> - cada um tem potencial real de lucro</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0 mt-1" />
              <p><strong className="text-white">Escolha 1 ou 2</strong> que mais combinam com você</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0 mt-1" />
              <p><strong className="text-white">Siga o passo a passo</strong> - está tudo detalhado</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0 mt-1" />
              <p><strong className="text-white">Comece HOJE</strong> - não espere o momento perfeito</p>
            </div>
          </div>
        </div>

        {/* Lista de Negócios */}
        <div className="space-y-6">
          {businesses.map((business) => (
            <div 
              key={business.id}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#ff6b00] transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.6)]"
            >
              {/* Header do Card */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg">
                        {business.id}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{business.name}</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{business.description}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-lg border border-[#2a2a2a]">
                        <DollarSign className="w-5 h-5 text-[#4ade80]" />
                        <span className="text-white font-semibold">{business.profit}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-lg border border-[#2a2a2a]">
                        <Crosshair className="w-5 h-5 text-[#60a5fa]" />
                        <span className="text-white font-semibold">{business.difficulty}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-lg border border-[#2a2a2a]">
                        <TrendingUp className="w-5 h-5 text-[#fbbf24]" />
                        <span className="text-white font-semibold">{business.investment}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-lg border border-[#2a2a2a]">
                        <Clock className="w-5 h-5 text-[#a78bfa]" />
                        <span className="text-white font-semibold">{business.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-[#ff6b00] hover:text-[#ff8533] transition-colors">
                    {expandedBusiness === business.id ? (
                      <div className="text-sm font-semibold">Fechar ▲</div>
                    ) : (
                      <div className="text-sm font-semibold">Ver Detalhes ▼</div>
                    )}
                  </button>
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {expandedBusiness === business.id && (
                <div className="border-t border-[#2a2a2a] p-6 bg-[#0a0a0a]">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Como Começar */}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Play className="w-6 h-6 text-[#ff6b00]" />
                        Como Começar:
                      </h4>
                      <ol className="space-y-3">
                        {business.howToStart.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-300 pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Dicas Importantes */}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="w-6 h-6 text-[#fbbf24]" />
                        Dicas Importantes:
                      </h4>
                      <ul className="space-y-3">
                        {business.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#4ade80] flex-shrink-0 mt-1" />
                            <span className="text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="mt-12 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#ff6b00] rounded-2xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(255,107,0,0.5)]">
          <Send className="w-16 h-16 text-[#ff6b00] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Agora é com você!
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Você tem 25 negócios validados nas suas mãos.<br />
            Escolha um e comece HOJE. O tempo não volta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white text-lg font-bold py-4 px-8 rounded-xl hover:from-[#ff8533] hover:to-[#ffa366] transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(255,107,0,0.7)] inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para Início
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🔒 Conteúdo exclusivo para membros | ✅ Acesso vitalício | 🛡️ Garantia de 7 dias</p>
        </div>
      </div>
    </div>
  );
}
