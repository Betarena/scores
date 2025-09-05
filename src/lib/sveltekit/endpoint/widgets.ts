import { json, RequestHandler } from "@sveltejs/kit";

export const GetWidgetsEndpoint: RequestHandler = async ({ url, locals: { user }, fetch }) => {

    return json({  });
};

export const WidgetsInstallEndpoint: RequestHandler = async ({ request }) => {

  return json({});
};
