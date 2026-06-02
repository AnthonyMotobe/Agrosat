# ✅ Checklist de entrega — AgroSat

## Repositório / GitHub
- [ ] Repositório GitHub criado (público) e isolado só do AgroSat
- [ ] `git push` feito na branch principal
- [ ] **`node_modules` NÃO está no repositório** (conferir no GitHub)
- [ ] Clonado em pasta limpa: `npm install && npm start` sobe sem erro
- [ ] Link do repositório no README e no formulário de entrega

## README
- [ ] Descrição, problema, solução e relação espacial (honesta)
- [ ] ODS 2, 9 e 13
- [ ] Funcionalidades listadas
- [ ] Tecnologias (só as que existem no projeto)
- [ ] Instruções de execução (Web, Android, iOS)
- [ ] Seção de limitações honestas
- [ ] Roadmap
- [ ] **Nome + RM** de todos os integrantes
- [ ] **Prints reais** adicionados em `docs/screenshots/`

## Execução
- [ ] Testado na **Web** (`npm run web`)
- [ ] Testado no **Android** (Expo Go / emulador) + print
- [ ] Testado no **iOS** OU limitação declarada honestamente

## Funcionalidades (revisar uma a uma)
- [ ] Dashboard com indicadores e gráfico
- [ ] Lista de lavouras (busca, filtro, ordenação)
- [ ] Adicionar lavoura por cidade (geocoding)
- [ ] Adicionar lavoura por **GPS** ("Usar minha localização")
- [ ] Detalhe: índice de saúde, **estimativa de safra**, clima, previsão, alertas
- [ ] **Notificação local** ao abrir lavoura crítica (em device)
- [ ] Favoritos (persistência)
- [ ] Configurações (tema claro/escuro/sistema)
- [ ] Persistência local (favoritos, lavouras, tema)

## Discurso (anti-"maquiagem")
- [ ] Nenhuma menção a "IA real", "NDVI real" ou "processamos satélite"
- [ ] "Modelo heurístico" e "proxy de NDVI" explícitos no app e README
- [ ] Limitações declaradas

## Validação técnica
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npx expo-doctor` sem problemas
- [ ] `npx expo export --platform web` builda

## Apresentação
- [ ] Roteiro de pitch ensaiado (`docs/pitch.md`)
- [ ] Respostas difíceis treinadas
- [ ] Vídeo/prints de backup caso a internet falhe no dia
