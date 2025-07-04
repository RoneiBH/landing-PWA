# 🔧 TechFix Pro - PWA Landing Page

Progressive Web App para assistência técnica especializada em notebooks.

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 16+ instalado
- Git instalado
- Navegador moderno (Chrome, Edge, Firefox)

### 📦 Instalação Rápida

\`\`\`bash
# 1. Clonar/baixar o projeto
git clone <seu-repositorio> techfix-pro
cd techfix-pro

# 2. Instalar dependências (opcional - para testes automatizados)
npm install

# 3. Rodar servidor local
npm start
\`\`\`

### 🌐 Métodos de Servidor Local

#### **Método 1: Serve (Recomendado)**
\`\`\`bash
# Instalar serve globalmente
npm install -g serve

# Rodar com HTTPS (necessário para PWA)
serve -s . -l 3000 --ssl-cert

# Ou sem SSL (funcionalidade limitada)
serve -s . -l 3000
\`\`\`

#### **Método 2: Python**
\`\`\`bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
\`\`\`

#### **Método 3: Node.js Nativo**
\`\`\`bash
# Usar o servidor incluído
node server.js
\`\`\`

#### **Método 4: Live Server (VS Code)**
\`\`\`bash
# Instalar extensão Live Server no VS Code
# Clicar com botão direito em index.html > "Open with Live Server"
\`\`\`

### 🔒 HTTPS Local (Necessário para PWA)

#### **Opção 1: mkcert (Recomendado)**
\`\`\`bash
# Instalar mkcert
# Windows (Chocolatey)
choco install mkcert

# macOS (Homebrew)
brew install mkcert

# Linux
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Gerar certificados
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Usar com serve
serve -s . -l 3000 --ssl-cert localhost.pem --ssl-key localhost-key.pem
\`\`\`

#### **Opção 2: ngrok (Tunnel)**
\`\`\`bash
# Instalar ngrok
npm install -g ngrok

# Em um terminal, rodar servidor local
serve -s . -l 3000

# Em outro terminal, criar tunnel HTTPS
ngrok http 3000

# Usar a URL https://xxx.ngrok.io fornecida
\`\`\`

#### **Opção 3: Netlify Dev**
\`\`\`bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Rodar localmente com HTTPS
netlify dev
\`\`\`

### 📁 Estrutura do Projeto

\`\`\`
techfix-pro/
├── index.html              # Página principal
├── manifest.json           # Manifest PWA
├── sw.js                   # Service Worker
├── styles.css              # Estilos principais
├── script.js               # JavaScript principal
├── server.js               # Servidor Node.js local
├── package.json            # Dependências
├── README.md               # Este arquivo
├── icons/                  # Ícones PWA
│   ├── icon-16x16.png
│   ├── icon-32x32.png
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── ...
├── scripts/                # Scripts utilitários
│   ├── generate-icons.js   # Gerador de ícones
│   └── pwa-test-automation.js
└── test-reports/           # Relatórios de teste
\`\`\`

### 🛠️ Scripts Disponíveis

\`\`\`bash
# Rodar servidor local
npm start

# Gerar ícones PWA
npm run generate-icons

# Executar testes automatizados
npm run test

# Validar PWA
npm run validate

# Build para produção
npm run build
\`\`\`

### 🧪 Testando o PWA

#### **1. Verificação Básica**
1. Abrir `https://localhost:3000`
2. Pressionar `F12` (DevTools)
3. Ir para aba `Application`
4. Verificar `Manifest` e `Service Workers`

#### **2. Teste de Instalação**
1. Procurar ícone de instalação na barra de endereços
2. Ou ir em Menu > "Instalar TechFix Pro"
3. Confirmar instalação

#### **3. Teste Offline**
1. DevTools > Network > Offline
2. Recarregar página
3. Deve funcionar normalmente

#### **4. Lighthouse Audit**
1. DevTools > Lighthouse
2. Selecionar "Progressive Web App"
3. Clicar "Generate report"
4. Score deve ser ≥ 90

### 🔧 Troubleshooting

#### **Problema: PWA não instala**
\`\`\`bash
# Verificar HTTPS
curl -I https://localhost:3000

# Verificar manifest
curl https://localhost:3000/manifest.json

# Verificar service worker
# DevTools > Application > Service Workers
\`\`\`

#### **Problema: Ícones não carregam**
\`\`\`bash
# Gerar ícones se não existirem
npm run generate-icons

# Verificar se existem
ls -la icons/

# Testar URL diretamente
curl -I https://localhost:3000/icons/icon-192x192.png
\`\`\`

#### **Problema: Service Worker não registra**
\`\`\`bash
# Limpar cache
# DevTools > Application > Storage > Clear storage

# Verificar console por erros
# DevTools > Console
\`\`\`

#### **Problema: HTTPS não funciona**
\`\`\`bash
# Verificar certificados
ls -la *.pem

# Regenerar certificados
mkcert localhost 127.0.0.1

# Ou usar ngrok
ngrok http 3000
\`\`\`

### 🌐 URLs de Teste

Após rodar localmente, testar estas URLs:

- **Página Principal:** `https://localhost:3000`
- **Manifest:** `https://localhost:3000/manifest.json`
- **Service Worker:** `https://localhost:3000/sw.js`
- **Ícone Principal:** `https://localhost:3000/icons/icon-192x192.png`

### 📱 Teste em Dispositivos Móveis

#### **Método 1: Mesmo WiFi**
\`\`\`bash
# Descobrir IP local
# Windows
ipconfig

# macOS/Linux
ifconfig

# Acessar de dispositivo móvel
https://192.168.1.XXX:3000
\`\`\`

#### **Método 2: ngrok**
\`\`\`bash
ngrok http 3000
# Usar URL fornecida no dispositivo móvel
\`\`\`

#### **Método 3: Netlify Dev**
\`\`\`bash
netlify dev
# Compartilhar URL gerada
\`\`\`

### 🚀 Deploy para Produção

#### **Netlify**
\`\`\`bash
# Instalar CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir .
\`\`\`

#### **Vercel**
\`\`\`bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel --prod
\`\`\`

#### **GitHub Pages**
\`\`\`bash
# Fazer push para repositório GitHub
# Ir em Settings > Pages
# Selecionar branch main
\`\`\`

### 📊 Monitoramento

#### **Logs do Service Worker**
\`\`\`javascript
// No DevTools Console
navigator.serviceWorker.getRegistrations().then(console.log)
\`\`\`

#### **Status PWA**
\`\`\`javascript
// Verificar se é PWA instalado
window.matchMedia('(display-mode: standalone)').matches
\`\`\`

#### **Cache Status**
\`\`\`javascript
// Ver caches disponíveis
caches.keys().then(console.log)
\`\`\`

### 🎯 Próximos Passos

1. **Rodar localmente** com HTTPS
2. **Testar instalação** do PWA
3. **Validar com Lighthouse**
4. **Testar em dispositivos móveis**
5. **Deploy para produção**

### 📞 Suporte

Se encontrar problemas:

1. Verificar logs no console do navegador
2. Usar o guia de troubleshooting acima
3. Executar testes automatizados: `npm run test`
4. Verificar issues conhecidas no repositório

---

**🎉 Pronto! Seu PWA TechFix Pro está rodando localmente!**
