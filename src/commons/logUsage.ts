import sleep from './sleep'

export const currentUsage: { ram: string; cpu: string } = { ram: '0MB', cpu: '0%' }

const usage = async () => {
  const startedAt = Date.now()
  const start = process.cpuUsage()
  await sleep(5 * 1000)
  const end = process.cpuUsage(start)

  const cpuUsage = 100 * (end.user + end.system) / ((Date.now() - startedAt) * 1000)

  const memoryUsed = process.memoryUsage()

  const arr = []
  for (const key in memoryUsed) {
    arr.push(`${key}-${Math.round(memoryUsed[key] / 1024 / 1024 * 100) / 100}MB`)
  }

  console.log(`Cpu usage: ${cpuUsage.toFixed(2)}, Memory usage: ${arr.slice(0, 2).join(', ')}`)
  currentUsage.cpu = `${cpuUsage.toFixed(2)}%`
  currentUsage.ram = arr[0].replace('rss-', '')
}

setInterval(() => {
  usage()
}, 60 * 1000)
