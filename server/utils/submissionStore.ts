import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dataDir = join(process.cwd(), '.data')

const ensureDataDir = async () => {
  await mkdir(dataDir, { recursive: true })
}

export const readJsonRecords = async <T>(filename: string): Promise<T[]> => {
  await ensureDataDir()

  const path = join(dataDir, filename)

  try {
    const raw = await readFile(path, 'utf8')
    const parsed = JSON.parse(raw) as unknown

    return Array.isArray(parsed) ? parsed as T[] : []
  } catch {
    return []
  }
}

export const writeJsonRecords = async <T>(filename: string, records: T[]) => {
  await ensureDataDir()
  await writeFile(join(dataDir, filename), `${JSON.stringify(records, null, 2)}\n`, 'utf8')
}

export const appendJsonRecord = async <T>(filename: string, record: T) => {
  const records = await readJsonRecords<T>(filename)

  records.unshift(record)
  await writeJsonRecords(filename, records)
}
