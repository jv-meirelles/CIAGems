# Landing page CIA

Página estática (HTML/CSS/JS puro, sem build). Para publicar, envie apenas:

```
index.html  css/  js/  assets/
```

As pastas `IDENTIDADE VISUAL`, `Logo`, `Media` e `Zip` são material-fonte e **não** precisam ir para o servidor.

## Ver localmente

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Abra http://localhost:8080 (abrir o `index.html` direto pelo arquivo não carrega o vídeo corretamente em todos os navegadores).

## Configuração — `js/config.js`

| Campo | Status |
|---|---|
| `linkPagamento` | ✅ Kirvano configurado (todos os botões "Comprar agora") |
| `linkComunidade` | ✅ Comunidade no WhatsApp (único canal de dúvidas e contato com a equipe) |
| `instagram` | ✅ @cia.gems (link no rodapé) |

## Mídia

- **Vídeo**: `assets/video/cia-fotografia-na-pratica.mov` é o vídeo da pasta `Media` (codec HEVC). Navegadores sem suporte a HEVC (Chrome/Firefox em boa parte do Windows e Android) usam automaticamente `cia-fotografia-na-pratica-h264.mp4` (TAKE 2 da mesma gravação, em H.264). Para usar um único arquivo universal, exporte o vídeo final em **MP4 H.264** e substitua os dois arquivos.
- **Imagens**: versões otimizadas (máx. 1280 px, JPEG) em `assets/img/`, geradas a partir de `Media/`.
- **Feedback**: prints de `Media/FEEDBACK` com os telefones censurados, em `assets/img/feedback/feedback-01.jpg` … `feedback-13.jpg`. Para adicionar mais, salve o print censurado com o próximo número e atualize `FEEDBACK_TOTAL` em `js/main.js`.
- **Comparadores**: um por agente (Fotografia, Novo Olhar, Aprimorar, Moodboard, Mood Light, Humanizar). As imagens vêm das pastas de cada agente em `Media/`; para trocar, basta substituir os arquivos com o mesmo nome em `assets/img/`. Os demais pares de Fotografia ficam na galeria ("Mais resultados").
