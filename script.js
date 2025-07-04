// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")

mobileMenuBtn.addEventListener("click", () => {
  if (mobileMenu.style.display === "block") {
    mobileMenu.style.display = "none"
  } else {
    mobileMenu.style.display = "block"
  }
})

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.style.display = "none"
  })
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.style.display = "none"
  }
})

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]')
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = targetSection.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Contact Form Submission
const contactForm = document.getElementById("contactForm")
const successModal = document.getElementById("successModal")
const modalClose = document.getElementById("modalClose")

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(contactForm)
  const formObject = {}
  formData.forEach((value, key) => {
    formObject[key] = value
  })

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    // Show success modal
    successModal.style.display = "flex"

    // Reset form
    contactForm.reset()

    // You can add actual form submission logic here
    console.log("Form submitted:", formObject)
  }, 1000)
})

// Close modal
modalClose.addEventListener("click", () => {
  successModal.style.display = "none"
})

// Close modal when clicking outside
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.style.display = "none"
  }
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.boxShadow = "none"
  }
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up")
    }
  })
}, observerOptions)

// Observe elements for animation
const animateElements = document.querySelectorAll(".service-card, .about-feature, .gallery-item, .contact-item")
animateElements.forEach((el) => {
  observer.observe(el)
})

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]')
phoneInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (value.length >= 7) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
    }
    e.target.value = value
  })
})

// Email validation
const emailInputs = document.querySelectorAll('input[type="email"]')
emailInputs.forEach((input) => {
  input.addEventListener("blur", (e) => {
    const email = e.target.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email && !emailRegex.test(email)) {
      e.target.style.borderColor = "#ef4444"
      e.target.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"
    } else {
      e.target.style.borderColor = "#d1d5db"
      e.target.style.boxShadow = "none"
    }
  })
})

// Lazy loading for images
const images = document.querySelectorAll("img")
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.style.opacity = "0"
      img.style.transition = "opacity 0.3s"

      img.onload = () => {
        img.style.opacity = "1"
      }

      imageObserver.unobserve(img)
    }
  })
})

images.forEach((img) => {
  imageObserver.observe(img)
})

// Add loading state to buttons
const buttons = document.querySelectorAll('button[type="submit"]')
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (button.form && button.form.checkValidity()) {
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
      button.disabled = true

      setTimeout(() => {
        button.innerHTML = "Solicitar Orçamento Gratuito"
        button.disabled = false
      }, 2000)
    }
  })
})

// Console welcome message
console.log(`
🔧 TechFix Pro - Assistência Técnica Especializada
📱 Entre em contato: (11) 99999-9999
📧 E-mail: contato@techfixpro.com.br
🌐 Site desenvolvido com HTML, CSS e JavaScript puro
`)

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("SW registrado com sucesso:", registration)

      // Verificar atualizações
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // Nova versão disponível
            showUpdateNotification()
          }
        })
      })
    } catch (error) {
      console.log("Erro ao registrar SW:", error)
    }
  })
}

// PWA Install Prompt
let deferredPrompt
const installPrompt = document.getElementById("installPrompt")
const installBtn = document.getElementById("installBtn")
const dismissBtn = document.getElementById("dismissBtn")

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevenir o prompt automático
  e.preventDefault()
  deferredPrompt = e

  // Mostrar nosso prompt customizado
  setTimeout(() => {
    if (!localStorage.getItem("pwa-dismissed")) {
      installPrompt.style.display = "block"
    }
  }, 5000) // Mostrar após 5 segundos
})

// Botão de instalar
installBtn?.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("PWA instalado")
    } else {
      console.log("PWA não instalado")
    }

    deferredPrompt = null
    installPrompt.style.display = "none"
  }
})

// Botão de dispensar
dismissBtn?.addEventListener("click", () => {
  installPrompt.style.display = "none"
  localStorage.setItem("pwa-dismissed", "true")
})

// Detectar quando o app é instalado
window.addEventListener("appinstalled", () => {
  console.log("PWA foi instalado")
  installPrompt.style.display = "none"

  // Mostrar notificação de sucesso
  if ("serviceWorker" in navigator && "Notification" in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("TechFix Pro Instalado!", {
        body: "Agora você pode acessar nossos serviços rapidamente.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
      })
    })
  }
})

// Detectar modo standalone (PWA instalado)
if (window.matchMedia("(display-mode: standalone)").matches) {
  console.log("Executando como PWA")
  document.body.classList.add("pwa-mode")
}

// Detectar status de conexão
function updateOnlineStatus() {
  const offlineIndicator = document.getElementById("offlineIndicator") || createOfflineIndicator()

  if (navigator.onLine) {
    offlineIndicator.classList.remove("show")
  } else {
    offlineIndicator.classList.add("show")
  }
}

function createOfflineIndicator() {
  const indicator = document.createElement("div")
  indicator.id = "offlineIndicator"
  indicator.className = "offline-indicator"
  indicator.innerHTML = '<i class="fas fa-wifi"></i> Você está offline. Algumas funcionalidades podem estar limitadas.'
  document.body.appendChild(indicator)
  return indicator
}

window.addEventListener("online", updateOnlineStatus)
window.addEventListener("offline", updateOnlineStatus)

// Verificar status inicial
updateOnlineStatus()

// Notificações Push (se suportado)
async function requestNotificationPermission() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      console.log("Permissão de notificação concedida")

      // Registrar para push notifications
      const registration = await navigator.serviceWorker.ready

      // Aqui você adicionaria a lógica para se inscrever em push notifications
      // com seu servidor de push notifications
    }
  }
}

// Solicitar permissão após interação do usuário
document.addEventListener(
  "click",
  () => {
    if (!localStorage.getItem("notification-requested")) {
      requestNotificationPermission()
      localStorage.setItem("notification-requested", "true")
    }
  },
  { once: true },
)

// Background Sync para formulário
async function handleFormSubmissionOffline(formData) {
  if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
    try {
      // Salvar dados no IndexedDB
      await saveFormDataForSync(formData)

      // Registrar background sync
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register("contact-form")

      console.log("Formulário será enviado quando a conexão for restaurada")
      return true
    } catch (error) {
      console.log("Erro ao configurar background sync:", error)
      return false
    }
  }
  return false
}

// Função auxiliar para salvar dados (implementação simplificada)
async function saveFormDataForSync(formData) {
  // Aqui você implementaria o salvamento no IndexedDB
  localStorage.setItem("pending-form-data", JSON.stringify(formData))
}

// Mostrar notificação de atualização
function showUpdateNotification() {
  const notification = document.createElement("div")
  notification.className = "update-notification"
  notification.innerHTML = `
    <div class="update-content">
      <i class="fas fa-sync-alt"></i>
      <span>Nova versão disponível!</span>
      <button onclick="window.location.reload()" class="btn btn-primary btn-sm">Atualizar</button>
    </div>
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 10000)
}

// Analytics para PWA
function trackPWAUsage() {
  // Rastrear instalação
  if (window.matchMedia("(display-mode: standalone)").matches) {
    console.log("PWA Usage: Standalone mode")
  }

  // Rastrear origem
  const source = new URLSearchParams(window.location.search).get("utm_source")
  if (source) {
    console.log("PWA Source:", source)
  }
}

// Executar analytics
trackPWAUsage()

console.log("🚀 PWA TechFix Pro carregado com sucesso!")
