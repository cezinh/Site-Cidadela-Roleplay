/**
 * Textos do site. Separados dos componentes para facilitar revisão e edição.
 * (Links e números ficam em src/config/siteConfig.ts.)
 */
import type { LucideIcon } from "lucide-react";
import {
  Bird,
  Camera,
  Cat,
  Clapperboard,
  Cross,
  Dog,
  Mic,
  PawPrint,
  Search,
  Skull,
  Wrench,
} from "lucide-react";

/**
 * Links da navegação, na ordem das seções da página.
 * `compact: false` = some da barra em telas médias (continua no menu mobile e no rodapé).
 */
export const navLinks = [
  { id: "inicio", label: "Início", compact: false },
  { id: "sobre", label: "Sobre nós", compact: true },
  { id: "organizacoes", label: "Organizações", compact: true },
  { id: "como-jogar", label: "Como jogar", compact: true },
  { id: "criadores", label: "Criadores", compact: true },
  { id: "comunidade", label: "Comunidade", compact: true },
  { id: "regras", label: "Regras", compact: true },
  { id: "contato", label: "Contato", compact: false },
] as const;

export const hero = {
  tag: "Servidor de GTA RP",
  titleLines: ["Viva a cidade.", "Construa sua história."],
  description:
    "Um servidor de GTA RP feito para quem quer muito mais do que jogar: viver um personagem, fazer nome na cidade e deixar a sua marca.",
};

export const about = {
  tag: "Quem somos",
  title: "Na Cidadela ninguém é figurante.",
  paragraphs: [
    "A Cidadela Roleplay é uma cidade no FiveM construída em cima de uma ideia simples: ela só está viva quando cada pessoa tem uma história para contar. Do primeiro emprego ao comando de uma organização, cada escolha deixa marca e muda a cidade para todo mundo.",
    "Aqui a economia é movida pelos próprios jogadores, as profissões têm peso e as organizações disputam espaço com estratégia, não só com força. A cidade evolui junto com a comunidade, atualização após atualização.",
    "Chegou agora? Ninguém começa grande. Mas todo mundo começa com a mesma liberdade de decidir quem vai ser.",
  ],
  mapCaption: "Rota traçada até a sua primeira história.",
};

export const howToPlay = {
  tag: "Guia rápido",
  title: "Como jogar na Cidadela?",
  intro: "Quatro passos entre você e a cidade. Se travar em algum deles, a comunidade no Discord ajuda.",
  steps: {
    gta: {
      title: "Tenha o GTA V original",
      text: "Você precisa do Grand Theft Auto V original instalado no PC, comprado na Steam, na Epic Games ou na Rockstar.",
      cta: "Adquirir GTA V",
    },
    fivem: {
      title: "Instale o FiveM",
      text: "O FiveM é a plataforma de servidores multiplayer do GTA V. É por ele que você entra na Cidadela.",
      cta: "Baixar FiveM",
    },
    discord: {
      title: "Entre na comunidade",
      text: "Entre no nosso Discord e siga as instruções da allowlist. Lá você também encontra as regras e o suporte da cidade.",
      cta: "Entrar no Discord",
    },
    connect: {
      title: "Conecte-se à cidade",
      text: "Allowlist aprovada? Clique em jogar agora ou abra o FiveM, aperte F8 e cole o comando de conexão.",
      cta: "Jogar agora",
    },
  },
};

export const community = {
  tag: "Comunidade oficial",
  title: "Faça parte da comunidade.",
  intro:
    "Entre para a comunidade oficial da Cidadela Roleplay e acompanhe novidades, eventos, atualizações e comunicados em primeira mão.",
  discord: {
    title: "Discord oficial",
    text: "É onde tudo acontece fora da cidade: allowlist, anúncios, suporte, eventos e a galera de sempre.",
    cta: "Entrar no Discord",
  },
  whatsapp: {
    title: "Canal no WhatsApp",
    text: "Avisos de manutenção, atualizações e comunicados importantes direto no seu celular.",
    cta: "Entrar no WhatsApp",
  },
};

export type CreatorKey = "fotografo" | "streamer" | "criador";

export type CreatorRole = {
  key: CreatorKey;
  /** Palavra grande da arte ("Seja nosso ___"). */
  title: string;
  /** Texto do botão de candidatura. */
  cta: string;
  description: string;
  tasks: string[];
  icon: LucideIcon;
  featured?: boolean;
};

