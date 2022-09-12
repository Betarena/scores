export function logErrorGroup (
  groupName:string, 
  msg: string
) {
  console.groupCollapsed(groupName)
  msg = msg.replace(/\t/g, '');
  console.error(`${msg}`)
  console.groupEnd()
}

export function logDevGroup (
  groupName:string, 
  msg: string
) {
  console.groupCollapsed(groupName)
  msg = msg.replace(/\t/g, '');
  console.log(`${msg}`)
  console.groupEnd()
}