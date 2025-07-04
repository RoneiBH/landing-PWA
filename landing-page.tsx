import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Laptop,
  Wrench,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  Zap,
  HardDrive,
  Monitor,
  Cpu,
  Battery,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AssistenciaTecnicaLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Laptop className="h-8 w-8 text-orange-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">TechFix Pro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#services" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Serviços
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Sobre
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Contato
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    Especialistas em Notebooks
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                    Assistência Técnica Especializada em Notebooks
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Mais de 10 anos de experiência em manutenção e reparo de notebooks. Diagnóstico gratuito, orçamento
                    sem compromisso e garantia em todos os serviços.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar Agora
                  </Button>
                  <Button variant="outline" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Solicitar Orçamento
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Diagnóstico Gratuito
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Garantia de 90 dias
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Atendimento Rápido
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Técnico+Especializado+Reparando+Notebook"
                  width="600"
                  height="400"
                  alt="Técnico especializado reparando notebook com ferramentas profissionais"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Nossos Serviços</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Oferecemos soluções completas para todos os problemas do seu notebook
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Instalação+SSD+Notebook"
                    width="400"
                    height="200"
                    alt="Instalação de SSD em notebook"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <HardDrive className="h-10 w-10 text-orange-600" />
                  <CardTitle>Troca de HD/SSD</CardTitle>
                  <CardDescription>
                    Upgrade e substituição de discos rígidos e SSDs para melhor performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Migração de dados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Instalação do sistema
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Otimização completa
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Upgrade+Memória+RAM"
                    width="400"
                    height="200"
                    alt="Upgrade de memória RAM em notebook"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <Cpu className="h-10 w-10 text-orange-600" />
                  <CardTitle>Troca de Memória RAM</CardTitle>
                  <CardDescription>Upgrade de memória para melhorar a velocidade e multitarefa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Análise de compatibilidade
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Instalação profissional
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Teste de estabilidade
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Reparo+Tela+Notebook"
                    width="400"
                    height="200"
                    alt="Reparo de tela de notebook"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <Monitor className="h-10 w-10 text-orange-600" />
                  <CardTitle>Reparo de Tela</CardTitle>
                  <CardDescription>Substituição de telas LCD, LED e touch screen danificadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Telas originais
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Calibração de cores
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Garantia estendida
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Troca+Bateria+Notebook"
                    width="400"
                    height="200"
                    alt="Troca de bateria de notebook"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <Battery className="h-10 w-10 text-orange-600" />
                  <CardTitle>Troca de Bateria</CardTitle>
                  <CardDescription>Substituição de baterias com perda de autonomia</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Baterias originais
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Teste de capacidade
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Calibração do sistema
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Limpeza+Manutenção+Notebook"
                    width="400"
                    height="200"
                    alt="Limpeza e manutenção interna de notebook"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <Zap className="h-10 w-10 text-orange-600" />
                  <CardTitle>Limpeza e Manutenção</CardTitle>
                  <CardDescription>Limpeza interna, troca de pasta térmica e manutenção preventiva</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Limpeza completa
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Pasta térmica premium
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Teste de temperatura
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Formatação+Sistema+Notebook"
                    width="400"
                    height="200"
                    alt="Formatação e instalação de sistema em notebook"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <Wrench className="h-10 w-10 text-orange-600" />
                  <CardTitle>Formatação e Instalação</CardTitle>
                  <CardDescription>Formatação, instalação de sistema operacional e programas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Backup de dados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Sistema original
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Programas essenciais
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 w-fit">
                    Experiência Comprovada
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                    Por que escolher a TechFix Pro?
                  </h2>
                  <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Somos especialistas em manutenção de notebooks com mais de uma década de experiência no mercado.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Garantia Estendida</h3>
                      <p className="text-sm text-gray-600">90 dias de garantia em todos os serviços realizados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Atendimento Rápido</h3>
                      <p className="text-sm text-gray-600">Diagnóstico em até 24h e reparo expresso disponível</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Peças Originais</h3>
                      <p className="text-sm text-gray-600">Utilizamos apenas peças originais e de qualidade</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Técnicos Certificados</h3>
                      <p className="text-sm text-gray-600">Equipe especializada e constantemente atualizada</p>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=400&width=550&text=Oficina+Técnica+Profissional+TechFix"
                width="550"
                height="400"
                alt="Oficina técnica profissional com bancadas organizadas e equipamentos modernos"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Nossos Trabalhos</h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Veja alguns dos reparos que realizamos com excelência
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="space-y-2">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Antes+Depois+Tela+Quebrada"
                  width="400"
                  height="300"
                  alt="Antes e depois: reparo de tela quebrada"
                  className="rounded-lg object-cover shadow-md"
                />
                <p className="text-sm text-gray-600 text-center">Reparo de tela LCD danificada</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Limpeza+Interna+Notebook"
                  width="400"
                  height="300"
                  alt="Limpeza interna completa de notebook"
                  className="rounded-lg object-cover shadow-md"
                />
                <p className="text-sm text-gray-600 text-center">Limpeza interna e troca de pasta térmica</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Upgrade+SSD+Performance"
                  width="400"
                  height="300"
                  alt="Upgrade de SSD para melhor performance"
                  className="rounded-lg object-cover shadow-md"
                />
                <p className="text-sm text-gray-600 text-center">Upgrade de HD para SSD</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Entre em Contato</h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Solicite seu orçamento gratuito ou tire suas dúvidas conosco
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="mb-6">
                  <Image
                    src="/placeholder.svg?height=250&width=400&text=Nossa+Oficina+TechFix+Pro"
                    width="400"
                    height="250"
                    alt="Interior da oficina TechFix Pro com bancadas e equipamentos"
                    className="rounded-lg object-cover shadow-md w-full"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <Phone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefone</h3>
                    <p className="text-gray-600">(11) 99999-9999</p>
                    <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 18h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">E-mail</h3>
                    <p className="text-gray-600">contato@techfixpro.com.br</p>
                    <p className="text-sm text-gray-500">Resposta em até 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Endereço</h3>
                    <p className="text-gray-600">Rua das Tecnologias, 123</p>
                    <p className="text-sm text-gray-500">Centro, São Paulo - SP</p>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Solicite seu Orçamento</CardTitle>
                  <CardDescription>Preencha o formulário e entraremos em contato em breve</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="Seu nome" />
                    <Input placeholder="Seu telefone" />
                  </div>
                  <Input placeholder="Seu e-mail" />
                  <Input placeholder="Modelo do notebook" />
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Descreva o problema do seu notebook"
                  />
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Solicitar Orçamento Gratuito</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Seu notebook com problema?
                </h2>
                <p className="max-w-[600px] text-orange-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Não perca mais tempo! Entre em contato agora e receba um diagnóstico gratuito.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Phone className="mr-2 h-4 w-4" />
                  Ligar Agora: (11) 99999-9999
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          <Laptop className="h-5 w-5 text-orange-600" />
          <p className="text-xs text-gray-600">© 2024 TechFix Pro. Todos os direitos reservados.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
            Política de Privacidade
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
            Garantia
          </Link>
        </nav>
      </footer>
    </div>
  )
}
