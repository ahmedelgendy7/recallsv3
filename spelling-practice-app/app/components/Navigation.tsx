"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/oet-ultimacy-logo.png" alt="OET Ultimacy Logo" width={40} height={40} className="rounded-lg" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">OET Ultimacy</span>
              <span className="text-xs text-gray-600">Dr Ahmed Elgendy</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="https://t.me/elgendy011"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              📱 Contact Dr Ahmed
            </a>
            <a
              href="https://t.me/OETultimacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              📢 Join Telegram Channel
            </a>
            <a
              href="https://www.youtube.com/@OETUltimacy"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              🎥 Join YouTube Channel
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <a
                href="https://t.me/elgendy011"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm"
              >
                📱 Contact Dr Ahmed
              </a>
              <a
                href="https://t.me/OETultimacy"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm"
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
  )
}
