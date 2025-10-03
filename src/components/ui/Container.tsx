import React from "react"

type Props = { children: React.ReactNode ,className?:string}

export default function Container({ children ,className}: Props): React.ReactNode {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 [padding-left:calc(env(safe-area-inset-left))] [padding-right:calc(env(safe-area-inset-right))] rounded-2xl">
      {children}
    </div>
  )
}