/** Ordem de exibição: fotógrafo, streamer (destaque, no centro) e criador. */
export const creators = {
  tag: "Programa de criadores",
  title: "Mostre a cidade para o mundo.",
  intro: "Fotógrafos, streamers e criadores têm espaço na Cidadela. Escolha o seu papel e mostre a cidade.",
  applyNote: "As inscrições são feitas pelo nosso Discord oficial.",
  roles: [
    {
      key: "fotografo",
      title: "Fotógrafo",
      cta: "Quero ser fotógrafo",
      description: "Transforme os melhores momentos da cidade em imagens que rodam as redes oficiais da Cidadela.",
      tasks: ["Cobre eventos e momentos marcantes", "Produz prints e ensaios de personagens", "Abastece as redes oficiais"],
      icon: Camera,
    },
    {
      key: "streamer",
      title: "Streamer",
      cta: "Quero ser streamer",
      description:
        "Transmita suas histórias ao vivo, traga sua comunidade para a cidade e faça parte do time que coloca a Cidadela em evidência.",
      tasks: ["Transmite o seu roleplay ao vivo", "Leva novos jogadores para a cidade", "Faz parte do time oficial de criadores"],
      icon: Mic,
      featured: true,
    },
    {
      key: "criador",
      title: "Criador",
      cta: "Quero ser criador",
      description: "Cortes, edições e vídeos curtos: conte as histórias da Cidadela no TikTok, no Reels e no YouTube.",
      tasks: ["Edita cortes e clipes da cidade", "Cria vídeos para TikTok, Reels e YouTube", "Espalha as histórias da Cidadela"],
      icon: Clapperboard,
    },
  ] satisfies CreatorRole[],
};

export type OrgKey = "rpm" | "gtm" | "grr" | "graer" | "dip" | "cot";

export type PoliceUnit = {
  key: OrgKey;
  acronym: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const legalOrgs = {
  tag: "Organizações legais",
  title: "Quem mantém a cidade de pé.",
  intro:
    "Segurança, saúde e serviço. As organizações legais da Cidadela estão com vagas abertas: escolha onde você quer fazer a diferença.",
  status: "Disponível",
  cta: "Quero fazer parte",
  unitsLabel: "Unidades especializadas",
  police: {
    key: "rpm",
    acronym: "RPM",
    name: "Rádio Patrulha",
    description:
      "A base do policiamento da cidade. Patrulhamento, atendimento de ocorrências e a porta de entrada para as unidades especializadas.",
    icon: Dog,
  } satisfies PoliceUnit,
  units: [
    {
      key: "gtm",
      acronym: "GTM",
      name: "Grupamento Tático de Motocicletas",
      description: "Agilidade sobre duas rodas: acompanhamentos, bloqueios e apoio rápido pelo trânsito da cidade.",
      icon: Cat,
    },
    {
      key: "grr",
      acronym: "GRR",
      name: "Grupamento de Resposta Rápida",
      description: "Os primeiros a chegar nas ocorrências de maior risco, com resposta imediata e coordenada.",
      icon: PawPrint,
    },
    {
      key: "graer",
      acronym: "GRAER",
      name: "Grupamento Aéreo",
      description: "Apoio aéreo às operações: monitoramento, acompanhamentos e resgates vistos do alto.",
      icon: Bird,
    },
    {
      key: "dip",
      acronym: "DIP",
      name: "Departamento Investigativo",
      description: "Investigação e inteligência para os casos que exigem paciência até chegar à verdade.",
      icon: Search,
    },
    {
      key: "cot",
      acronym: "COT",
      name: "Operações Táticas",
      description: "A unidade de elite, acionada nas operações de alto risco e nas situações mais críticas.",
      icon: Skull,
    },
  ] satisfies PoliceUnit[],
  servicesIntro: {
    tag: "Saúde e serviços",
    title: "Salve vidas ou tune carros.",
    text: "O Hospital e a Cidadela Customs também estão com vagas abertas. Duas carreiras que a cidade inteira precisa.",
  },
  services: [
    {
      key: "hospital",
      title: "Hospital",
      subtitle: "Saúde e resgate",
      description:
        "Atendimentos, resgates e plantões. Para quem quer seguir carreira na saúde e ser a pessoa que a cidade chama quando tudo dá errado.",
      bullets: ["Atendimento e resgate por toda a cidade", "Plantões e carreira na medicina", "Treinamento para quem está chegando"],
      icon: Cross,
    },
    {
      key: "mecanica",
      title: "Mecânica",
      subtitle: "Cidadela Customs",
      description:
        "Reparos, tunagem e personalização. A oficina oficial da cidade, onde cada carro sai do jeito que o dono imaginou.",
      bullets: ["Reparos e guincho pela cidade", "Tunagem e personalização", "Oficina própria: Cidadela Customs"],
      icon: Wrench,
    },
  ] as const,
};

export const rules = {
  tag: "Antes de entrar",
  title: "Conheça as regras.",
  text: "Antes de entrar na cidade, conheça as regras e diretrizes da Cidadela Roleplay. Elas existem para que todo mundo tenha uma boa história para contar.",
  cta: "Ler regras",
};

export const footer = {
  description:
    "Servidor de GTA RP brasileiro no FiveM. Uma cidade feita por quem joga, para quem quer viver uma história de verdade.",
  disclaimer:
    "A Cidadela Roleplay não é afiliada à Rockstar Games nem à Take-Two Interactive. GTA V e Grand Theft Auto são marcas registradas da Take-Two Interactive.",
};
