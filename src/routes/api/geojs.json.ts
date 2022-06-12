/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post({ params, request }, res: any): Promise< unknown > {

  const ip = request.headers.get("x-forwarded-for") || request.socket || request.headers.get("x-real-ip") || null;

  return {
    status: 200,
    body: ip
  }
}