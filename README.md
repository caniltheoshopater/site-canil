# Site — Canil Theos Ho Pater

Site oficial do canil em `www.caniltheoshopater.com.br`.

## Como editar o site (sem código)

Acesse: **https://www.caniltheoshopater.com.br/admin**

Faça login com sua conta GitHub. Você terá um painel com 3 seções:

1. **Filhotes Disponíveis** — adicionar, editar ou esconder filhotes
2. **Plantel** — fotos e nomes dos pais/mães
3. **Configurações do Site** — foto destaque do topo e foto da seção "O Canil"

Toda alteração feita no painel atualiza o site em ~1 minuto automaticamente.

## Estrutura técnica

- HTML/CSS/JS estático (super rápido)
- Decap CMS para edição visual
- Dados em JSON na pasta `/data`
- Imagens em `/images/uploads` (gerenciadas pelo CMS)
- Hospedagem: Netlify (build automático ao push no GitHub)
- SEO: meta tags + Schema.org LocalBusiness/PetStore + sitemap.xml
- Contato: WhatsApp (47) 92000-8177 + Instagram @caniltheoshopater

## Arquivos importantes

- `index.html` — página principal
- `styles.css` — estilos
- `site.js` — carrega filhotes/plantel dos JSONs
- `admin/config.yml` — configuração do painel de edição
- `data/*.json` — dados editáveis (filhotes, plantel, fotos)
- `netlify.toml` — configuração de hospedagem (redirects, cache)
- `sitemap.xml` + `robots.txt` — SEO
