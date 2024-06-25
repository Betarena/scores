
export const GET = async () =>
{

  const doc = [{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.betarena.scores",
      "sha256_cert_fingerprints": ["DD:97:44:02:74:A0:21:AA:7E:B1:6F:F4:69:B2:D2:64:EB:63:4A:92:4D:09:B6:38:F6:11:41:14:9E:6D:DB:23"]
    }
  }]

  return new Response(JSON.stringify(doc), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};