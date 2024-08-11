export default function getState(name: string): string {
    return process.env[`STATE_${name}`] || ''
  }
