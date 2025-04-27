import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Cloud, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFC]">
      <Navbar />

      <main className="flex-1">
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-10">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight text-gray-900">
                  Lift your <span className="text-violet-500">soul</span>, one conversation at a time
                </h1>
                <p className="text-xl text-gray-500 md:text-2xl/relaxed max-w-2xl mx-auto">
                  Your playful AI companion for mental wellness, providing support when you need it most.
                </p>
              </div>
              <Button className="bg-violet-500 hover:bg-violet-600 rounded-full text-lg px-8 py-6 h-auto">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden mt-8">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  fill
                  alt="SoulLift Interface"
                  className="object-cover"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-violet-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How SoulLift Helps You</h2>
              <p className="text-gray-500 md:text-xl max-w-2xl">
                Simple, playful, and effective support for your mental wellness journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                  <Smile className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold">Friendly Chats</h3>
                <p className="text-gray-500">
                  Engage in light, supportive conversations that adapt to your mood and needs
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                  <Cloud className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold">Mood Lifting</h3>
                <p className="text-gray-500">
                  Get personalized suggestions to improve your mood and emotional wellbeing
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold">Safe Space</h3>
                <p className="text-gray-500">
                  A judgment-free zone with gentle guidance to professional help when needed
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Simple, Playful, <span className="text-violet-500">Effective</span>
                  </h2>
                  <p className="text-gray-500 text-lg">
                    SoulLift creates a personalized experience that feels like chatting with a supportive friend.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center mt-1">
                        <span className="font-medium text-violet-500">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Share Your Preferences</h3>
                        <p className="text-gray-500">
                          Tell us a bit about yourself so we can personalize your experience
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center mt-1">
                        <span className="font-medium text-violet-500">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Chat Anytime</h3>
                        <p className="text-gray-500">
                          Connect with your AI companion whenever you need emotional support
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center mt-1">
                        <span className="font-medium text-violet-500">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Grow Together</h3>
                        <p className="text-gray-500">SoulLift learns and adapts to provide better support over time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative aspect-square max-w-md mx-auto">
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    fill
                    alt="SoulLift in action"
                    className="object-cover rounded-3xl"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Not Therapy, Just a <span className="text-violet-500">Friend</span>
                </h2>
                <p className="text-gray-500 text-lg">
                  SoulLift complements professional mental health services by providing emotional support in a casual,
                  accessible way.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <p className="italic text-gray-600 text-lg">
                  "We created SoulLift to be a safe space where anyone can find a moment of peace, a friendly chat, or a
                  gentle nudge toward better mental wellness."
                </p>
              </div>

              <Button className="bg-violet-500 hover:bg-violet-600 rounded-full text-lg px-8 py-6 h-auto">
                Start Lifting Your Soul
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-[#FCFCFC] border-t border-[#F0F0F0]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <span className="text-sm font-medium">SoulLift</span>
            </div>

            <p className="text-xs text-gray-500">© 2025 SoulLift. All rights reserved.</p>

            <div className="flex items-center space-x-4">
              <Link href="#" className="text-xs text-gray-500 hover:text-violet-500 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-violet-500 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-violet-500 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
