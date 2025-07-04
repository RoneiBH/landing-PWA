# Script PowerShell para Windows
# Uso: .\start.ps1 [opções]

param(
    [switch]$Https,
    [switch]$Tunnel,
    [switch]$Test,
    [switch]$Help
)

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

function Write-Log {
    param($Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Warn {
    param($Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

# Banner
Write-Host @"
 ████████╗███████╗ ██████╗██╗  ██╗███████╗██╗██╗  ██╗    ██████╗ ██████╗  ██████╗ 
 ╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔════╝██║╚██╗██╔╝    ██╔══██╗██╔══██╗██╔═══██╗
    ██║   █████╗  ██║     ███████║█████╗  ██║ ╚███╔╝     ██████╔╝██████╔╝██║   ██║
    ██║   ██╔══╝  ██║     ██╔══██║██╔══╝  ██║ ██╔██╗     ██╔═══╝ ██╔══██╗██║   ██║
    ██║   ███████╗╚██████╗██║  ██║██║     ██║██╔╝ ██╗    ██║     ██║  ██║╚██████╔╝
    ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ 
"@ -ForegroundColor Blue

if ($Help) {
    Write-Host "Uso: .\start.ps1 [opções]" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Opções:"
    Write-Host "  -Https     Iniciar com HTTPS (requer certificados)"
    Write-Host "  -Tunnel    Criar tunnel público com ngrok"
    Write-Host "  -Test      Executar testes após iniciar"
    Write-Host "  -Help      Mostrar esta ajuda"
    Write-Host ""
    Write-Host "Exemplos:"
    Write-Host "  .\start.ps1                # HTTP simples"
    Write-Host "  .\start.ps1 -Https         # HTTPS local"
    Write-Host "  .\start.ps1 -Tunnel        # Tunnel público"
    Write-Host "  .\start.ps1 -Https -Test   # HTTPS + testes"
    exit 0
}

Write-Log "🔧 Iniciando TechFix Pro PWA..."

# Verificar Node.js
try {
    $nodeVersion = node -v
    Write-Log "✅ Node.js $nodeVersion encontrado"
} catch {
    Write-Error "Node.js não encontrado. Instale Node.js 16+ primeiro."
    exit 1
}

# Verificar arquivos do projeto
if (!(Test-Path "index.html") -or !(Test-Path "manifest.json")) {
    Write-Error "Arquivos do projeto não encontrados. Certifique-se de estar no diretório correto."
    exit 1
}

Write-Log "✅ Arquivos do projeto encontrados"

# Instalar dependências se necessário
if (!(Test-Path "node_modules")) {
    Write-Log "📦 Instalando dependências..."
    npm install
}

# Gerar ícones se não existirem
if (!(Test-Path "icons") -or !(Test-Path "icons/icon-192x192.png")) {
    Write-Log "🎨 Gerando ícones PWA..."
    npm run generate-icons
}

# Verificar certificados HTTPS
$httpsAvailable = (Test-Path "localhost.pem") -and (Test-Path "localhost-key.pem")

if ($httpsAvailable) {
    Write-Log "✅ Certificados HTTPS encontrados"
} else {
    Write-Warn "⚠️  Certificados HTTPS não encontrados"
    Write-Info "Para PWA completo, gere certificados com:"
    Write-Info "  1. Instalar mkcert: choco install mkcert"
    Write-Info "  2. Executar: mkcert localhost 127.0.0.1 ::1"
}

# Iniciar servidor
if ($Https -and $httpsAvailable) {
    Write-Log "🔒 Iniciando servidor HTTPS..."
    $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start:https" -PassThru -NoNewWindow
    Start-Sleep 3
    
    if (!$serverProcess.HasExited) {
        Write-Log "✅ Servidor HTTPS rodando em: https://localhost:3443"
        $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"})[0].IPAddress
        Write-Log "📱 Para mobile: https://$localIP:3443"
    } else {
        Write-Error "Falha ao iniciar servidor HTTPS"
        exit 1
    }
} else {
    Write-Log "🌐 Iniciando servidor HTTP..."
    $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start" -PassThru -NoNewWindow
    Start-Sleep 3
    
    if (!$serverProcess.HasExited) {
        Write-Log "✅ Servidor HTTP rodando em: http://localhost:3000"
        Write-Warn "⚠️  PWA terá funcionalidade limitada sem HTTPS"
    } else {
        Write-Error "Falha ao iniciar servidor HTTP"
        exit 1
    }
}

# Criar tunnel se solicitado
if ($Tunnel) {
    Write-Log "🌍 Criando tunnel público..."
    $ngrokProcess = Start-Process -FilePath "npx" -ArgumentList "ngrok", "http", "3000" -PassThru -NoNewWindow
    Start-Sleep 5
    
    try {
        $ngrokUrl = (Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels").tunnels[0].public_url
        Write-Log "✅ Tunnel criado: $ngrokUrl"
        Write-Log "📱 Use esta URL para testar em qualquer dispositivo"
    } catch {
        Write-Warn "Não foi possível obter URL do tunnel"
    }
}

# Executar testes se solicitado
if ($Test) {
    Write-Log "🧪 Executando testes PWA..."
    Start-Sleep 5
    
    if ($Https) {
        npm run test
    } else {
        Write-Warn "Testes completos requerem HTTPS"
        Write-Info "Execute: .\start.ps1 -Https -Test"
    }
}

# Mostrar informações finais
Write-Host ""
Write-Log "🎉 TechFix Pro PWA está rodando!"
Write-Host ""
Write-Info "📋 Próximos passos:"
Write-Info "  1. Abrir navegador na URL mostrada acima"
Write-Info "  2. Pressionar F12 > Application > Manifest"
Write-Info "  3. Testar instalação do PWA"
Write-Info "  4. Executar Lighthouse audit"
Write-Host ""
Write-Info "🛠️  Comandos úteis:"
Write-Info "  Ctrl+C          - Parar servidor"
Write-Info "  npm run test    - Executar testes"
Write-Info "  npm run validate - Validar PWA"
Write-Host ""

Write-Log "⏳ Servidor rodando... Pressione Ctrl+C para parar"

# Aguardar até Ctrl+C
try {
    while ($true) {
        Start-Sleep 1
    }
} finally {
    # Cleanup
    Write-Log "🧹 Limpando processos..."
    
    if ($serverProcess -and !$serverProcess.HasExited) {
        $serverProcess.Kill()
    }
    
    if ($ngrokProcess -and !$ngrokProcess.HasExited) {
        $ngrokProcess.Kill()
    }
    
    Write-Log "👋 Servidor encerrado"
}
