const CACHE_NAME = "techfix-pro-v1.2.0"
const STATIC_CACHE = "techfix-static-v1.2.0"
const DYNAMIC_CACHE = "techfix-dynamic-v1.2.0"

// Arquivos para cache estático (sempre em cache)
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
]

// Arquivos para cache dinâmico (cache sob demanda)
const DYNAMIC_ASSETS = ["/placeholder.svg"]

// URLs que devem sempre buscar da rede primeiro
const NETWORK_FIRST = ["/api/", "https://api.", "https://wa.me/", "tel:", "mailto:"]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando Service Worker...")

  event.waitUntil(
    Promise.all([
      // Cache estático
      caches
        .open(STATIC_CACHE)
        .then((cache) => {
          console.log("[SW] Fazendo cache dos arquivos estáticos")
          return cache.addAll(STATIC_ASSETS)
        }),
      // Pular waiting para ativar imediatamente
      self.skipWaiting(),
    ]),
  )
})

// Ativar Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Ativando Service Worker...")

  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
                console.log("[SW] Removendo cache antigo:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),
      // Tomar controle de todas as páginas
      self.clients.claim(),
    ]),
  )
})

// Interceptar requisições
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requisições não-HTTP
  if (!request.url.startsWith("http")) {
    return
  }

  // Estratégia Network First para URLs específicas
  if (NETWORK_FIRST.some((pattern) => request.url.includes(pattern))) {
    event.respondWith(networkFirst(request))
    return
  }

  // Estratégia Cache First para recursos estáticos
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.url.includes("font-awesome")
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Estratégia Stale While Revalidate para imagens
  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Estratégia Cache First com Network Fallback para navegação
  if (request.mode === "navigate") {
    event.respondWith(cacheFirstWithNetworkFallback(request))
    return
  }

  // Estratégia padrão: Cache First
  event.respondWith(cacheFirst(request))
})

// Estratégia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)

    // Cache apenas respostas válidas
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Erro na estratégia Cache First:", error)

    // Retornar página offline para navegação
    if (request.mode === "navigate") {
      return caches.match("/")
    }

    throw error
  }
}

// Estratégia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)

    // Cache apenas respostas válidas
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Network falhou, tentando cache:", error)

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  // Buscar da rede em background
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => {
      // Ignorar erros de rede silenciosamente
    })

  // Retornar cache imediatamente se disponível, senão aguardar rede
  return cachedResponse || networkResponsePromise
}

// Estratégia Cache First com Network Fallback
async function cacheFirstWithNetworkFallback(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)

    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Erro na navegação, retornando página principal:", error)
    return caches.match("/")
  }
}

// Sincronização em background
self.addEventListener("sync", (event) => {
  console.log("[SW] Background Sync:", event.tag)

  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm())
  }
})

// Função para sincronizar formulário de contato
async function syncContactForm() {
  try {
    // Recuperar dados do formulário salvos no IndexedDB
    const formData = await getStoredFormData()

    if (formData) {
      // Tentar enviar os dados
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Remover dados salvos após envio bem-sucedido
        await clearStoredFormData()

        // Notificar o usuário
        self.registration.showNotification("TechFix Pro", {
          body: "Seu orçamento foi enviado com sucesso!",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          tag: "form-success",
        })
      }
    }
  } catch (error) {
    console.log("[SW] Erro na sincronização do formulário:", error)
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("[SW] Push recebido:", event)

  const options = {
    body: event.data ? event.data.text() : "Nova mensagem da TechFix Pro",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver Detalhes",
        icon: "/icons/action-explore.png",
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/icons/action-close.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("TechFix Pro", options))
})

// Clique em notificação
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Clique na notificação:", event)

  event.notification.close()

  if (event.action === "explore") {
    // Abrir a aplicação
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "close") {
    // Apenas fechar a notificação
    return
  } else {
    // Clique na notificação (não em ação específica)
    event.waitUntil(clients.openWindow("/"))
  }
})

// Funções auxiliares para IndexedDB (simuladas)
async function getStoredFormData() {
  // Implementar recuperação de dados do IndexedDB
  return null
}

async function clearStoredFormData() {
  // Implementar limpeza de dados do IndexedDB
  return true
}

// Mensagem de boas-vindas
console.log("[SW] TechFix Pro Service Worker carregado com sucesso! 🔧")
