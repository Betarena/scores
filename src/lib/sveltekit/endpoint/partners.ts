import { json, RequestHandler } from "@sveltejs/kit";
import {
  getPartners,
  getPartnersSubmissions,
  insertPartnerSubmission,
  getActivePartnersGeo
} from "@betarena/scores-lib/dist/functions/v8/partners.js";

export const GetPartners: RequestHandler = async ({ url }) => {
  const geo = url.searchParams.get("geo") || "en";
  const [target, default_data] = await Promise.all([getPartners({ geo }), getPartners({ geo: "en" })]);
  return json({ partners: target?.length ? target : default_data });
};

export const GetPartnersSubmissions: RequestHandler = async ({ url }) => {
  const uid = url.searchParams.get("uid");
  if (!uid) return json({ partners: [] });

  try {
    const data = await getPartnersSubmissions({ uid });
    return json({ partners_submissions: data });
  } catch (e) {
    console.log("Partners Submissions", e);
    return json({});
  }
};

export const PostPartnerSubmission: RequestHandler = async ({
  locals: { user },
  request,
}) => {
  const { partner, input, wallet } = await request.json();
  if (!user.uid) {
    return json({ ok: false }, { status: 501 });
  }
  try {
    const submission = await insertPartnerSubmission({
      partner_id: partner.id,
      user_id: user.uid,
      status: "pending",
      submitted_username_or_email: input,
    });
    return json({ submission, ok: true }, { status: 200 });
  } catch (e) {
    return json({ ok: false }, { status: 500 });
  }
};


export const GetPartnersVisibility: RequestHandler = async ({ url }) => {
  const geo = url.searchParams.get("geo") || "en";
  try
  {
    const data = await getActivePartnersGeo({ geo });
    const partners_visibility = data[0]?.active ?? true;
    return json({partners_visibility})
  } catch (e)
  {
    return json({partners_visibility: false})
  }

}