/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL — CIDADELA ROLEPLAY
 * ============================================================================
 *  Tudo que muda com frequência (links, IP, números, imagens, SEO) fica aqui.
 *  Nenhum componente deve ter link ou informação do servidor "hardcoded".
 *
 *  Convenções:
 *   - Valores com "SEU-" são placeholders: troque pelos dados reais.
 *   - String vazia ("") esconde o item correspondente no site (ex.: uma rede social).
 * ============================================================================
 */

export type StatItem = {
  /** Valor final da contagem animada. */
  value: number;
  /** Texto exibido depois do número (ex.: "+", "%", "/7"). */
  suffix?: string;
  label: string;
};

export const siteConfig = {
  name: "Cidadela Roleplay",
  shortName: "Cidadela",
  /**
   * true: o Hero usa o logo completo com a tagline "#O RETORNO".
   * false: usa só o adesivo "Cidadela" (sem tagline).
   */
  heroLogoWithTagline: true,

  /** Domínio final do site (usado em SEO, Open Graph e canonical). */
  url: "https://www.seudominio.com.br",

  seo: {
    title: "Cidadela Roleplay — Viva sua história",
    description:
      "Cidadela Roleplay é um servidor de GTA RP brasileiro no FiveM. Economia movida pelos jogadores, profissões, organizações e uma comunidade que leva o roleplay a sério. Entre na cidade e construa sua história.",
    keywords: [
      "Cidadela Roleplay",
      "Cidadela RP",
      "GTA RP",
      "GTA Roleplay",
      "servidor FiveM",
      "FiveM",
      "roleplay brasileiro",
      "cidade FiveM",
    ],
  },

  /** Conexão com o servidor FiveM. */
  server: {
    /**
     * IP ou domínio usado no F8 (`connect ...`) e no botão JOGAR AGORA (`fivem://connect/...`).
     * Ex.: "jogar.seudominio.com.br" ou "123.45.67.89:30120".
     * Enquanto estiver vazio, JOGAR AGORA leva o visitante para o guia "Como jogar".
     */
    ip: "jogar.cidadelaroleplay.com",
    /** Texto mostrado no lugar do IP enquanto ele não estiver configurado. */
    ipPlaceholder: "SEU-IP-AQUI",
    /**
     * O que os botões JOGAR AGORA fazem:
     *  "discord" = abre o Discord oficial (allowlist) em nova aba.
     *  "fivem"   = abre o FiveM direto no servidor (fivem://connect/IP), com ajuda se não abrir.
     */
    playAction: "discord" as "discord" | "fivem",
  },

  links: {
    discord: "https://discord.gg/cidadelarp",
    /** Vazio = o WhatsApp não aparece no site. */
    whatsapp: "",
    rules: "https://SEU-LINK-DAS-REGRAS",
    instagram: "https://www.instagram.com/cidadelarp",
    tiktok: "https://www.tiktok.com/@cidadelarp",
    youtube: "",
    /** Onde o jogador se candidata ao programa de criadores. Vazio = usa o Discord. */
    creatorsApply: "",

    // Links oficiais de terceiros — normalmente não precisam mudar.
    fivem: "https://fivem.net/",
    gtaSteam: "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
    gtaEpic: "https://store.epicgames.com/pt-BR/p/grand-theft-auto-v",
    gtaRockstar: "https://www.rockstargames.com/gta-v",
  },

  contact: {
    email: "contato@cidadelaroleplay.com",
    /** Só é exibido se for preenchido. */
    cnpj: "",
  },

  discord: {
    /**
     * Mostra membros/online buscando direto do convite do Discord.
     * Desligado porque o convite discord.gg/cidadelarp não respondeu (convite inválido ou expirado).
     * Quando o convite estiver ativo, troque para true.
     */
    showLiveCounts: false,
  },

  /**
   * ATENÇÃO: números de exemplo (placeholders).
   * Substitua pelos dados reais da Cidadela antes de publicar.
   */
  stats: [
    { value: 10000, suffix: "+", label: "Jogadores na comunidade" },
    { value: 24, suffix: "/7", label: "Cidade online" },
    { value: 100, suffix: "+", label: "Histórias criadas" },
    { value: 100, suffix: "%", label: "Foco no roleplay" },
  ] satisfies StatItem[],

  /**
   * Imagens opcionais. Coloque os arquivos em /public/images e informe o caminho
   * (ex.: "/images/hero.webp"). Vazio = o site usa a arte padrão da Cidadela.
   */
  images: {
    /** Foto/print cinematográfico de fundo do Hero. */
    hero: "",
    /** Imagem da seção "Quem somos" (vazio = mapa ilustrado da cidade). */
    about: "",
    /** Fundo da seção de comunidade. */
    community: "",
    /**
     * Artes "Seja nosso..." (16:9). Informe o nome base gerado por `npm run assets`
     * (ex.: "criadores/seja-streamer"). Vazio = arte padrão desenhada pelo site.
     */
    creators: {
      fotografo: "criadores/seja-fotografo",
      streamer: "criadores/seja-streamer",
      criador: "criadores/seja-criador",
    },
    /**
     * Pôsteres "DISPONÍVEL" das organizações legais (4:5), ex.: "organizacoes/rpm".
     * Para a polícia, o script também gera o brasão recortado ("organizacoes/rpm-emblema").
     */
    orgs: {
      rpm: "organizacoes/rpm",
      gtm: "organizacoes/gtm",
      grr: "organizacoes/grr",
      graer: "organizacoes/graer",
      dip: "organizacoes/dip",
      cot: "organizacoes/cot",
      hospital: "organizacoes/hospital",
      mecanica: "organizacoes/mecanica",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
