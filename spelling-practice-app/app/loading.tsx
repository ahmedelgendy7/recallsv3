"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Menu, X, Youtube, Loader2 } from "lucide-react"

interface LoadingProps {
  show?: boolean
  onContinue?: () => void
  showSpinner?: boolean
  isLoadingComplete?: boolean
}

export default function Loading({
  show = true,
  onContinue,
  showSpinner = true,
  isLoadingComplete = false,
}: LoadingProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5)
  const [timerComplete, setTimerComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!show) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
      return
    }

    setTimeRemaining(5)
    setTimerComplete(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerComplete(true)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [show])

  if (!show) return null

  const canContinue = timerComplete && isLoadingComplete

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/oet-ultimacy-logo.png"
                alt="OET Ultimacy Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">OET Ultimacy</span>
                <span className="text-xs text-white/80">Dr Ahmed Elgendy</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="https://t.me/elgendy011"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white font-medium transition-colors text-sm"
              >
                📱 Contact Dr Ahmed
              </a>
              <a
                href="https://t.me/OETultimacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white font-medium transition-colors text-sm"
              >
                📢 Join Telegram Channel
              </a>
              <a
                href="https://www.youtube.com/@OETUltimacy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm hover:scale-105 transform duration-200"
              >
                🎥 Join YouTube Channel
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/90 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-md rounded-lg mt-2 border border-white/20">
                <a
                  href="https://t.me/elgendy011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-white/90 hover:text-white font-medium transition-colors text-sm"
                >
                  📱 Contact Dr Ahmed
                </a>
                <a
                  href="https://t.me/OETultimacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-white/90 hover:text-white font-medium transition-colors text-sm"
                >
                  📢 Join Telegram Channel
                </a>
                <a
                  href="https://www.youtube.com/@OETUltimacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-center text-sm"
                >
                  🎥 Join YouTube Channel
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          {/* Loading Spinner Section */}
          {showSpinner && (
            <div className="flex items-center justify-center mb-8">
              <Loader2 className="h-6 w-6 animate-spin text-white mr-3" />
              <span className="text-white text-lg font-medium">Loading OET Words...</span>
            </div>
          )}

          {/* YouTube Subscribe Card */}
          <div className="bg-white/75 backdrop-blur-xl ring-1 ring-black/5 shadow-xl rounded-2xl p-6 md:p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Youtube className="h-8 w-8 text-red-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Keep OET Ultimacy Free</h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                We publish free OET lessons on YouTube. Subscribing helps keep this site free for everyone.
              </p>

              <div className="space-y-3">
                <a
                  href="https://www.youtube.com/watch?v=IVEDSKpyTy0&t=46s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full px-5 py-3 font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Youtube className="h-5 w-5 mr-2" />
                  I'll subscribe now
                </a>

                {onContinue && (
                  <button
                    onClick={canContinue ? onContinue : undefined}
                    disabled={!canContinue}
                    className={`w-full inline-flex items-center justify-center border-2 rounded-full px-5 py-3 font-semibold transform transition-all duration-200 ${
                      canContinue
                        ? "border-gray-300 text-gray-700 hover:border-gray-400 hover:scale-105 bg-white/50 backdrop-blur-sm cursor-pointer"
                        : "border-gray-200 text-gray-400 bg-gray-100/50 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {!timerComplete ? (
                      <>
                        <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs font-bold bg-gray-300 rounded-full">
                          {timeRemaining}
                        </span>
                        Wait {timeRemaining}s to continue
                      </>
                    ) : !isLoadingComplete ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />I have already subscribed — continue
                      </>
                    ) : (
                      "I have already subscribed — continue"
                    )}
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4">Subscribing is free. Thank you for your support ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
