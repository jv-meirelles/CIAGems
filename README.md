# casacinteriores.com.br

Site estático (HTML/CSS/JS puro, sem build).

| Endereço | Pasta | O que é |
|---|---|---|
| `casacinteriores.com.br/` | raiz (`index.html`, `css/`, `js/`, `img/`) | Site principal da Casa C.: sobre, serviços, portfólio, produtos e contato. |
| `casacinteriores.com.br/ciagems/` | `ciagems/` | Landing page da CIA (agentes de IA para arquitetos). |

## Publicar

Envie para a raiz do domínio (`public_html`, `www` ou equivalente da hospedagem):

```
index.html   css/   js/   img/   ciagems/
```

Não precisam ir para o servidor: `Media/`, `IDENTIDADE VISUAL/`, `Logo/`, `Logomarca CASA C/` (material-fonte), `serve.ps1`, `README.md` e `.claude/`.

O site principal e a landing são independentes: cada um tem os próprios `css/`, `js/` e imagens.

## Site principal (raiz)

- **Contatos e portfólio** em `js/config.js` (WhatsApp, mensagem, Instagram e a lista de projetos).
- **Portfólio**: enquanto a lista estiver vazia, a seção mostra um convite para o Instagram. Coloque as fotos em `img/portfolio/` e adicione uma linha por projeto em `portfolio`.
- **Textos** de Sobre e Serviços estão direto no `index.html`, marcados com comentário para revisão.

## Ver localmente

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Abra http://localhost:8080 (site principal) ou http://localhost:8080/ciagems/ (landing).

## Landing CIA (`ciagems/`)

- **Links** em `ciagems/js/config.js`: checkout Kirvano, comunidade no WhatsApp e Instagram.
- **Imagens** otimizadas em `ciagems/assets/img/`, geradas a partir de `Media/`.
- **Feedback**: prints censurados em `ciagems/assets/img/feedback/feedback-01.jpg` … `feedback-31.jpg`. Para adicionar, salve o próximo número e atualize `FEEDBACK_TOTAL` em `ciagems/js/main.js`.
- **Vídeo**: `cia-fotografia-na-pratica.mov` (HEVC) com reserva `cia-fotografia-na-pratica-h264.mp4` para navegadores sem suporte a HEVC.
- Os caminhos são relativos; se alguém abrir `/ciagems` sem a barra final, a página completa a barra sozinha.
