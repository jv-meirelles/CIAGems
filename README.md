# casacinteriores.com.br

Site estático (HTML/CSS/JS puro, sem build).

| Endereço | Pasta | O que é |
|---|---|---|
| `casacinteriores.com.br/` | raiz (`index.html`, `css/`, `js/`, `img/`) | Site principal da Casa C.: sobre, serviços, portfólio e contato. |
| `casacinteriores.com.br/projetos/<projeto>/` | `projetos/` | Uma página por projeto do portfólio (abre em nova aba a partir do carrossel). |
| `casacinteriores.com.br/ciagems/` | `ciagems/` | Landing page da CIA (agentes de IA para arquitetos). |

## Publicar

Envie para a raiz do domínio (`public_html`, `www` ou equivalente da hospedagem):

```
index.html   projetos/   css/   js/   img/   ciagems/
```

Não precisam ir para o servidor: `Media/`, `IDENTIDADE VISUAL/`, `Logo/`, `Logomarca CASA C/` (material-fonte), `tools/`, `serve.ps1`, `README.md`, `.claude/` e `.impeccable/`.

O site principal e a landing são independentes: cada um tem os próprios `css/`, `js/` e imagens.

## Site principal (raiz)

- **Contatos** em `js/config.js` (WhatsApp, mensagem e Instagram).
- **Portfólio**: as fotos vêm de `Media/CASA C/03. GALERIA DE PROJETO/` (uma pasta por projeto; a foto com "CAPA" no nome é a capa). Depois de adicionar ou trocar fotos, rode:

  ```
  powershell -ExecutionPolicy Bypass -File tools/gerar-portfolio.ps1
  ```

  O script otimiza as fotos em `img/portfolio/<projeto>/`, recria `js/projects.js` e gera as páginas `projetos/<projeto>/index.html` a partir do modelo `tools/projeto-modelo.html`. Para mudar cabeçalho, contato ou rodapé das páginas de projeto, edite o modelo e rode o script com `-SoPaginas` (não reprocessa as fotos). Para um projeto novo, cadastre o nome e o local da pasta na lista `$projetos` no início do script.
- **Textos** de Sobre e Serviços estão direto no `index.html`.

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
