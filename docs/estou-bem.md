# CheckIn Vivo

### App de check-in de segurança para quem mora sozinho

**Versão 1.0 | Julho de 2026**
_Inspirado no fenômeno chinês "Demumu" (死了吗) — adaptado para o mercado brasileiro_

---

## 1. Sumário Executivo

CheckIn Vivo é um aplicativo mobile de check-in de segurança para pessoas que moram sozinhas. O conceito é deliberadamente simples: o usuário confirma periodicamente que está bem apertando um único botão. Se o check-in não acontecer dentro do prazo configurado, o app notifica automaticamente uma pessoa de confiança (contato de emergência) via WhatsApp e SMS.

O produto é inspirado no aplicativo chinês popularmente conhecido como "Are You Dead?" (renomeado depois para Demumu), que se tornou o app pago mais baixado da China em janeiro de 2026 e expandiu para mais de 40 países em poucas semanas. A tese de produto se sustenta em uma mudança demográfica real: o IBGE registrou que, em 2025, 19,7% dos domicílios brasileiros eram unipessoais — um salto de 52% em 12 anos — e 40% dessas pessoas têm 60 anos ou mais.

Este documento define o escopo funcional, técnico e de negócio da primeira versão (MVP) e das fases seguintes do produto.

---

## 2. Contexto e Oportunidade de Mercado

### 2.1 Referência de mercado (China)

- App viral desde maio de 2025, com pico de popularidade em janeiro de 2026.
- Tornou-se o app pago nº 1 na App Store da China e alcançou o 6º lugar entre apps pagos nos EUA.
- Expandiu para mais de 40 países em semanas, sob o novo nome "Demumu".
- Preço de entrada muito baixo (cerca de 8 yuanes, ~R$ 6), o que reduz a fricção de decisão de compra.
- Motivação demográfica: projeção de 200 milhões de domicílios unipessoais na China até 2030.

### 2.2 Aderência ao Brasil

- 19,7% dos domicílios brasileiros eram unipessoais em 2025, ante 12,2% em 2012 (PNAD Contínua / IBGE).
- Crescimento de 52% na proporção de pessoas morando sozinhas em 12 anos.
- 40% dos domicílios unipessoais são ocupados por pessoas com 60 anos ou mais — público sensível ao tema segurança e saúde.
- Entre homens sozinhos, maioria (56,4%) tem de 30 a 59 anos; entre mulheres, maioria (55%) tem 60 anos ou mais — dois públicos distintos, mesma dor.
- Mercado imobiliário já responde a essa mudança com boom de studios e apartamentos compactos nas grandes cidades, o que indica um público concentrado e endereçável.

### 2.3 Por que a ideia funciona

O produto não resolve um problema técnico complexo — resolve uma ansiedade emocional cotidiana ("e se algo acontecer comigo e ninguém souber") com uma interação de uma tela só. Isso reduz drasticamente o custo de desenvolvimento e o tempo de lançamento, e a decisão de compra do usuário é emocional e rápida, não racional e comparativa.

---

## 3. Visão de Produto

Ser o "botão de vida" mais simples e confiável do Brasil: uma confirmação diária de bem-estar que transforma silêncio em alerta acionável para quem se importa com você, sem exigir esforço, tecnologia complexa ou monitoramento invasivo.

### 3.1 Princípios de design

- Simplicidade radical: a ação principal do app cabe em um toque.
- Baixa fricção de confiança: o app não vigia, só confirma presença.
- Acessibilidade em primeiro lugar: fontes grandes, alto contraste, linguagem simples — pensando em usuários idosos.
- Canal nativo do Brasil: WhatsApp como canal principal de alerta, não apenas notificação push.

---

## 4. Público-Alvo e Personas

| Persona                 | Perfil                                             | Motivação principal                           | Canal de alerta preferido                   |
| ----------------------- | -------------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| Idoso(a) que mora só    | 60+ anos, mora sozinho(a), filhos morando longe    | Tranquilidade para a família à distância      | WhatsApp do(a) filho(a)/cuidador(a)         |
| Jovem adulto solteiro   | 25–45 anos, mora só em grande centro urbano        | Segurança pessoal, ansiedade sobre morar só   | WhatsApp de amigo(a) próximo(a) ou familiar |
| Cuidador(a) à distância | Filho(a)/parente que monitora um idoso remotamente | Reduzir ansiedade sem precisar ligar todo dia | Recebe alertas, não faz check-in            |

---

## 5. Escopo Funcional — MVP (Fase 1)

### 5.1 Funcionalidades essenciais

| Funcionalidade                    | Descrição                                                                           | Prioridade |
| --------------------------------- | ----------------------------------------------------------------------------------- | ---------- |
| Check-in de um toque              | Botão único na tela inicial para confirmar "estou bem"                              | Crítica    |
| Configuração de intervalo         | Usuário define frequência do check-in (ex.: 24h, 48h, 72h)                          | Crítica    |
| Cadastro de contato de emergência | 1 a 2 contatos, com nome, telefone e relação (aceite via link enviado por WhatsApp) | Crítica    |
| Alerta automático                 | Envio de mensagem via WhatsApp/SMS ao contato se o check-in não ocorrer no prazo    | Crítica    |
| Lembretes progressivos            | Notificações no celular do usuário antes do prazo vencer (ex.: 2h e 30min antes)    | Alta       |
| Modo silencioso / widget          | Check-in disponível direto na tela de bloqueio ou widget, sem abrir o app           | Alta       |
| Onboarding simplificado           | Cadastro em menos de 2 minutos, sem exigir muitos dados                             | Alta       |

### 5.2 Fora de escopo no MVP (fases futuras)

