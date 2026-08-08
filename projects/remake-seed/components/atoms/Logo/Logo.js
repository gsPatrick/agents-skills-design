import styles from "./Logo.module.css";

/**
 * Wordmark — texto, não SVG.
 *
 * O original resolve o logo com um glyph dentro da própria Seed Sans: o
 * elemento é um <a> com font-size 20px / weight 300, e o wordmark sai como
 * caractere. Como o glyph não é legível por leitor de tela, o nome acessível
 * vive num <span> oculto ao lado — é literalmente o padrão do original
 * (`class="screenreader-only"`).
 *
 * Medido: box 64×20 em x=48, y=58. cor rgb(28,58,19).
 *
 * O wordmark é "Seed" com S maiúsculo seguido de um PONTO sólido — os dois
 * juntos fecham os 64px. Escrever "seed" minúsculo e sem o ponto dava 45px
 * e deslocava o menu inteiro 19px para a esquerda.
 *
 * O `aria-hidden` no glyph evita que o leitor anuncie o caractere cru.
 */
export default function Logo({ label = "Home", className = "" }) {
  return (
    <>
      <span className={`${styles.mark} ${className}`} aria-hidden="true">
        Seed
        <span className={styles.dot} />
      </span>
      <span className="screenreader-only">{label}</span>
    </>
  );
}
