/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get(req: any res: any): Promise< unknown > {

  const ip = req.headers.get("x-forwarded-for") || req.socket.remoteAddress || req.headers.get("x-real-ip") || null;

  return {
    status: 200,
    body: ip
  }
}