- Geolocalização e check-in automático por chegada em casa.
- Múltiplos contatos com hierarquia de escalonamento (ex.: se o 1º não responder, aciona o 2º).
- Integração com wearables (batimento cardíaco, detecção de queda).
- Modo família/grupo, com painel para cuidadores acompanharem vários idosos.
- Assinatura corporativa (ex.: para empresas oferecerem a funcionários que moram sós).

---

## 6. Fluxo do Usuário (MVP)

1. Usuário baixa o app e cria conta (telefone ou e-mail).
2. Define o intervalo de check-in desejado (ex.: a cada 24h).
3. Cadastra 1–2 contatos de emergência; cada contato recebe um link de confirmação via WhatsApp para aceitar o papel.
4. Diariamente, recebe lembretes (push) para fazer o check-in antes do prazo.
5. Usuário abre o app ou usa o widget e toca em "Estou bem".
6. Se o prazo vencer sem check-in, o sistema envia automaticamente uma mensagem ao(s) contato(s) de emergência via WhatsApp/SMS, com horário do último check-in registrado.
7. O contato de emergência pode confirmar que já verificou a situação, encerrando o alerta.

---

## 7. Requisitos Técnicos

### 7.1 Arquitetura de alto nível

- App mobile nativo ou híbrido (React Native/Flutter) para iOS e Android.
- Backend com agendador de tarefas (cron/jobs) para verificar prazos de check-in vencidos.
- Integração com API do WhatsApp Business para envio de alertas.
- Integração com provedor de SMS como fallback (ex.: caso o contato não tenha WhatsApp).
- Notificações push nativas (APNs / FCM) para lembretes ao usuário.
- Banco de dados para usuários, contatos de emergência, histórico de check-ins e logs de alerta.

### 7.2 Requisitos não funcionais

| Requisito                               | Meta                                                              |
| --------------------------------------- | ----------------------------------------------------------------- |
| Disponibilidade do agendador de alertas | 99,9% (é a função crítica do produto)                             |
| Latência do envio de alerta             | Menor que 2 minutos após o vencimento do prazo                    |
| Tempo de onboarding                     | Menor que 2 minutos, do download ao primeiro check-in             |
| Acessibilidade                          | Suporte a fontes grandes e leitores de tela (foco no público 60+) |

---

## 8. Privacidade e Conformidade (LGPD)

- Consentimento explícito do usuário titular dos dados no cadastro.
- Consentimento explícito também do contato de emergência antes de receber alertas (aceite via link, não cadastro silencioso).
- Minimização de dados: coletar apenas nome, telefone e relação do contato — nada de dados de saúde ou localização no MVP.
- Política de retenção clara: histórico de check-in guardado por prazo definido e deletável a pedido do usuário.
- Canal de exclusão de conta e dados de fácil acesso, conforme exigido pela LGPD.

---

## 9. Modelo de Monetização

| Modelo                       | Descrição                                                                | Preço sugerido          |
| ---------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| Assinatura mensal            | Cobrança recorrente com todos os recursos do MVP                         | R$ 7,90 – R$ 14,90/mês  |
| Pagamento único ("lifetime") | Taxa única de ativação vitalícia, à semelhança do modelo chinês original | R$ 29,90 – R$ 49,90     |
| Plano família (fase 2)       | Múltiplos usuários monitorados por um mesmo cuidador                     | R$ 24,90 – R$ 39,90/mês |

O preço de entrada deve ser propositalmente baixo para reduzir a fricção de decisão — o mesmo mecanismo que impulsionou a adoção viral do produto chinês.

---

## 10. Métricas de Sucesso

| Métrica                                                    | Meta no primeiro trimestre pós-lançamento       |
| ---------------------------------------------------------- | ----------------------------------------------- |
| Taxa de conclusão do onboarding                            | > 70% dos que baixam o app completam o cadastro |
| Taxa de check-in diário (usuários ativos)                  | > 60%                                           |
| Taxa de conversão para pago                                | > 8% dos usuários ativos                        |
| Taxa de churn mensal                                       | < 10%                                           |
| Tempo médio até o primeiro alerta configurado corretamente | < 5 minutos                                     |

---

## 11. Roadmap Sugerido

| Fase                 | Prazo estimado | Entregáveis principais                                                                   |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| Fase 1 — MVP         | 0–2 meses      | Check-in, contato de emergência, alerta via WhatsApp/SMS, onboarding                     |
| Fase 2 — Engajamento | 3–4 meses      | Widget de tela de bloqueio, múltiplos contatos com escalonamento, lembretes inteligentes |
| Fase 3 — Expansão    | 5–8 meses      | Geolocalização opcional, plano família, painel do cuidador                               |
| Fase 4 — Parcerias   | 9–12 meses     | Integração com seguradoras, planos de saúde ou operadoras como benefício adicional       |

---

## 12. Riscos e Mitigações

| Risco                                                                 | Mitigação                                                                                                                |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Falsos alertas (usuário esquece de fazer check-in por motivo trivial) | Lembretes progressivos + janela de tolerância configurável antes de notificar o contato                                  |
| Baixa adoção por desconfiança quanto ao uso de dados                  | Comunicação transparente + conformidade visível com a LGPD                                                               |
| Dependência de terceiros (API do WhatsApp)                            | Fallback via SMS e, futuramente, push direto ao app do contato                                                           |
| Percepção do produto como "mórbido" ou desconfortável                 | Posicionamento de marca focado em tranquilidade e cuidado, não em morte (lição aprendida com o rebranding do app chinês) |

---

_Documento vivo — recomenda-se revisão após validação com usuários reais (testes com 10–20 famílias/pessoas antes do lançamento público)._
