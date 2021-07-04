export const productName = 'Electra'
export const productTagline =
  'Electra is the best starting framework for the modern stack.'
export const productCTA = `Checkout out Electra
It's the fastest way to build SaaS applications`
export const productCTASubtext = `It's super easy to get started!`
export const docsLink = '/docs'
export const supportLink = '/support'

const icons = [
  { size: 32 },
  { size: 57 },
  { size: 76 },
  { size: 96 },
  { size: 128 },
  { size: 192 },
  { size: 228 },
  { rel: 'shortcut icon', size: 196 },
  { rel: 'apple-touch-icon', size: 120 },
  { rel: 'apple-touch-icon', size: 152 },
  { rel: 'apple-touch-icon', size: 180 }
]

type FaviconConfig = {
  rel?: string
  sizes: number
}

export const faviconConfigs = icons.map((x) => {
  return { ...x, rel: x.rel || 'icon' }
})
