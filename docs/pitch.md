# 🎤 Pitch — AgroSat

> Roteiro de 3 a 5 minutos + perguntas difíceis com respostas honestas.
> **Regra de ouro:** não prometer IA real, NDVI real ou processamento de satélite. Vender o que existe (apoio à decisão agroclimática explicável) e tratar o resto como roadmap.

---

## Roteiro (3–5 min)

**[0:00–0:30] Problema**
> "No campo, estresse hídrico, geada e seca normalmente só são percebidos quando o dano já aconteceu. Falta uma ferramenta simples que transforme dado ambiental em decisão preventiva."

**[0:30–1:00] Solução**
> "O AgroSat é um app mobile que pega **dados climáticos e agroambientais abertos** e os transforma em um **índice de saúde da lavoura (0–100)**, em **alertas** e em uma **estimativa de safra**. É uma ferramenta de **apoio à decisão**, não só um leitor de dados."

**[1:00–1:30] Relação com a indústria espacial**
> "Usamos dados de **modelos meteorológicos que assimilam observação de satélite** (via Open-Meteo) e o conceito de **sensoriamento remoto / NDVI** como inspiração. Somos honestos: nesta versão é um **proxy agroclimático**, e a evolução é integrar NDVI real do Sentinel-2."

**[1:30–2:00] Tecnologias**
> "React Native + Expo SDK 55 + TypeScript; React Navigation; Context API + hooks; AsyncStorage; Axios com camada de serviços (batch + retry); expo-location e expo-notifications. APIs abertas Open-Meteo e NASA. Arquitetura em camadas."

**[2:00–3:00] Demonstração ao vivo**
> Dashboard (indicadores + gráfico de saúde) → Lavouras (busca/filtro/ordenação) → Adicionar lavoura com **"Usar minha localização" (GPS)** → Detalhe (índice de saúde + **estimativa de safra** + clima + previsão + alertas) → **notificação local** numa lavoura crítica → Dark mode → Favoritos.

**[3:00–3:40] Modelo heurístico de saúde**
> "O índice é um **modelo heurístico transparente**: umidade do solo + balanço hídrico (chuva − evapotranspiração) + estresse térmico → score 0–100 e um **proxy de NDVI** 0–1. Totalmente **explicável** — mostramos por que está 'crítico'."

**[3:40–4:10] Limitações honestas**
> "Sendo transparentes: **não é IA** (é regra), **não é NDVI medido** (é proxy climático), **não processamos imagens de satélite** ainda e as notificações são **locais** (sem backend). Optamos por um MVP **funcional e honesto**."

**[4:10–4:40] Próximos passos**
> "Roadmap: NDVI real com Sentinel-2; mapa de calor por talhão; backend com PostGIS; push remoto; estimativa de safra com séries históricas; validação com dados de campo."

**[4:40–5:00] Fechamento**
> "AgroSat: dado espacial e climático aberto virando **decisão no campo**, alinhado aos ODS 2, 13 e 9. Honesto no que entrega, claro no que evolui."

---

## Perguntas difíceis e respostas

**1. Isso é IA de verdade?**
Não. É um **modelo heurístico baseado em regras**, com pesos sobre variáveis agroclimáticas observadas. A vantagem é ser 100% explicável. A regra está isolada em `cropHealthService`, então trocar por um modelo de ML é direto — é o próximo passo.

**2. Isso é NDVI real?**
Não. NDVI real exige bandas espectrais NIR/Red de satélite. Temos um **proxy de NDVI**: um índice agroclimático inspirado no NDVI, derivado de umidade do solo e balanço hídrico. Rotulamos como "proxy" no app e no README de propósito.

**3. Vocês usam satélite de verdade?**
Indiretamente: consumimos dados de modelos que **assimilam** observação de satélite (Open-Meteo) e usamos a NASA como contexto espacial. **Não processamos imagens de satélite** nesta versão — isso é roadmap (Sentinel-2).

**4. Qual a função da NASA APOD?**
É um **elemento de contexto/engajamento espacial** (imagem astronômica do dia), assumidamente complementar. Não alimenta o índice. Se preferirem, removemos — está isolada no `nasaService`.

**5. Como o índice de saúde é calculado?**
Janela de 7 dias: balanço hídrico = precipitação − evapotranspiração de referência (ET₀ FAO); umidade do solo (0–1 cm) atual; estresse térmico (calor/geada). Pesos combinam isso num score 0–100 e num proxy de NDVI 0–1. Tudo em `cropHealthService.ts`.

**6. Como vocês validaram esse índice?**
Hoje é validação por **plausibilidade agronômica** (déficit hídrico e calor → score menor). Não temos dataset de campo rotulado — por isso chamamos de heurística, não de modelo validado. Validação com dados reais é roadmap.

**7. Por que não tem backend?**
Escopo de MVP mobile e prazo. Tudo roda no cliente com APIs abertas, o que garante rodar **sem cadastro** na correção. A camada de serviços já está isolada para, no futuro, apontar para um backend (Spring Boot/PostGIS, como sugerido).

**8. Como funcionam as notificações?**
São **notificações locais** (expo-notifications), disparadas no aparelho quando uma lavoura entra em estado crítico, com anti-spam por sessão. **Não** é push remoto (isso exigiria backend e build standalone) — está no roadmap.

**9. O app funciona offline?**
Favoritos e lavouras adicionadas persistem em AsyncStorage e abrem offline. Os dados climáticos são online; cache offline do clima é uma melhoria mapeada.

**10. Roda em Android, iOS e Web?**
Mesma base Expo. Testamos **Web** e **Android (Expo Go)**. iOS roda pela mesma base; [preencher: testado/não testado em hardware].

**11. Como isso ajuda o agricultor na prática?**
Concentra numa tela o que hoje está espalhado: saúde relativa de cada talhão, risco climático dos próximos dias e uma estimativa de perda. Ajuda a **priorizar** onde agir (irrigar, antecipar colheita) antes do dano.

**12. Qual seria a evolução mais importante?**
Integrar **NDVI real do Sentinel-2** — sai do proxy climático para sensoriamento espectral de verdade. Em seguida, um backend para histórico e um modelo de ML treinado para substituir a heurística.
