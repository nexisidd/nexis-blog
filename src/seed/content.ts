// Conteúdo inicial: só estrutura. Tudo entra como RASCUNHO e precisa ser escrito e revisado antes de publicar.
// Regra: não inventar números. Onde houver dado, fica [DADO + FONTE].

export type SeedPost = {
  slug: string
  title: string
  subtitle: string
  description: string
  tldr: string
  category: string
  subcategory: string
  cta: 'modo-sombra' | 'calculadora' | 'contato'
  h2: string[]
  table?: { afterH2: number; header: string[]; rows: string[][] }
  faq: string[]
  related: string[]
}

const BODY_TODO = 'RASCUNHO: escrever. Responda a pergunta do título acima na primeira frase, sem rodeio.'

export const sectionBody = BODY_TODO

export const posts: SeedPost[] = [
  {
    slug: 'o-que-e-falso-positivo',
    title: 'O que é falso positivo no e-commerce e quanto ele custa',
    subtitle: 'A compra legítima que o antifraude recusa, e por que ela pesa mais do que parece.',
    description:
      'Falso positivo é a compra legítima recusada pelo antifraude. Veja como ele acontece, quanto custa para a loja e como medir e reduzir.',
    tldr: 'Falso positivo no e-commerce é quando o antifraude recusa uma compra legítima por achar que é fraude. A loja perde a venda, paga pela aquisição do cliente e muitas vezes perde o próprio cliente. Como a recusa não gera alerta, o prejuízo costuma ficar invisível até alguém medir quantas recusas eram, na verdade, compras boas.',
    category: 'antifraude',
    subcategory: 'antifraude/falso-positivo',
    cta: 'calculadora',
    h2: [
      'O que é falso positivo no antifraude?',
      'Qual a diferença entre falso positivo e falso negativo?',
      'Quanto o falso positivo custa para uma loja?',
      'Por que o antifraude recusa compras legítimas?',
      'Como medir a taxa de falso positivo?',
      'Como reduzir o falso positivo sem aumentar o chargeback?',
    ],
    table: {
      afterH2: 1,
      header: ['', 'Falso positivo', 'Falso negativo'],
      rows: [
        ['O que é', 'Compra legítima recusada', 'Fraude aprovada'],
        ['Quem percebe', '[PREENCHER]', '[PREENCHER]'],
        ['Custo para a loja', '[DADO + FONTE]', '[DADO + FONTE]'],
      ],
    },
    faq: [
      'Falso positivo é a mesma coisa que venda negada pelo banco?',
      'Qual é uma taxa de falso positivo aceitável?',
      'Como saber se o meu antifraude está recusando venda boa?',
    ],
    related: ['o-que-e-chargeback', 'como-funciona-antifraude-ecommerce', 'taxa-de-aprovacao-cartao'],
  },
  {
    slug: 'o-que-e-chargeback',
    title: 'O que é chargeback, tipos e como reduzir',
    subtitle: 'Quando o cliente contesta a compra no cartão, quem paga a conta e como evitar.',
    description:
      'Chargeback é a contestação de uma compra no cartão que devolve o dinheiro ao cliente. Conheça os tipos, os custos e como reduzir.',
    tldr: 'Chargeback é a contestação de uma compra feita no cartão de crédito: o titular pede ao banco emissor o dinheiro de volta e o valor é debitado da loja. Pode vir de fraude com cartão roubado, de autofraude ou de desacordo comercial. Além da venda, a loja perde o produto, o frete e paga tarifas.',
    category: 'antifraude',
    subcategory: 'antifraude/chargeback',
    cta: 'modo-sombra',
    h2: [
      'O que é chargeback?',
      'Como funciona o processo de chargeback?',
      'Quais são os tipos de chargeback?',
      'Quanto um chargeback custa para a loja?',
      'Como contestar um chargeback?',
      'Como reduzir o chargeback sem recusar venda boa?',
    ],
    table: {
      afterH2: 2,
      header: ['Tipo', 'O que acontece', 'Como prevenir'],
      rows: [
        ['Fraude (cartão de terceiro)', '[PREENCHER]', '[PREENCHER]'],
        ['Autofraude', '[PREENCHER]', '[PREENCHER]'],
        ['Desacordo comercial', '[PREENCHER]', '[PREENCHER]'],
        ['Erro de processamento', '[PREENCHER]', '[PREENCHER]'],
      ],
    },
    faq: [
      'Qual o prazo para o cliente pedir chargeback?',
      'A loja pode recuperar o dinheiro de um chargeback?',
      'Chargeback existe no Pix?',
    ],
    related: ['o-que-e-falso-positivo', 'autofraude-ecommerce', 'med-pix-o-que-e'],
  },
  {
    slug: 'como-funciona-antifraude-ecommerce',
    title: 'Como funciona um antifraude no e-commerce',
    subtitle: 'Do clique em "comprar" à decisão: o que acontece em poucos segundos.',
    description:
      'Entenda como um antifraude analisa cada pedido no e-commerce, que dados usa, como decide e por que aprovar ou reprovar não basta.',
    tldr: 'Um antifraude de e-commerce analisa cada pedido antes da aprovação, cruzando dados do comprador, do dispositivo, do pagamento e do histórico para estimar o risco de fraude. Com base nesse risco, ele aprova, recusa ou manda o pedido para revisão. A qualidade está em barrar fraude sem recusar compras legítimas.',
    category: 'antifraude',
    subcategory: 'antifraude/fraude-em-cartao',
    cta: 'modo-sombra',
    h2: [
      'O que faz um sistema antifraude?',
      'Que dados o antifraude analisa em cada pedido?',
      'Regras, modelos e análise manual: qual a diferença?',
      'Por que aprovar ou reprovar não é suficiente?',
      'Quais métricas mostram se o antifraude funciona bem?',
    ],
    table: {
      afterH2: 2,
      header: ['Abordagem', 'Como decide', 'Vantagens', 'Limitações'],
      rows: [
        ['Regras fixas', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
        ['Modelos de machine learning', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
        ['Análise manual', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
      ],
    },
    faq: [
      'O antifraude atrasa a aprovação do pedido?',
      'Antifraude e 3DS são a mesma coisa?',
      'Toda loja precisa de antifraude?',
    ],
    related: ['como-escolher-antifraude', 'o-que-e-falso-positivo', '3ds-autenticacao-ecommerce'],
  },
  {
    slug: 'como-escolher-antifraude',
    title: 'Como escolher uma solução antifraude: critérios e comparação',
    subtitle: 'Os critérios objetivos para comparar fornecedores antes de assinar contrato.',
    description:
      'Critérios objetivos para escolher um antifraude para e-commerce: falso positivo, chargeback, modelo de cobrança, integração e transparência.',
    tldr: 'Para escolher um antifraude, compare fornecedores pelos resultados na sua própria operação: taxa de aprovação, chargeback e falso positivo medidos lado a lado. Avalie também o modelo de cobrança, a garantia contra chargeback, a integração com sua plataforma e o quanto o sistema explica cada decisão. Um teste paralelo com seus dados vale mais que promessas.',
    category: 'antifraude',
    subcategory: 'antifraude/falso-positivo',
    cta: 'modo-sombra',
    h2: [
      'O que avaliar antes de contratar um antifraude?',
      'Quais métricas pedir ao fornecedor?',
      'Como funciona o modelo de cobrança e a garantia contra chargeback?',
      'Como testar um antifraude sem arriscar a operação?',
      'Como escolher uma solução antifraude: comparação por critério',
    ],
    table: {
      afterH2: 4,
      header: ['Critério', 'Pergunta para o fornecedor', 'O que observar'],
      rows: [
        ['Taxa de aprovação', '[PREENCHER]', '[PREENCHER]'],
        ['Falso positivo', '[PREENCHER]', '[PREENCHER]'],
        ['Chargeback e garantia', '[PREENCHER]', '[PREENCHER]'],
        ['Modelo de cobrança', '[PREENCHER]', '[PREENCHER]'],
        ['Integração com a plataforma', '[PREENCHER]', '[PREENCHER]'],
        ['Transparência das decisões', '[PREENCHER]', '[PREENCHER]'],
      ],
    },
    faq: [
      'Vale a pena trocar de antifraude?',
      'Posso usar dois antifraudes ao mesmo tempo?',
      'Quanto custa um antifraude para e-commerce?',
    ],
    related: ['como-funciona-antifraude-ecommerce', 'o-que-e-falso-positivo', 'taxa-de-aprovacao-cartao'],
  },
  {
    slug: 'autofraude-ecommerce',
    title: 'Autofraude: o que é e como identificar',
    subtitle: 'Quando quem compra é o próprio titular do cartão, e depois contesta.',
    description:
      'Autofraude é quando o próprio titular compra e depois contesta a compra como se não tivesse feito. Veja sinais, prevenção e provas.',
    tldr: 'Autofraude, também chamada de fraude amigável, acontece quando o próprio titular do cartão faz a compra, recebe o produto e depois contesta a transação dizendo que não a reconhece. Como os dados do comprador são verdadeiros, ela passa por muitos antifraudes. Identificar exige olhar histórico, comportamento e guardar provas de entrega.',
    category: 'antifraude',
    subcategory: 'antifraude/autofraude',
    cta: 'modo-sombra',
    h2: [
      'O que é autofraude?',
      'Qual a diferença entre autofraude e fraude com cartão de terceiro?',
      'Quais sinais indicam autofraude?',
      'Como provar que a compra foi feita pelo titular?',
      'Como prevenir a autofraude sem prejudicar bons clientes?',
    ],
    table: {
      afterH2: 1,
      header: ['', 'Autofraude', 'Fraude com cartão de terceiro'],
      rows: [
        ['Quem compra', 'O próprio titular', 'Outra pessoa, sem autorização'],
        ['Dados do pedido', '[PREENCHER]', '[PREENCHER]'],
        ['Como prevenir', '[PREENCHER]', '[PREENCHER]'],
      ],
    },
    faq: ['Autofraude é crime?', 'O antifraude consegue barrar autofraude?', 'Que provas ajudam a contestar?'],
    related: ['o-que-e-chargeback', 'como-funciona-antifraude-ecommerce', '3ds-autenticacao-ecommerce'],
  },
  {
    slug: '3ds-autenticacao-ecommerce',
    title: '3DS: o que é e quando usar',
    subtitle: 'A autenticação do banco emissor no checkout: quando ajuda e quando atrapalha.',
    description:
      '3DS (3-D Secure) é a autenticação do comprador pelo banco emissor no checkout. Veja como funciona, a responsabilidade pelo chargeback e quando usar.',
    tldr: '3DS, ou 3-D Secure, é um protocolo em que o banco emissor autentica o comprador durante o pagamento com cartão, às vezes sem nenhuma ação dele e às vezes pedindo uma confirmação no app ou por código. Ele pode transferir a responsabilidade por chargeback de fraude para o emissor, mas etapas extras podem reduzir a conversão.',
    category: 'pagamentos',
    subcategory: 'pagamentos/3ds',
    cta: 'modo-sombra',
    h2: [
      'O que é 3DS?',
      'Como funciona o 3DS 2.0 no checkout?',
      'O 3DS transfere a responsabilidade pelo chargeback?',
      'O 3DS reduz a conversão?',
      'Quando usar 3DS e quando usar só o antifraude?',
    ],
    table: {
      afterH2: 4,
      header: ['', 'Só antifraude', 'Antifraude + 3DS seletivo', '3DS em tudo'],
      rows: [
        ['Fricção no checkout', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
        ['Responsabilidade pelo chargeback de fraude', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
        ['Impacto na aprovação', '[DADO + FONTE]', '[DADO + FONTE]', '[DADO + FONTE]'],
      ],
    },
    faq: ['3DS é obrigatório no Brasil?', '3DS funciona com cartão de débito?', 'O 3DS substitui o antifraude?'],
    related: ['como-funciona-antifraude-ecommerce', 'taxa-de-aprovacao-cartao', 'o-que-e-chargeback'],
  },
  {
    slug: 'taxa-de-aprovacao-cartao',
    title: 'Taxa de aprovação de cartão: como medir e aumentar',
    subtitle: 'Onde as vendas com cartão estão sendo recusadas e o que dá para recuperar.',
    description:
      'Taxa de aprovação de cartão é a parte das tentativas de pagamento aprovadas. Veja como calcular, onde ocorrem recusas e como aumentar.',
    tldr: 'Taxa de aprovação de cartão é a porcentagem de tentativas de pagamento com cartão que terminam aprovadas. As recusas podem vir do antifraude da loja, do gateway, da adquirente ou do banco emissor, e cada etapa pede uma ação diferente. Medir a aprovação por etapa mostra quanto da receita perdida dá para recuperar.',
    category: 'pagamentos',
    subcategory: 'pagamentos/cartao-de-credito',
    cta: 'calculadora',
    h2: [
      'O que é taxa de aprovação de cartão?',
      'Como calcular a taxa de aprovação?',
      'Onde as transações são recusadas?',
      'Qual é uma boa taxa de aprovação no e-commerce?',
      'Como aumentar a taxa de aprovação?',
    ],
    table: {
      afterH2: 2,
      header: ['Etapa', 'Quem recusa', 'Motivos comuns', 'O que fazer'],
      rows: [
        ['Antifraude', 'Sistema da loja', '[PREENCHER]', '[PREENCHER]'],
        ['Gateway / adquirente', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
        ['Banco emissor', 'Banco do cliente', '[PREENCHER]', '[PREENCHER]'],
      ],
    },
    faq: [
      'Taxa de aprovação e taxa de conversão são a mesma coisa?',
      'Retentativa de pagamento aumenta a aprovação?',
      'Como saber se a recusa veio do antifraude ou do banco?',
    ],
    related: ['o-que-e-falso-positivo', '3ds-autenticacao-ecommerce', 'como-escolher-antifraude'],
  },
  {
    slug: 'med-pix-o-que-e',
    title: 'MED do Pix: como funciona a devolução por fraude',
    subtitle: 'O Mecanismo Especial de Devolução e o que ele significa para quem vende com Pix.',
    description:
      'O MED é o Mecanismo Especial de Devolução do Pix, usado em casos de fraude. Veja como funciona, prazos e o impacto para lojas online.',
    tldr: 'RASCUNHO: escrever em 40 a 60 palavras o que é o MED (Mecanismo Especial de Devolução) do Pix, quem pode acionar, em que situações e o que acontece com o dinheiro recebido pela loja. Conferir tudo no regulamento do Pix no site do Banco Central e citar a norma e a data.',
    category: 'regulacao',
    subcategory: 'regulacao/pix-e-banco-central',
    cta: 'contato',
    h2: [
      'O que é o MED do Pix?',
      'Quando o MED pode ser acionado?',
      'Como funciona o processo de devolução, passo a passo?',
      'Quais são os prazos do MED?',
      'O que muda para quem vende com Pix no e-commerce?',
      'MED e chargeback: qual a diferença?',
    ],
    table: {
      afterH2: 5,
      header: ['', 'MED (Pix)', 'Chargeback (cartão)'],
      rows: [
        ['Quem aciona', '[PREENCHER]', '[PREENCHER]'],
        ['Motivos aceitos', '[PREENCHER]', '[PREENCHER]'],
        ['Prazos', '[DADO + FONTE]', '[DADO + FONTE]'],
        ['Norma', '[DADO + FONTE]', '[PREENCHER]'],
      ],
    },
    faq: [
      'O MED devolve o dinheiro em qualquer caso de golpe?',
      'A loja pode contestar um pedido de devolução pelo MED?',
      'O MED vale para Pix Cobrança e QR Code?',
    ],
    related: ['resolucao-587-bacen', 'o-que-e-chargeback', 'como-funciona-antifraude-ecommerce'],
  },
  {
    slug: 'resolucao-587-bacen',
    title: 'Resolução BCB 587: o que muda na marcação de fraude no Pix',
    subtitle: 'As novas regras do Banco Central para marcar e compartilhar suspeitas de fraude.',
    description:
      'O que a Resolução BCB 587 muda na marcação de fraude no Pix, quem é afetado, prazos de adequação e o que lojas online precisam fazer.',
    tldr: 'RASCUNHO: escrever em 40 a 60 palavras o que a Resolução BCB 587 muda na marcação de fraude no Pix, a partir de quando vale e quem é afetado. Conferir no texto oficial da norma no site do Banco Central, citar número, data de publicação e data de vigência.',
    category: 'regulacao',
    subcategory: 'regulacao/pix-e-banco-central',
    cta: 'contato',
    h2: [
      'O que é a Resolução BCB 587?',
      'O que muda na marcação de fraude no Pix?',
      'Quem é afetado pela nova regra?',
      'Quais são os prazos de adequação?',
      'O que lojas online e intermediadores precisam fazer?',
    ],
    table: {
      afterH2: 1,
      header: ['Tema', 'Como era', 'Como fica'],
      rows: [
        ['[PREENCHER]', '[DADO + FONTE]', '[DADO + FONTE]'],
        ['[PREENCHER]', '[DADO + FONTE]', '[DADO + FONTE]'],
      ],
    },
    faq: [
      'A Resolução BCB 587 vale para todas as instituições?',
      'O que acontece com quem não se adequar?',
      'A regra muda alguma coisa no MED?',
    ],
    related: ['med-pix-o-que-e', 'como-funciona-antifraude-ecommerce', 'o-que-e-chargeback'],
  },
  ...(
    [
      ['shopify', 'Shopify'],
      ['vtex', 'VTEX'],
      ['nuvemshop', 'Nuvemshop'],
    ] as const
  ).map(
    ([slug, name]): SeedPost => ({
      slug: `antifraude-${slug}`,
      title: `Antifraude para ${name}: como escolher e integrar`,
      subtitle: `O que considerar ao proteger uma loja ${name} contra fraude sem perder venda boa.`,
      description: `Como funciona o antifraude em lojas ${name}, opções de integração, critérios de escolha e cuidados para não recusar compras legítimas.`,
      tldr: `RASCUNHO: escrever em 40 a 60 palavras como funciona o antifraude em lojas ${name}: onde ele entra no fluxo de pagamento, quais tipos de integração existem (nativa, app, via gateway) e o critério principal para escolher. Conferir a documentação oficial da ${name} e citar.`,
      category: 'e-commerce',
      subcategory: `e-commerce/${slug}`,
      cta: 'modo-sombra',
      h2: [
        `Como funciona o antifraude em uma loja ${name}?`,
        `Quais opções de antifraude se integram à ${name}?`,
        `Como integrar um antifraude na ${name}, passo a passo?`,
        `Como escolher o antifraude para a sua loja ${name}?`,
        'Como medir se o antifraude está recusando venda boa?',
      ],
      table: {
        afterH2: 1,
        header: ['Tipo de integração', 'Como funciona', 'Prós', 'Contras'],
        rows: [
          ['[PREENCHER]', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
          ['[PREENCHER]', '[PREENCHER]', '[PREENCHER]', '[PREENCHER]'],
        ],
      },
      faq: [
        `A ${name} já tem antifraude nativo?`,
        `Dá para usar mais de um antifraude na ${name}?`,
        'Trocar de antifraude exige mudar de gateway?',
      ],
      related: ['como-escolher-antifraude', 'como-funciona-antifraude-ecommerce', 'o-que-e-falso-positivo'],
    }),
  ),
]

export const glossary: { term: string; slug: string; definition: string; post?: string }[] = [
  {
    term: 'Antifraude',
    slug: 'antifraude',
    definition:
      'Sistema que analisa cada pedido antes da aprovação para estimar o risco de fraude e decidir se a compra segue, é recusada ou vai para revisão.',
    post: 'como-funciona-antifraude-ecommerce',
  },
  {
    term: 'Falso positivo',
    slug: 'falso-positivo',
    definition:
      'Compra legítima que o antifraude recusa por considerá-la fraude. A loja perde a venda e, muitas vezes, o cliente.',
    post: 'o-que-e-falso-positivo',
  },
  {
    term: 'Falso negativo',
    slug: 'falso-negativo',
    definition: 'Fraude que o antifraude aprova como se fosse uma compra legítima. Costuma virar chargeback.',
    post: 'o-que-e-falso-positivo',
  },
  {
    term: 'Chargeback',
    slug: 'chargeback',
    definition:
      'Contestação de uma compra no cartão feita pelo titular junto ao banco emissor, que devolve o valor ao cliente e debita da loja.',
    post: 'o-que-e-chargeback',
  },
  {
    term: 'Autofraude',
    slug: 'autofraude',
    definition:
      'Quando o próprio titular do cartão faz a compra e depois a contesta como se não a reconhecesse. Também chamada de fraude amigável.',
    post: 'autofraude-ecommerce',
  },
  {
    term: '3DS (3-D Secure)',
    slug: '3ds',
    definition:
      'Protocolo em que o banco emissor autentica o comprador durante o pagamento com cartão, com ou sem uma etapa de confirmação.',
    post: '3ds-autenticacao-ecommerce',
  },
  {
    term: 'Taxa de aprovação',
    slug: 'taxa-de-aprovacao',
    definition: 'Porcentagem das tentativas de pagamento que terminam aprovadas.',
    post: 'taxa-de-aprovacao-cartao',
  },
  {
    term: 'MED (Mecanismo Especial de Devolução)',
    slug: 'med',
    definition:
      'RASCUNHO: definir em 1 a 2 frases o mecanismo do Pix para devolução de valores em caso de fraude, conferindo no regulamento do Banco Central.',
    post: 'med-pix-o-que-e',
  },
  {
    term: 'Pix',
    slug: 'pix',
    definition: 'Meio de pagamento instantâneo criado e operado pelo Banco Central do Brasil.',
  },
  {
    term: 'Análise manual',
    slug: 'analise-manual',
    definition:
      'Revisão de um pedido por uma pessoa antes da aprovação, usada quando o sistema automático não tem segurança para decidir.',
  },
  {
    term: 'Banco emissor',
    slug: 'banco-emissor',
    definition: 'Instituição que emitiu o cartão do comprador e que autoriza ou recusa cada transação feita com ele.',
  },
  {
    term: 'Adquirente',
    slug: 'adquirente',
    definition:
      'Empresa que processa as transações com cartão em nome da loja e repassa os valores recebidos, descontadas as taxas.',
  },
  {
    term: 'Gateway de pagamento',
    slug: 'gateway-de-pagamento',
    definition: 'Tecnologia que conecta o checkout da loja às adquirentes e aos meios de pagamento.',
  },
  {
    term: 'Orquestração de pagamentos',
    slug: 'orquestracao-de-pagamentos',
    definition:
      'Camada que distribui cada transação entre diferentes gateways, adquirentes ou provedores para aumentar a aprovação e reduzir custos.',
  },
  {
    term: 'PCI DSS',
    slug: 'pci-dss',
    definition:
      'Padrão de segurança das bandeiras de cartão que define como empresas devem armazenar, processar e transmitir dados de cartão.',
  },
]

export const dataset = {
  title: '[TÍTULO DA PESQUISA]: taxa de falso positivo encontrada no Modo Sombra por segmento',
  slug: 'falso-positivo-modo-sombra-por-segmento',
  summary: 'RASCUNHO: principal achado em 1 a 2 frases, com o número. [DADO + FONTE]',
  period: '[PERÍODO, ex.: jan–set/2026]',
  methodology:
    'RASCUNHO: descrever a amostra (número de lojas e transações), os segmentos, o período, como o falso positivo foi medido no Modo Sombra e como os dados foram agregados e anonimizados. Nenhum lojista pode ser identificável.',
  figures: [
    { label: '[SEGMENTO 1]', value: '[DADO]', unit: '%' },
    { label: '[SEGMENTO 2]', value: '[DADO]', unit: '%' },
    { label: 'Média geral', value: '[DADO]', unit: '%' },
  ],
}
