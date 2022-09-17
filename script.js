import http from 'k6/http';
import { authenticate } from './oauth/sso.js';

export function setup() {
    const SSO_DOMAIN = 'keycloak-apps-auth.apps.cluster-mrfnd.mrfnd.sandbox1802.opentlc.com';
    const SSO_REALM = 'foods';
    const SSO_CLIENT_ID = 'backend';
    const SSO_CLIENT_SECRET = 'topsecret';
    const SSO_SCOPE = 'openid';
    const SSO_USERNAME = 'test';
    const SSO_PASSWORD = 'r3dh4t1!';

    const authResponse = authenticate(
        SSO_DOMAIN,
        SSO_REALM,
        SSO_CLIENT_ID,
        SSO_CLIENT_SECRET,
        SSO_SCOPE,
        {
            username: SSO_USERNAME,
            password: SSO_PASSWORD
        }
    );

    return authResponse;
}


export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.access_token}`, // or `Bearer ${clientAuthResp.access_token}`
    },
  };
  const orderUrl = 'http://order-food-app.apps.cluster-mrfnd.mrfnd.sandbox1802.opentlc.com/api/checkout';
  const res = http.get(orderUrl, params);
}