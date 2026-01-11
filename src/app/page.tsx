"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, TrendingUp, MapPin, DollarSign, AlertTriangle, Zap, Target, Star, Users, Clock, Shield, Award } from "lucide-react";

export default function Home() {
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showOffer, setShowOffer] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos
  const [viewersCount, setViewersCount] = useState(45); // Contador de pessoas acessando (número mais alto)

  useEffect(() => {
    if (showOffer && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOffer, countdown]);

  // Efeito para oscilar o contador de visualizações (tanto pra mais quanto pra menos)
  useEffect(() => {
    const viewersInterval = setInterval(() => {
      setViewersCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // Oscila entre -3 e +3
        const newCount = prev + change;
        // Mantém entre 38 e 65 pessoas (números mais altos)
        return Math.max(38, Math.min(65, newCount));
      });
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(viewersInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const quizQuestions = [
    {
      question: "Como está sua situação financeira agora no início do ano?",
      options: [
        "A) Estou apertado e mal consigo pagar tudo",
        "B) Estou sobrevivendo, mas sem sobrar nada",
        "C) Estou endividado e preocupado",
        "D) Estou bem financeiramente (raro)"
      ],
      feedback: {
        "A": "Você já sente o peso de começar mais um ano sem dinheiro entrando.",
        "B": "Você já sente o peso de começar mais um ano sem dinheiro entrando.",
        "C": "Você já sente o peso de começar mais um ano sem dinheiro entrando.",
        "D": "Mesmo quem está 'bem' pode perder tudo sem um plano sólido."
      }
    },
    {
      question: "O que mais te impede de ganhar mais dinheiro hoje?",
      options: [
        "A) Não sei por onde começar",
        "B) Falta de dinheiro para investir",
        "C) Medo de errar e perder tempo",
        "D) Já tentei várias coisas e nada funcionou"
      ],
      feedback: {
        "A": "Isso não é falta de capacidade. É falta de direção certa.",
        "B": "Isso não é falta de capacidade. É falta de direção certa.",
        "C": "Isso não é falta de capacidade. É falta de direção certa.",
        "D": "Isso não é falta de capacidade. É falta de direção certa."
      }
    },
    {
      question: "Se surgisse uma forma simples de ganhar dinheiro na sua cidade, você:",
      options: [
        "A) Começaria imediatamente",
        "B) Pensaria um pouco antes",
        "C) Ficaria inseguro, mas tentaria",
        "D) Provavelmente deixaria pra depois"
      ],
      feedback: {
        "A": "Quem age agora sai na frente.",
        "B": "Quem age agora sai na frente.",
        "C": "Quem age agora sai na frente.",
        "D": "Adiar é o motivo de 2025 ter sido igual aos outros anos."
      }
    },
    {
      question: "Qual dessas frases mais parece com você?",
      options: [
        "A) \"Não posso errar mais, preciso acertar agora\"",
        "B) \"Estou cansado de promessa vazia\"",
        "C) \"Só preciso de algo que funcione\"",
        "D) \"Não aguento passar mais um ano assim\""
      ],
      feedback: {
        "A": "Esse pensamento é o primeiro sinal de mudança real.",
        "B": "Esse pensamento é o primeiro sinal de mudança real.",
        "C": "Esse pensamento é o primeiro sinal de mudança real.",
        "D": "Esse pensamento é o primeiro sinal de mudança real."
      }
    }
  ];

  const testimonials = [
    { name: "Carlos M.", text: "Nunca tinha feito nada. A explicação é do zero mesmo.", rating: 5 },
    { name: "Ana Paula", text: "Não precisei de curso nem faculdade. Só seguir o passo a passo.", rating: 5 },
    { name: "Roberto S.", text: "Achei que ia ser mais um ebook. Me surpreendi.", rating: 5 },
    { name: "Juliana R.", text: "Bem direto, sem conversa fiada.", rating: 5 },
    { name: "Marcos L.", text: "Finalmente algo que mostra como vender de verdade.", rating: 5 }
  ];

  const handleQuizAnswer = (option: string) => {
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setTimeout(() => {
        setQuizStep(quizStep + 1);
      }, 800); // Reduzido de 1500ms para 800ms (mais ágil)
    } else {
      setTimeout(() => {
        setShowOffer(true);
      }, 800); // Reduzido de 1500ms para 800ms (mais ágil)
    }
  };

  const handlePurchase = () => {
    // Redireciona para o link de pagamento da Hotmart
    window.location.href = "https://pay.hotmart.com/L103775855E";
  };

  const getCurrentFeedback = () => {
    if (selectedAnswers.length === 0) return null;
    const currentAnswer = selectedAnswers[selectedAnswers.length - 1];
    const answerLetter = currentAnswer.charAt(0);
    return quizQuestions[quizStep].feedback[answerLetter as keyof typeof quizQuestions[0]['feedback']];
  };

  if (showOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Countdown Timer - Reduzido para mobile */}
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#ff0000] to-[#ff4444] text-white px-3 py-2 md:px-6 md:py-4 rounded-lg md:rounded-xl shadow-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <Clock className="w-4 h-4 md:w-6 md:h-6" />
              <div>
                <div className="text-[10px] md:text-xs font-semibold">EXPIRA EM:</div>
                <div className="text-lg md:text-2xl font-black">{formatTime(countdown)}</div>
              </div>
            </div>
          </div>

          {/* RESULTADO DO QUIZ */}
          <div className="text-center mb-12 mt-20 md:mt-0">
            <div className="inline-block bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              🔥 RESULTADO DO SEU QUIZ
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
              PERFIL PRONTO PARA{" "}
              <span className="text-[#ff6b00]">MUDAR DE VIDA EM 2026</span>
            </h1>
          </div>

          {/* VAMOS FALAR A VERDADE */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Vamos falar a verdade.
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p>Se você chegou até aqui, não foi por curiosidade.</p>
              <p>Foi porque você não aguenta mais começar o ano sem dinheiro e sem saber o que fazer.</p>
              <p className="text-[#ff6b00] font-bold text-xl mt-6">
                O seu resultado mostra isso claramente:<br />
                👉 você não precisa de motivação, precisa de um plano simples, direto e funcional.
              </p>
            </div>
          </div>

          {/* O QUE VOCÊ VAI RECEBER */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              📘 O QUE VOCÊ VAI RECEBER DE VERDADE
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-[#ff6b00] mb-6">Manual Local</h3>
            <p className="text-xl md:text-2xl text-white font-bold mb-6">
              25 formas reais de ganhar dinheiro no seu bairro em 2026
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-lg text-gray-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                <span>Sem curso técnico.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                <span>Sem faculdade.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                <span>Sem experiência.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                <span>Sem enrolação.</span>
              </div>
            </div>
            <p className="text-lg text-gray-300 mt-6">
              Isso foi criado pra gente comum, que está cansada de trabalhar muito, ganhar pouco e ver o dinheiro do próprio esforço indo pro bolso de outra pessoa.
            </p>
            <p className="text-lg text-gray-300 mt-4">
              Aqui você não vai "aprender um mercado".<br />
              Você vai entrar em negócios locais que já existem, já funcionam e já faturam, porque as pessoas compram esse tipo de serviço todo santo dia.
            </p>
          </div>

          {/* A REALIDADE QUE QUASE NINGUÉM FALA */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              ❌ A REALIDADE QUE QUASE NINGUÉM FALA
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p>Trabalhar o mês inteiro pra receber um valor fixo,<br />
              pedir permissão pra sair mais cedo,<br />
              depender de aumento que nunca vem…</p>
              <p className="text-white font-bold text-xl mt-6">
                Isso não é estabilidade.<br />
                É dependência.
              </p>
              <p className="text-[#ff6b00] font-bold text-xl mt-4">
                E a pior parte:<br />
                o tempo passa igual.
              </p>
            </div>
          </div>

          {/* COMO FUNCIONA */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              🤖 COMO FUNCIONA NA PRÁTICA (DO ZERO, SEM PULAR ETAPA)
            </h2>
            <p className="text-lg text-gray-300 mb-6">Funciona assim, simples:</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#ff6b00] text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                <p className="text-lg text-gray-300 pt-1">Você escolhe UMA das 25 ideias</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#ff6b00] text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                <p className="text-lg text-gray-300 pt-1">A IA te ensina tudo do zero, como se você nunca tivesse feito nada</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#ff6b00] text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                <p className="text-lg text-gray-300 pt-1">Você executa exatamente como está explicado</p>
              </div>
            </div>

            <p className="text-lg text-white font-bold mb-4">Para cada negócio, a IA mostra:</p>
            <div className="grid md:grid-cols-2 gap-3 text-gray-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>O que exatamente vender</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>Se é melhor fazer ou comprar pronto</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>Onde comprar material ou produto</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>Como montar o negócio do zero</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>Quanto cobrar pra não sair no prejuízo</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>O que falar para vender (sem vergonha)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span>Como conseguir os primeiros clientes no bairro</span>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-lg text-gray-300">
              <p>Tudo passo a passo, linguagem simples, sem termos técnicos.<br />
              Você lê, entende e aplica.</p>
              <p className="mt-4">Nada de ebook mentiroso.<br />
              Nada de teoria inútil.<br />
              Nada de papo motivacional.</p>
            </div>
          </div>

          {/* SOBRE RESULTADO */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              💰 SOBRE RESULTADO (VERDADE, NÃO PROMESSA)
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p className="text-white font-bold text-xl">Esses não são bicos.</p>
              <p>São negócios locais validados, que já funcionam hoje e que, quando bem executados, podem gerar renda consistente — muitos chegam a faturamentos altos por mês.</p>
              <p className="text-white font-bold text-xl mt-6">Mas vamos ser honestos:</p>
              <div className="space-y-2 mt-4">
                <p>👉 O manual mostra o caminho.</p>
                <p>👉 A IA explica o como.</p>
                <p>👉 Quem executa é você.</p>
              </div>
              <p className="text-[#ff6b00] font-bold text-xl mt-6">
                E isso é bom, porque coloca o controle na sua mão, não na sorte.
              </p>
            </div>
          </div>

          {/* A VIRADA DE CHAVE */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              ⚠️ A VIRADA DE CHAVE
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p className="text-white font-bold text-xl">Você não precisa das 25 ideias.</p>
              <p className="text-white font-bold text-xl">Você precisa de UMA que funcione.</p>
              <p className="mt-6">Uma que te permita:</p>
              <div className="space-y-2 mt-4 ml-4">
                <p>Parar de depender de salário</p>
                <p>Ter seu próprio negócio</p>
                <p>Fazer seu horário</p>
                <p>Trabalhar pra você, não pro patrão</p>
              </div>
              <p className="text-[#ff6b00] font-bold text-xl mt-6">
                Uma que te permita buscar seu filho na escola sem pedir permissão,<br />
                planejar seu mês sem medo,<br />
                e construir algo que é seu.
              </p>
            </div>
          </div>

          {/* O QUE MUDA */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              🎯 O QUE MUDA QUANDO O DINHEIRO DEPENDE DE VOCÊ
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p>Mais tempo de qualidade com a família.<br />
              Menos ansiedade com conta atrasada.<br />
              Mais liberdade pra planejar o futuro.</p>
              <p className="text-white font-bold text-xl mt-6">É isso que permite:</p>
              <div className="space-y-2 mt-4 ml-4">
                <p>Trocar de carro sem sufoco</p>
                <p>Planejar sua casa</p>
                <p>Colocar seu filho numa escola melhor</p>
                <p>Parar de enriquecer o patrão e começar a construir o seu caminho</p>
              </div>
            </div>
          </div>

          {/* SE VOCÊ NÃO FIZER NADA */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#ff0000] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              ⛔ SE VOCÊ NÃO FIZER NADA…
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p className="text-white font-bold text-xl">Daqui a 6 meses, sua situação vai ser a mesma.</p>
              <p>Não porque você não tentou.<br />
              Mas porque continuou sem direção.</p>
              <p className="text-[#ff6b00] font-bold text-xl mt-6">
                Agora você já sabe que existe um caminho simples.<br />
                Ignorar isso também é uma escolha.
              </p>
            </div>
          </div>

          {/* PONTO DE NÃO RETORNO */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              🧠 PONTO DE NÃO RETORNO
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p className="text-white font-bold text-xl">Você já sabe três coisas agora:</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                  <span>Do jeito que está, não dá pra continuar</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                  <span>Você não precisa de faculdade pra começar</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#ff6b00] flex-shrink-0" />
                  <span>Existe um passo a passo claro pra aplicar</span>
                </div>
              </div>
              <p className="text-[#ff6b00] font-bold text-xl mt-6">
                A única coisa que falta é decidir.
              </p>
            </div>
          </div>

          {/* FECHAMENTO FINAL */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              🔥 FECHAMENTO FINAL
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p className="text-white font-bold text-xl">
                Se uma única ideia desse manual colocar dinheiro no seu bolso,<br />
                ele já se paga muitas vezes.
              </p>
              <p className="text-[#ff6b00] font-bold text-xl mt-6">
                O resto é escolha.
              </p>
            </div>
          </div>

          {/* PROMOÇÃO RELÂMPAGO */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] border-2 border-[#ff6b00] rounded-2xl p-6 md:p-12 mb-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-[#ff0000] to-[#ff4444] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-lg md:text-xl mb-6 shadow-lg">
                💥 PROMOÇÃO RELÂMPAGO DE LANÇAMENTO
              </div>
              
              <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
                <span className="text-2xl md:text-4xl text-gray-600 line-through">R$ 199</span>
                <span className="text-5xl md:text-7xl font-black text-[#ff6b00] drop-shadow-[0_0_20px_rgba(255,107,0,0.8)]">R$ 47</span>
              </div>
              <p className="text-gray-300 text-lg mb-2">(pagamento único)</p>

              <div className="bg-[#3a1a1a] border-2 border-[#ff0000] rounded-xl p-4 md:p-6 mb-8 max-w-2xl mx-auto shadow-lg">
                <p className="text-[#ff6b00] font-bold text-base md:text-lg mb-2">⏳ Atenção: essa oferta expira em poucos minutos</p>
                <p className="text-[#ff6b00] font-bold text-base md:text-lg">⏰ Quando o relógio zerar, o valor pode voltar para R$ 199</p>
              </div>
            </div>

            {/* CTA PRINCIPAL */}
            <button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white text-xl md:text-3xl font-black py-6 md:py-8 rounded-2xl hover:from-[#ff8533] hover:to-[#ffa366] transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(255,107,0,0.7)] flex items-center justify-center gap-3 mb-6"
            >
              <Zap className="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-center">GARANTIR ACESSO IMEDIATO AO MANUAL LOCAL POR R$ 47</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Contador de Pessoas Acessando - Abaixo do botão */}
            <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-4 py-3 rounded-xl shadow-lg mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Users className="w-5 h-5 animate-pulse" />
                <div className="text-center">
                  <div className="text-sm font-bold">🔥 {viewersCount} pessoas acessando agora mesmo</div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-400 text-sm mb-4">
              ⚠️ Ao sair desta página, essa condição pode não estar mais disponível
            </p>
          </div>

          {/* GARANTIA */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#4ade80] rounded-xl p-6 md:p-8 mb-8">
            <Shield className="w-12 h-12 text-[#4ade80] mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              🛡️ GARANTIA INCONDICIONAL DE 7 DIAS
            </h3>
            <div className="space-y-3 text-lg text-gray-300 text-center">
              <p>Você tem 7 dias para acessar tudo.</p>
              <p className="text-white font-bold">Se não gostar por qualquer motivo,<br />devolvemos 100% do seu dinheiro.</p>
              <p>Sem perguntas.<br />Sem burocracia.</p>
            </div>
          </div>

          {/* DEPOIMENTOS */}
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-white text-center mb-4">
              ⭐ O QUE AS PESSOAS ESTÃO DIZENDO
            </h3>
            <p className="text-center text-gray-300 mb-8">
              Avaliação média: ⭐⭐⭐⭐☆ (4,7 de 5)<br />
              📊 Mais de 1.600 pessoas já avaliaram este conteúdo
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#ff6b00] text-[#ff6b00]" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b00] to-[#ff8533] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-lg">
              👉 E existem muitos outros comentários parecidos.
            </p>
          </div>

          {/* AVISO FINAL */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#ff6b00] rounded-xl p-6 md:p-8 mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              ⛔ AVISO FINAL (DECISÃO REAL)
            </h3>
            <div className="space-y-4 text-lg text-gray-300 text-center">
              <p>Você já respondeu o quiz.</p>
              <p>Você já viu como funciona.</p>
              <p className="text-white font-bold text-xl mt-6">Fechar essa página agora é uma escolha.<br />Não comprar também é uma escolha.</p>
              <p className="text-[#ff6b00] font-bold text-xl">A diferença é o resultado nos próximos meses.</p>
            </div>
          </div>

          {/* SEGURANÇA E ENTREGA */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
              🔒 SEGURANÇA E ENTREGA
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center text-gray-300">
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-8 h-8 text-[#4ade80]" />
                <span>🔒 Pagamento 100% seguro</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-[#4ade80]" />
                <span>✅ Acesso imediato após confirmação</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-8 h-8 text-[#4ade80]" />
                <span>🛡️ Garantia de 7 dias</span>
              </div>
            </div>
          </div>

          {/* BOTÃO FINAL */}
          <button
            onClick={handlePurchase}
            className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white text-xl md:text-3xl font-black py-6 md:py-8 rounded-2xl hover:from-[#ff8533] hover:to-[#ffa366] transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(255,107,0,0.7)] flex items-center justify-center gap-3"
          >
            <Zap className="w-6 h-6 md:w-8 md:h-8" />
            <span className="text-center">SIM, QUERO COMEÇAR AGORA POR R$ 47</span>
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
            🔥 QUIZ — DESCUBRA SE 2026 VAI SER DIFERENTE PRA VOCÊ
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            Descubra se você está pronto para{" "}
            <span className="text-[#ff6b00]">mudar de vida em 2026</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Responda 4 perguntas rápidas e descubra seu perfil
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#2a2a2a] rounded-2xl p-6 md:p-12 shadow-xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-semibold text-sm md:text-base">
                PERGUNTA {quizStep + 1}
              </span>
              <span className="text-[#ff6b00] font-bold">
                {Math.round(((quizStep + 1) / quizQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-3 md:h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] h-3 md:h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl md:text-3xl font-bold text-white mb-8">
            {quizQuestions[quizStep].question}
          </h2>

          <div className="space-y-4">
            {quizQuestions[quizStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuizAnswer(option)}
                className="w-full bg-gradient-to-r from-[#2a2a2a] to-[#1f1f1f] hover:from-[#ff6b00] hover:to-[#ff8533] text-white font-bold py-5 md:py-6 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-left flex items-center justify-between group border-2 border-[#3a3a3a] hover:border-[#ff6b00] hover:shadow-lg"
              >
                <span className="text-base md:text-lg">{option}</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            ))}
          </div>

          {/* Feedback após resposta */}
          {selectedAnswers.length > quizStep && (
            <div className="mt-6 bg-[#0a0a0a] border-2 border-[#ff6b00] rounded-xl p-6 animate-fade-in">
              <p className="text-[#ff6b00] font-semibold text-base md:text-lg text-center">
                👉 {getCurrentFeedback()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Suas respostas são 100% confidenciais
          </p>
        </div>
      </div>
    </div>
  );
}
