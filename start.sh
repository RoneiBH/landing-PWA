#!/bin/bash

# Script de inicialização para TechFix Pro PWA
# Uso: ./start.sh [opções]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
 ████████╗███████╗ ██████╗██╗  ██╗███████╗██╗██╗  ██╗    ██████╗ ██████╗  ██████╗ 
 ╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔════╝██║╚██╗██╔╝    ██╔══██╗██╔══██╗██╔═══██╗
    ██║   █████╗  ██║     ███████║█████╗  ██║ ╚███╔╝     ██████╔╝██████╔╝██║   ██║
    ██║   ██╔══╝  ██║     ██╔══██║██╔══╝  ██║ ██╔██╗     ██╔═══╝ ██╔══██╗██║   ██║
    ██║   ███████╗╚██████╗██║  ██║██║     ██║██╔╝ ██╗    ██║     ██║  ██║╚██████╔╝
    ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ 
EOF
echo -e "${NC}"

log "🔧 Iniciando TechFix Pro PWA..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale Node.js 16+ primeiro."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    error "Node.js 16+ requerido. Versão atual: $(node -v)"
    exit 1
fi

log "✅ Node.js $(node -v) encontrado"

# Verificar se está no diretório correto
if [ ! -f "index.html" ] || [ ! -f "manifest.json" ]; then
    error "Arquivos do projeto não encontrados. Certifique-se de estar no diretório correto."
    exit 1
fi

log "✅ Arquivos do projeto encontrados"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    log "📦 Instalando dependências..."
    npm install
fi

# Gerar ícones se não existirem
if [ ! -d "icons" ] || [ ! -f "icons/icon-192x192.png" ]; then
    log "🎨 Gerando ícones PWA..."
    npm run generate-icons
fi

# Verificar certificados HTTPS
HTTPS_AVAILABLE=false
if [ -f "localhost.pem" ] && [ -f "localhost-key.pem" ]; then
    HTTPS_AVAILABLE=true
    log "✅ Certificados HTTPS encontrados"
else
    warn "⚠️  Certificados HTTPS não encontrados"
    info "Para PWA completo, gere certificados com:"
    info "  1. Instalar mkcert: https://github.com/FiloSottile/mkcert"
    info "  2. Executar: mkcert localhost 127.0.0.1 ::1"
fi

# Processar argumentos
HTTPS_MODE=false
TUNNEL_MODE=false
TEST_MODE=false
HELP_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --https|-s)
            HTTPS_MODE=true
            shift
            ;;
        --tunnel|-t)
            TUNNEL_MODE=true
            shift
            ;;
        --test)
            TEST_MODE=true
            shift
            ;;
        --help|-h)
            HELP_MODE=true
            shift
            ;;
        *)
            warn "Opção desconhecida: $1"
            shift
            ;;
    esac
done

# Mostrar ajuda
if [ "$HELP_MODE" = true ]; then
    echo -e "${BLUE}Uso: ./start.sh [opções]${NC}"
    echo ""
    echo "Opções:"
    echo "  --https, -s    Iniciar com HTTPS (requer certificados)"
    echo "  --tunnel, -t   Criar tunnel público com ngrok"
    echo "  --test         Executar testes após iniciar"
    echo "  --help, -h     Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./start.sh                 # HTTP simples"
    echo "  ./start.sh --https         # HTTPS local"
    echo "  ./start.sh --tunnel        # Tunnel público"
    echo "  ./start.sh --https --test  # HTTPS + testes"
    exit 0
fi

# Função para iniciar servidor
start_server() {
    if [ "$HTTPS_MODE" = true ] && [ "$HTTPS_AVAILABLE" = true ]; then
        log "🔒 Iniciando servidor HTTPS..."
        npm run start:https &
        SERVER_PID=$!
        sleep 3
        
        if kill -0 $SERVER_PID 2>/dev/null; then
            log "✅ Servidor HTTPS rodando em: https://localhost:3443"
            log "📱 Para mobile: https://$(hostname -I | awk '{print $1}'):3443"
        else
            error "Falha ao iniciar servidor HTTPS"
            exit 1
        fi
    else
        log "🌐 Iniciando servidor HTTP..."
        npm run start &
        SERVER_PID=$!
        sleep 3
        
        if kill -0 $SERVER_PID 2>/dev/null; then
            log "✅ Servidor HTTP rodando em: http://localhost:3000"
            warn "⚠️  PWA terá funcionalidade limitada sem HTTPS"
        else
            error "Falha ao iniciar servidor HTTP"
            exit 1
        fi
    fi
}

# Função para criar tunnel
start_tunnel() {
    if ! command -v ngrok &> /dev/null; then
        warn "ngrok não encontrado. Instalando..."
        npm install -g ngrok
    fi
    
    log "🌍 Criando tunnel público..."
    ngrok http 3000 &
    NGROK_PID=$!
    sleep 5
    
    # Tentar obter URL do ngrok
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io')
    if [ ! -z "$NGROK_URL" ]; then
        log "✅ Tunnel criado: $NGROK_URL"
        log "📱 Use esta URL para testar em qualquer dispositivo"
    else
        warn "Não foi possível obter URL do tunnel"
    fi
}

# Função para executar testes
run_tests() {
    log "🧪 Executando testes PWA..."
    sleep 5  # Aguardar servidor estabilizar
    
    if [ "$HTTPS_MODE" = true ]; then
        npm run test
    else
        warn "Testes completos requerem HTTPS"
        info "Execute: ./start.sh --https --test"
    fi
}

# Função de cleanup
cleanup() {
    log "🧹 Limpando processos..."
    
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$NGROK_PID" ]; then
        kill $NGROK_PID 2>/dev/null || true
    fi
    
    # Matar processos por porta
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3443 | xargs kill -9 2>/dev/null || true
    lsof -ti:4040 | xargs kill -9 2>/dev/null || true
    
    log "👋 Servidor encerrado"
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Iniciar servidor
start_server

# Criar tunnel se solicitado
if [ "$TUNNEL_MODE" = true ]; then
    start_tunnel
fi

# Executar testes se solicitado
if [ "$TEST_MODE" = true ]; then
    run_tests
fi

# Mostrar informações finais
echo ""
log "🎉 TechFix Pro PWA está rodando!"
echo ""
info "📋 Próximos passos:"
info "  1. Abrir navegador na URL mostrada acima"
info "  2. Pressionar F12 > Application > Manifest"
info "  3. Testar instalação do PWA"
info "  4. Executar Lighthouse audit"
echo ""
info "🛠️  Comandos úteis:"
info "  Ctrl+C          - Parar servidor"
info "  npm run test    - Executar testes"
info "  npm run validate - Validar PWA"
echo ""

# Aguardar indefinidamente
log "⏳ Servidor rodando... Pressione Ctrl+C para parar"
wait
