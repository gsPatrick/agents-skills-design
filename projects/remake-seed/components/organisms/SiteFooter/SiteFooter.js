import Logo from "@/components/atoms/Logo/Logo";
import styles from "./SiteFooter.module.css";

/**
 * SiteFooter
 *
 * Camadas:   imagem FIXA no fundo da viewport (z-index -1)
 *            → bloco escuro #10210B que a cobre
 *            → conteúdo → faixa animada (GIF)
 * Driver:    o próprio scroll revela a imagem fixa
 * Estados:   um
 *
 * Medido em 1440px, relativo ao topo do rodapé:
 *   fundo      #10210B  (rgb 16,33,11) — amostrado do pixel; o footer em si
 *              é transparente, a cor vem de um ancestral
 *   consent    64,294,640,20    14px/350
 *   input      64,329,425,52    radius 8px
 *   botão      446,329,43,52
 *   colunas    848 / 1024 / 1200, largura 176
 *   cabeçalhos y=64 e y=266     12px/500  maiúsculas
 *   GIF        0,632,1440,192
 *   copyright  0,834,1440,17    12px/350  ls −0.036px
 *
 * O manifesto tem GLYPHS INLINE entre as palavras — pipeta, [R+D] numa
 * caixa, molécula, globo. É o mesmo vocabulário do 【livro】 do eyebrow da
 * MicrobioSection: a marca conversa por pictogramas embutidos no texto
 * corrido, não por ícones alinhados numa fileira.
 *
 * O fundo é MAIS ESCURO que o --color-ink da página. O rodapé não reusa a
 * cor de marca; ele desce um degrau para fechar a página.
 */
const COLUNAS = [
  {
    titulo: "Products",
    itens: [["Shop All", "/shop"]],
  },
  {
    titulo: "About",
    itens: [
      ["Science", "/science"],
      ["Sustainability", "/sustainability"],
      ["SeedLabs", "/seedlabs"],
    ],
  },
  {
    titulo: "Inquire",
    itens: [
      ["Superfiliate", "/superfiliate"],
      ["Partner", "/partner"],
      ["Practitioners", "/practitioners"],
      ["Press", "/press"],
      ["Join", "/careers"],
    ],
  },
  {
    titulo: "Help",
    itens: [
      ["Help", "/help"],
      ["Contact", "/contact"],
      ["My Account", "/account"],
      ["International", "/international"],
    ],
  },
  {
    titulo: "Social",
    itens: [
      ["Instagram", "https://instagram.com/seed"],
      ["Twitter", "https://twitter.com/seed"],
      ["LinkedIn", "https://linkedin.com/company/seed"],
      ["Refer", "/refer"],
    ],
  },
  {
    titulo: "Legal",
    itens: [
      ["Terms + Conditions", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Accessibility", "/accessibility"],
      ["Consent Preferences", "/consent"],
    ],
  },
];

/* Os glyphs do manifesto — traço branco, 1.7 de peso, como no original. */
const Pipeta = () => (
  <svg viewBox="0 0 31 33" width="31" height="33" fill="none" aria-hidden="true">
    <path
      d="M12.08 22.1 6.87 16.89l2.08-2.08 5.21 5.21-2.08 2.08Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="m14.5 19.6 8.2-8.2a3.6 3.6 0 0 0-5.1-5.1l-8.2 8.2M9.4 22.6l-4.6 4.6a2 2 0 0 0 2.9 2.9l4.6-4.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const Molecula = () => (
  <svg viewBox="0 0 35 33" width="35" height="33" fill="none" aria-hidden="true">
    <circle cx="17.5" cy="7.3" r="6.5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="7" cy="25" r="5.4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="28" cy="25" r="5.4" stroke="currentColor" strokeWidth="1.7" />
    <path d="m12.6 12.6-3 7M22.4 12.6l3 7" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const Globo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M2 12h20M12 2c2.8 3 4.2 6.4 4.2 10S14.8 19 12 22C9.2 19 7.8 15.6 7.8 12S9.2 5 12 2Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
  </svg>
);

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      {/* Imagem presa ao fundo da VIEWPORT, atrás de tudo (z-index -1). O
          bloco escuro do rodapé desliza por cima e a revela conforme você
          chega ao fim da página.

          Medido: position fixed, bottom 0, 800px de altura, cover.

          Eu não a encontrava porque é background-image num div — varreduras
          por <img>/<video>/<mux-player> nunca a alcançariam. */}
      <div className={styles.fixedBottom} aria-hidden="true" />

      <div className={styles.slab}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <a href="/" className={styles.logo}>
            <Logo label="Home" />
          </a>

          {/* Glyphs INLINE entre as palavras — a marca fala por pictogramas
              embutidos no texto corrido, não por uma fileira de ícones. */}
          <h2 className={styles.manifesto}>
            Pioneering{" "}
            <span className={styles.glyph}>
              <Pipeta />
            </span>{" "}
            microbiome science{" "}
            <span className={styles.tag}>R+D</span>{" "}
            <span className={styles.glyph}>
              <Molecula />
            </span>{" "}
            for human and planetary health{" "}
            <span className={styles.glyph}>
              <Globo />
            </span>{" "}
            since 2016.
          </h2>

          <p className={styles.newsLead}>
            Science with Seed—nerdy reads for your inbox.
          </p>
          <p className={styles.consent}>
            By signing up you consent to receive Seed emails.
          </p>

          <form className={styles.form} action="/newsletter" method="post">
            <label htmlFor="footer-email" className="screenreader-only">
              Sign up for our Newsletter
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              className={styles.input}
              placeholder="Sign Up For Our Newsletter"
              autoComplete="email"
            />
            <button type="submit" className={styles.submit} aria-label="Subscribe">
              <svg viewBox="0 0 11 11" width="11" height="11" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>

          <p className={styles.disclaimer}>
            *These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat, cure
            or prevent any disease.
          </p>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          {COLUNAS.map((c) => (
            <div key={c.titulo} className={styles.col}>
              <h3 className={styles.colTitle}>{c.titulo}</h3>
              <ul className={styles.list}>
                {c.itens.map(([t, href]) => (
                  <li key={t}>
                    <a href={href} className={styles.link}>
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      </div>

      {/* FORA do bloco escuro: o GIF fica SOBRE a textura revelada, não
          dentro da faixa verde-escura. As letras flutuam sobre a imagem. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/footer-awaken.gif" alt="" className={styles.strip} />

      <p className={styles.copy}>© 2026 Seed (Seed Health, Inc.)</p>
    </footer>
  );
}
