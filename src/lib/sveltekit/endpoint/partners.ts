import { json, RequestHandler } from "@sveltejs/kit";
import {getPartners, getPartnersSubmissions, insertPartnerSubmission} from "../../../../../scores-lib/src/functions/v8/partners.js"

export const GetPartners: RequestHandler = async ({ url }) => {
  const geo = url.searchParams.get("geo");
  if (!geo) return json({partners: []})
  const data = await getPartners({ geo });
  return json ({ partners: data});
};


export const GetPartnersSubmissions: RequestHandler = async ({ url }) => {
  const uid = url.searchParams.get("uid");
  if (!uid) return json({partners: []})

  try
  {

    const data = await getPartnersSubmissions({  uid });
    return json({ partners_submissions: data });
  } catch (e)
  {
    console.log("Partners Submissions", e);
    return json({ });
  }
}

export const PostPartnerSubmission: RequestHandler = async ({locals: {user}, request}) =>
{
  const { partner, input, wallet } = await request.json()
  if (!user.uid)
  {
    return json({}, { status: 501 });
  }
  try
  {

    const submission = await insertPartnerSubmission({partner_id: partner.id, user_id: user.uid, status: "pending", submitted_username_or_email: input })
    return json({submission, ok: true}, {status: 200})
  } catch (e)
  {
    return json({}, { status: 500 });
  }
}