// Sistema avançado de prompt de instalação para mobile
class MobileInstallManager {
  constructor() {
    this.deferredPrompt = null
    this.isInstalled = false
    this.installPromptShown = false
    this.userAgent = navigator.userAgent.toLowerCase()
    this.platform = this.detectPlatform()

    this.init()
  }

  init() {
    // Detectar se já está instalado
    this.checkIfInstalled()

    // Configurar listeners
    this.setupEventListeners()

    // Mostrar prompt personalizado após delay
    setTimeout(() => {
      this.showCustomInstallPrompt()
    }, 10000) // 10 segundos após carregar
  }

  detectPlatform() {
    if (/iphone|ipad|ipod/.test(this.userAgent)) {
      return "ios"
    } else if (/android/.test(this.userAgent)) {
      if (/chrome/.test(this.userAgent)) {
        return "android-chrome"
      } else if (/samsungbrowser/.test(this.userAgent)) {
        return "android-samsung"
      } else if (/firefox/.test(this.userAgent)) {
        return "android-firefox"
      }
      return "android-other"
    }
    return "desktop"
  }

  checkIfInstalled() {
    // Verificar se está em modo standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.isInstalled = true
      console.log("PWA já está instalado")
      return
    }

    // Verificar se foi adicionado à tela inicial (iOS)
    if (window.navigator.standalone === true) {
      this.isInstalled = true
      console.log("PWA instalado no iOS")
      return
    }

