import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(here, '..', 'public', 'icons')

const targets = [
  { src: 'icon.svg', size: 192, dest: 'icon-192.png' },
  { src: 'icon.svg', size: 512, dest: 'icon-512.png' },
  { src: 'icon.svg', size: 180, dest: 'apple-touch-icon.png' },
  { src: 'maskable.svg', size: 512, dest: 'maskable-512.png' },
]

await mkdir(iconsDir, { recursive: true })

for (const { src, size, dest } of targets) {
  const input = await readFile(path.join(iconsDir, src))
  const buffer = await sharp(input).resize(size, size).png().toBuffer()
  await writeFile(path.join(iconsDir, dest), buffer)
  console.log(`generated ${dest} (${size}x${size})`)
}
