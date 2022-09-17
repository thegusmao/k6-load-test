import http from 'k6/http';
import encoding from 'k6/encoding';

export function authenticate(
  domain,
  realm,
  clientId,
  clientSecret,
  scope,
  resource
) {
  const url = `https://${domain}/auth/realms/${realm}/protocol/openid-connect/token`;
  const requestBody = { scope: scope };
  let response;

  if (typeof resource == 'string') {
    requestBody['grant_type'] = 'client_credentials';

    const encodedCredentials = encoding.b64encode(`${clientId}:${clientSecret}`);
    const params = {
      auth: 'basic',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };

    response = http.post(url, requestBody, params);
  } else if (
    typeof resource == 'object' &&
    resource.hasOwnProperty('username') &&
    resource.hasOwnProperty('password')
  ) {
    requestBody['grant_type'] = 'password';
    requestBody['username'] = resource.username;
    requestBody['password'] = resource.password;
    requestBody['client_id'] = clientId;
    requestBody['client_secret'] = clientSecret;

    response = http.post(url, requestBody);
  } else {
    throw 'resource should be either a string or an object containing username and password';
  }

  return response.json();
}
