export function logErrorGroup (
  groupName:string, 
  msg: string
) {
  console.groupCollapsed(groupName)
  console.error(`${msg}`)
  console.groupEnd()
}

export function logDevGroup (
  groupName:string, 
  msg: string
) {
  console.groupCollapsed(groupName)
  console.log(`${msg}`)
  console.groupEnd()
}