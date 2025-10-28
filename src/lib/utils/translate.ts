// src/lib/translationService.ts
export async function translateText(
  text: string,
  targetLang: "ar" | "en" = "ar"
): Promise<string> {
  if (!text.trim()) return text

  // Split text into chunks if longer than 500 characters
  const chunks = splitTextIntoChunks(text, 500)
  const translatedChunks = await Promise.all(
    chunks.map(chunk => translateChunk(chunk, targetLang))
  )

  return translatedChunks.join(' ')
}

async function translateChunk(
  text: string,
  targetLang: "ar" | "en"
): Promise<string> {
  try {
    // MyMemory API (free, no key required)
    const sourceLang = targetLang === "ar" ? "en" : "ar"
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`

    const res = await fetch(url)
    if (!res.ok) {
      console.error("Translation API error:", res.statusText)
      return text
    }
    const json = await res.json()
    const translated = json?.responseData?.translatedText
    if (translated && translated !== text) {
      return translated
    }

    // fallback if no result
    return text
  } catch (err) {
    console.error("Translation failed:", err)
    return text
  }
}

function splitTextIntoChunks(text: string, maxLength: number): string[] {
  const words = text.split(' ')
  const chunks: string[] = []
  let currentChunk = ''

  for (const word of words) {
    if ((currentChunk + ' ' + word).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + word
    } else {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = word
    }
  }

  if (currentChunk) chunks.push(currentChunk)
  return chunks
}
