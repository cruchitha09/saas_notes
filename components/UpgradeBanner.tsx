'use client'

interface UpgradeBannerProps {
  onUpgrade: () => void
}

export default function UpgradeBanner({ onUpgrade }: UpgradeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 mb-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
          <p className="text-purple-100 mt-1">
            You've reached the 3-note limit on the Free plan. Upgrade to Pro for unlimited notes!
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-white text-purple-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}
