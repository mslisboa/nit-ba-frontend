import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Saída standalone: artefato de servidor mínimo para o container
     (ver Dockerfile, estágio runtime). */
  output: "standalone",

  /* Recursos padrão do Next 16 preservados do template. */
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
