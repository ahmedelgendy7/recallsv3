"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface PromotionWidgetProps {
  trigger?: string // Used to trigger widget reappearance when switching tabs
}

export default function PromotionWidget({ trigger }: PromotionWidgetProps) {
  const [visible, setVisible] = useState(true)

  // Show widget when component mounts or trigger changes (tab switching)
  useEffect(() => {
    setVisible(true)
  }, [trigger])

  // Handle close with 10-minute timer
  const handleClose = () => {
    setVisible(false)

    // Set timer to show widget again after 10 minutes (600,000 ms)
    setTimeout(
      () => {
        setVisible(true)
      },
      10 * 60 * 1000,
    ) // 10 minutes
  }

  if (!visible || trigger === "menu") return null

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 w-full sm:w-1/2 p-4 z-50">
      <div className="relative bg-blue-600 text-white shadow-xl rounded-l-xl p-6">
        <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-300">
          <X className="h-5 w-5" />
        </button>
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold">Join the best OET course!</h2>
          <p className="text-sm">
            Intensive course (10 writing lectures + 7 speaking lectures).
            <br />
            The bundle also contains 5 letter corrections + 5 Grammar lectures + 4 speaking practice lectures.
          </p>
          <a
            href="https://t.me/elgendy011"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100"
          >
            Click here to get your discount
          </a>
        </div>
      </div>
    </div>
  )
}
