// Servidor Node.js local para desenvolvimento
const express = require("express")
const https = require("https")
const http = require("http")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000
const HTTPS_PORT = process.env.HTTPS_PORT || 3443

// Middleware para servir arquivos estáticos
app.use(
  express.static(".", {
    setHeaders: (res, filePath) => {
      // Headers para PWA
      if (filePath.endsWith(".json")) {
        res.setHeader("Content-Type", "application/json")
      }
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript")
      }
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css")
      }

      // Headers de segurança
      res.setHeader("X-Content-Type-Options", "nosniff")
      res.setHeader("X-Frame-Options", "DENY")
      res.setHeader("X-XSS-Protection", "1; mode=block")
    },
  }),
)

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Rota para manifest.json com headers corretos
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json")
  res.sendFile(path.join(__dirname, "manifest.json"))
})

// Rota para service worker
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript")
  res.setHeader("Service-Worker-Allowed", "/")
  res.sendFile(path.join(__dirname, "sw.js"))
})

// Rota para ícones
app.get("/icons/:filename", (req, res) => {
  const filename = req.params.filename
  const iconPath = path.join(__dirname, "icons", filename)

  if (fs.existsSync(iconPath)) {
    res.sendFile(iconPath)
  } else {
    // Gerar ícone placeholder se não existir
    res.redirect(`/placeholder.svg?height=192&width=192&text=TechFix+Pro`)
  }
})

// Fallback para SPA (todas as rotas retornam index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Função para iniciar servidor HTTP
function startHTTP() {
  const server = http.createServer(app)

  server.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando em: http://localhost:${PORT}`)
    console.log(`⚠️  Para PWA completo, use HTTPS: npm run start:https`)
  })

  return server
}

// Função para iniciar servidor HTTPS
function startHTTPS() {
  try {
    // Tentar carregar certificados locais
    const options = {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    }

    const server = https.createServer(options, app)

    server.listen(HTTPS_PORT, () => {
      console.log(`🔒 Servidor HTTPS rodando em: https://localhost:${HTTPS_PORT}`)
      console.log(`✅ PWA totalmente funcional!`)
      console.log(`📱 Para testar em mobile, use: https://${getLocalIP()}:${HTTPS_PORT}`)
    })

    return server
  } catch (error) {
    console.log(`❌ Certificados HTTPS não encontrados: ${error.message}`)
    console.log(`💡 Para gerar certificados:`)
    console.log(`   1. Instalar mkcert: https://github.com/FiloSottile/mkcert`)
    console.log(`   2. Executar: mkcert localhost 127.0.0.1 ::1`)
    console.log(`   3. Ou usar: npm run start:tunnel`)

    // Fallback para HTTP
    console.log(`🔄 Iniciando servidor HTTP...`)
    return startHTTP()
  }
}

// Função para obter IP local
function getLocalIP() {
  const osInterfaces = require("os").networkInterfaces()
  for (const name of Object.keys(osInterfaces)) {
    for (const iface of osInterfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address
      }
    }
  }
  return "localhost"
}

// Função para verificar se porta está em uso
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = require("net").createServer()
    server.listen(port, () => {
      server.close(() => resolve(false))
    })
    server.on("error", () => resolve(true))
  })
}

// Função principal
async function start() {
  console.log(`🔧 TechFix Pro - Servidor de Desenvolvimento`)
  console.log(`📁 Diretório: ${__dirname}`)

  // Verificar se porta está disponível
  if (await isPortInUse(HTTPS_PORT)) {
    console.log(`⚠️  Porta ${HTTPS_PORT} em uso, tentando ${HTTPS_PORT + 1}`)
    process.env.HTTPS_PORT = HTTPS_PORT + 1
  }

  // Verificar arquivos necessários
  const requiredFiles = ["index.html", "manifest.json", "sw.js"]
  const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file))

  if (missingFiles.length > 0) {
    console.log(`❌ Arquivos não encontrados: ${missingFiles.join(", ")}`)
    console.log(`💡 Certifique-se de estar no diretório correto do projeto`)
    process.exit(1)
  }

  // Verificar ícones
  const iconsDir = path.join(__dirname, "icons")
  if (!fs.existsSync(iconsDir)) {
    console.log(`⚠️  Pasta /icons/ não encontrada`)
    console.log(`💡 Execute: npm run generate-icons`)
  }

  // Iniciar servidor
  const useHTTPS = process.argv.includes("--https") || process.env.NODE_ENV === "production"

  if (useHTTPS) {
    startHTTPS()
  } else {
    startHTTP()
  }
}

// Tratamento de erros
process.on("uncaughtException", (error) => {
  console.error("❌ Erro não tratado:", error)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promise rejeitada:", reason)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Encerrando servidor...")
  process.exit(0)
})

// Iniciar se executado diretamente
if (require.main === module) {
  start()
}

module.exports = { app, start, startHTTP, startHTTPS }
