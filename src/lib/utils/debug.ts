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

export function log_info_group (
  groupName:string, 
  msgs: string[]
) {
  console.groupCollapsed(`%c${groupName}`, 'background: blue; color: #fffff')
  for (const m of msgs) {
    const msg = m.replace(/\t/g, '');
    console.log(`${msg}`)
  }
  console.groupEnd()
}