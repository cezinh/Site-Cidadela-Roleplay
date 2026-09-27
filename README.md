# Cidadela Roleplay — site oficial

React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # gera a versão final em /dist
npm run preview    # testa a versão final
```

## Onde mudar as coisas

| O quê | Arquivo |
| --- | --- |
| Links (Discord, WhatsApp, regras, redes), IP do servidor, e-mail, números, SEO, imagens | `src/config/siteConfig.ts` |
| Textos das seções | `src/content/content.ts` |
| Cores, fontes, espaçamentos (tokens) | `src/styles/global.css` |

Valores com `SEU-` são placeholders. String vazia (`""`) esconde o item.

## Imagens

Os originais ficam em `assets-src/`. Depois de trocar ou adicionar um arquivo, rode:

```bash
npm run assets
```

O script gera as versões otimizadas (WebP/AVIF em vários tamanhos) em `public/images/`,
os favicons e a imagem de compartilhamento (`public/og-image.jpg`).

- `assets-src/criadores/` — artes "Seja nosso..." (16:9)
- `assets-src/redes/` — artes de Instagram, Discord e TikTok (16:9)
- `assets-src/organizacoes/` — pôsteres "Disponível" (4:5). Para `rpm`, `gtm`, `grr`, `graer`, `dip` e `cot`
  o brasão é recortado automaticamente do centro do pôster.

Depois é só apontar o nome no `siteConfig.images` (ex.: `"organizacoes/rpm"`).

## Publicar

Rode `npm run build` e envie a pasta `dist/` para qualquer hospedagem estática
(Vercel, Netlify, Cloudflare Pages, hospedagem própria). Antes, ajuste `url` no `siteConfig`
para o domínio final (usado no SEO e na imagem de compartilhamento).