    // Verificar localStorage para instalações anteriores
    if (localStorage.getItem("pwa-installed") === "true") {
      this.isInstalled = true
      return
    }
  }

  setupEventListeners() {
    // Listener para beforeinstallprompt (Android Chrome)
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("beforeinstallprompt disparado")
      e.preventDefault()
      this.deferredPrompt = e

      // Mostrar prompt customizado
      this.showInstallBanner()
    })

    // Listener para appinstalled
    window.addEventListener("appinstalled", () => {
      console.log("PWA foi instalado!")
      this.isInstalled = true
      localStorage.setItem("pwa-installed", "true")
      this.hideAllPrompts()
      this.showSuccessMessage()
    })

    // Listener para mudança de display mode
    window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
      if (e.matches) {
        this.isInstalled = true
        localStorage.setItem("pwa-installed", "true")
      }
    })
  }

  showCustomInstallPrompt() {
    // Não mostrar se já instalado ou já mostrou
    if (this.isInstalled || this.installPromptShown) {
      return
    }

    // Não mostrar se usuário já dispensou
    if (localStorage.getItem("install-prompt-dismissed") === "true") {
      return
    }

    this.installPromptShown = true

    const promptHtml = this.getPromptHTML()
    const promptElement = document.createElement("div")
    promptElement.innerHTML = promptHtml
    document.body.appendChild(promptElement.firstElementChild)

    // Configurar eventos do prompt
    this.setupPromptEvents()
  }

  getPromptHTML() {
    const instructions = this.getInstallInstructions()

    return `
      <div id="mobile-install-prompt" class="mobile-install-prompt">
        <div class="install-prompt-overlay"></div>
        <div class="install-prompt-content">
          <div class="install-prompt-header">
            <div class="install-prompt-icon">
              <img src="/icons/icon-96x96.png" alt="TechFix Pro" width="48" height="48">
            </div>
            <div class="install-prompt-title">
              <h3>Instalar TechFix Pro</h3>
              <p>Acesso rápido aos nossos serviços</p>
            </div>
            <button class="install-prompt-close" id="installPromptClose">&times;</button>
          </div>
          
          <div class="install-prompt-body">
            <div class="install-benefits">
              <div class="benefit-item">
                <span class="benefit-icon">⚡</span>
                <span>Acesso instantâneo</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">📱</span>
                <span>Ícone na tela inicial</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🔧</span>
                <span>Orçamentos rápidos</span>
              </div>
            </div>
            
            <div class="install-instructions">
              ${instructions}
            </div>
          </div>
          
          <div class="install-prompt-actions">
            <button class="install-btn-primary" id="installBtn">
              ${this.platform === "android-chrome" ? "Instalar Agora" : "Ver Como Instalar"}
            </button>
            <button class="install-btn-secondary" id="dismissBtn">Agora Não</button>
          </div>
        </div>
      </div>
    `
  }

  getInstallInstructions() {
    switch (this.platform) {
      case "ios":
        return `
          <div class="platform-instructions ios-instructions">
            <h4>📱 Como instalar no iPhone:</h4>
            <ol>
              <li>Toque no botão <strong>Compartilhar</strong> (□↑)</li>
              <li>Selecione <strong>"Adicionar à Tela de Início"</strong></li>
              <li>Toque em <strong>"Adicionar"</strong></li>
            </ol>
          </div>
        `

      case "android-chrome":
        return `
          <div class="platform-instructions android-instructions">
            <h4>🤖 Instalação automática disponível!</h4>
            <p>Clique em "Instalar Agora" ou procure o banner na parte inferior da tela.</p>
          </div>
        `

      case "android-samsung":
        return `
          <div class="platform-instructions samsung-instructions">
            <h4>📱 Como instalar no Samsung:</h4>
            <ol>
              <li>Toque no menu <strong>(≡)</strong></li>
              <li>Selecione <strong>"Adicionar página à"</strong></li>
              <li>Escolha <strong>"Tela inicial"</strong></li>
            </ol>
          </div>
        `

      default:
        return `
          <div class="platform-instructions generic-instructions">
            <h4>📱 Como instalar:</h4>
            <ol>
              <li>Toque no menu do navegador</li>
              <li>Procure por <strong>"Adicionar à tela inicial"</strong></li>
              <li>Confirme a instalação</li>
            </ol>
          </div>
        `
    }
  }

  setupPromptEvents() {
    const installBtn = document.getElementById("installBtn")
    const dismissBtn = document.getElementById("dismissBtn")
    const closeBtn = document.getElementById("installPromptClose")

    installBtn?.addEventListener("click", () => {
      this.handleInstallClick()
    })

    dismissBtn?.addEventListener("click", () => {
      this.dismissPrompt()
    })

    closeBtn?.addEventListener("click", () => {
      this.dismissPrompt()
    })

    // Fechar ao clicar fora
    document.querySelector(".install-prompt-overlay")?.addEventListener("click", () => {
      this.dismissPrompt()
    })
  }

  async handleInstallClick() {
    console.log("Botão de instalação clicado", this.platform, !!this.deferredPrompt)

    if (this.platform === "android-chrome" && this.deferredPrompt) {
      try {
        // Usar prompt nativo do Chrome
        console.log("Mostrando prompt nativo...")
        this.deferredPrompt.prompt()

        const { outcome } = await this.deferredPrompt.userChoice
        console.log(`Usuário ${outcome} a instalação`)

        if (outcome === "accepted") {
          this.hideAllPrompts()
          this.showSuccessMessage()
        }

        this.deferredPrompt = null
      } catch (error) {
        console.error("Erro ao mostrar prompt:", error)
        this.showDetailedInstructions()
      }
    } else {
      // Para outras plataformas, mostrar instruções detalhadas
      console.log("Mostrando instruções detalhadas para:", this.platform)
      this.showDetailedInstructions()
    }
  }

  showDetailedInstructions() {
    // Fechar modal atual
    this.hideAllPrompts()

    // Criar modal com instruções detalhadas
    const instructionsModal = this.createInstructionsModal()
    document.body.appendChild(instructionsModal)
  }

  createInstructionsModal() {
    const modal = document.createElement("div")
    modal.id = "detailed-instructions-modal"
    modal.className = "mobile-install-prompt"

    const instructions = this.getDetailedInstructions()

    modal.innerHTML = `
      <div class="install-prompt-overlay"></div>
      <div class="install-prompt-content">
        <div class="install-prompt-header">
          <div class="install-prompt-title">
            <h3>Como Instalar TechFix Pro</h3>
            <p>Siga os passos para seu dispositivo</p>
          </div>
          <button class="install-prompt-close" onclick="this.closest('.mobile-install-prompt').remove()">&times;</button>
        </div>
        
        <div class="install-prompt-body">
          ${instructions}
        </div>
        
        <div class="install-prompt-actions">
          <button class="install-btn-primary" onclick="this.closest('.mobile-install-prompt').remove()">
            Entendi
          </button>
        </div>
      </div>
    `

    return modal
  }

  getDetailedInstructions() {
    switch (this.platform) {
      case "ios":
        return `
          <div class="platform-instructions ios-instructions">
            <div class="instruction-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Abrir Menu Compartilhar</h4>
                <p>Toque no botão <strong>Compartilhar</strong> (□↑) na parte inferior da tela</p>
              </div>
            </div>
            
            <div class="instruction-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Encontrar Opção</h4>
                <p>Role para baixo e procure <strong>"Adicionar à Tela de Início"</strong></p>
              </div>
            </div>
            
            <div class="instruction-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Confirmar</h4>
                <p>Toque em <strong>"Adicionar"</strong> no canto superior direito</p>
              </div>
            </div>
            
            <div class="alert warning">
              <strong>⚠️ Importante:</strong> Só funciona no Safari. Não funciona no Chrome ou outros navegadores no iPhone.
            </div>
          </div>
        `

      case "android-samsung":
        return `
        <div class="platform-instructions samsung-instructions">
          <div class="instruction-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Abrir Menu</h4>
              <p>Toque no menu <strong>(≡)</strong> no canto inferior direito</p>
            </div>
          </div>
          
          <div class="instruction-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Adicionar Página</h4>
              <p>Selecione <strong>"Adicionar página à"</strong></p>
            </div>
          </div>
          
          <div class="instruction-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Escolher Destino</h4>
              <p>Escolha <strong>"Tela inicial"</strong></p>
            </div>
          </div>
        </div>
      `

      case "android-chrome":
        return `
        <div class="platform-instructions android-instructions">
          <div class="alert info">
            <strong>💡 Dica:</strong> Se o prompt automático não apareceu, tente estas opções:
          </div>
          
          <div class="instruction-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Menu do Chrome</h4>
              <p>Toque nos <strong>3 pontinhos (⋮)</strong> no canto superior direito</p>
            </div>
          </div>
          
          <div class="instruction-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Instalar App</h4>
              <p>Procure por <strong>"Instalar app"</strong> ou <strong>"Adicionar à tela inicial"</strong></p>
            </div>
          </div>
          
          <div class="instruction-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Confirmar</h4>
              <p>Toque em <strong>"Instalar"</strong> ou <strong>"Adicionar"</strong></p>
            </div>
          </div>
        </div>
      `

      default:
        return `
        <div class="platform-instructions generic-instructions">
          <div class="instruction-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Menu do Navegador</h4>
              <p>Toque no menu do seu navegador (geralmente ⋮ ou ≡)</p>
            </div>
          </div>
          
          <div class="instruction-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Procurar Opção</h4>
              <p>Procure por <strong>"Adicionar à tela inicial"</strong>, <strong>"Instalar"</strong> ou <strong>"Adicionar atalho"</strong></p>
            </div>
          </div>
          
          <div class="instruction-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Confirmar</h4>
              <p>Confirme a instalação</p>
            </div>
          </div>
        </div>
      `
    }
  }

  dismissPrompt() {
    this.hideAllPrompts()
    localStorage.setItem("install-prompt-dismissed", "true")

    // Permitir mostrar novamente após 7 dias
    setTimeout(
      () => {
        localStorage.removeItem("install-prompt-dismissed")
      },
      7 * 24 * 60 * 60 * 1000,
    )
  }

  hideAllPrompts() {
    const prompt = document.getElementById("mobile-install-prompt")
    if (prompt) {
      prompt.remove()
    }
  }

  showInstallBanner() {
    // Banner discreto na parte inferior
    if (document.getElementById("install-banner")) {
      return // Já existe
    }

    const banner = document.createElement("div")
    banner.id = "install-banner"
    banner.className = "install-banner"
    banner.innerHTML = `
      <div class="banner-content">
        <img src="/icons/icon-48x48.png" alt="TechFix Pro" width="32" height="32">
        <div class="banner-text">
          <strong>TechFix Pro</strong>
          <small>Adicionar à tela inicial</small>
        </div>
        <button class="banner-install-btn" id="bannerInstallBtn">Instalar</button>
        <button class="banner-close-btn" id="bannerCloseBtn">&times;</button>
      </div>
    `

    document.body.appendChild(banner)

    // Eventos do banner
    document.getElementById("bannerInstallBtn")?.addEventListener("click", () => {
      this.handleInstallClick()
    })

    document.getElementById("bannerCloseBtn")?.addEventListener("click", () => {
      banner.remove()
    })

    // Auto-hide após 10 segundos
    setTimeout(() => {
      if (banner.parentNode) {
        banner.remove()
      }
    }, 10000)
  }

  showSuccessMessage() {
    const success = document.createElement("div")
    success.className = "install-success"
    success.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✅</div>
        <div class="success-text">
          <strong>TechFix Pro instalado!</strong>
          <small>Agora você pode acessar rapidamente da sua tela inicial</small>
        </div>
      </div>
    `

    document.body.appendChild(success)

    // Remover após 5 segundos
    setTimeout(() => {
      success.remove()
    }, 5000)
  }

  // Método público para forçar prompt
  forceShowPrompt() {
    localStorage.removeItem("install-prompt-dismissed")
    this.installPromptShown = false
    this.showCustomInstallPrompt()
  }

  // Método para verificar se pode instalar
  canInstall() {
    return !this.isInstalled && (this.deferredPrompt || this.platform !== "desktop")
  }
}

// CSS para os prompts
const installPromptCSS = `
.mobile-install-prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.install-prompt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.install-prompt-content {
  position: relative;
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.install-prompt-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  gap: 1rem;
}

.install-prompt-icon img {
  border-radius: 12px;
}

.install-prompt-title h3 {
  margin: 0 0 0.25rem 0;
  color: #111827;
  font-size: 1.125rem;
}

.install-prompt-title p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.install-prompt-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.install-prompt-body {
  padding: 0 1.5rem 1rem;
}

.install-benefits {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.benefit-icon {
  font-size: 1.25rem;
}

.install-instructions {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.install-instructions h4 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 0.875rem;
}

.install-instructions ol {
  margin: 0;
  padding-left: 1.25rem;
  color: #374151;
  font-size: 0.875rem;
}

.install-instructions li {
  margin-bottom: 0.25rem;
}

.install-prompt-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
}

.install-btn-primary {
  flex: 1;
  background: #ea580c;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.install-btn-primary:hover {
  background: #c2410c;
}

.install-btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.install-btn-secondary:hover {
  background: #e5e7eb;
}

.install-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.banner-content img {
  border-radius: 8px;
}

.banner-text {
  flex: 1;
}

.banner-text strong {
  display: block;
  color: #111827;
  font-size: 0.875rem;
}

.banner-text small {
  color: #6b7280;
  font-size: 0.75rem;
}

.banner-install-btn {
  background: #ea580c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.banner-close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.install-success {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  background: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 8px;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

.success-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.success-icon {
  font-size: 1.5rem;
}

.success-text strong {
  display: block;
  color: #065f46;
  font-size: 0.875rem;
}

.success-text small {
  color: #047857;
  font-size: 0.75rem;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .install-prompt-content {
    margin: 1rem;
    max-width: none;
  }
  
  .install-prompt-actions {
    flex-direction: column;
  }
}

.instruction-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #ea580c;
}

.step-number {
  background: #ea580c;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1rem;
}

.step-content p {
  margin: 0;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.alert.info {
  background: #dbeafe;
  border: 1px solid #3b82f6;
  color: #1e40af;
}

.alert.warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
}
`

// Adicionar CSS ao documento
const styleSheet = document.createElement("style")
styleSheet.textContent = installPromptCSS
document.head.appendChild(styleSheet)

// Inicializar o gerenciador
const mobileInstallManager = new MobileInstallManager()

// Exportar para uso global
window.MobileInstallManager = mobileInstallManager
