/**
 * Created by tai on 3/19/17.
 */

import oauthSignature from 'oauth-signature';

const yelpConfig = {
  consumer_key: 'vxKwwcR_NMQ7WaEiQBK_CA',
  consumer_secret: '33QCvh5bIF5jIHR5klQr7RtBDhQ',
  token: 'uRcRswHFYa1VkDrGV6LAW2F8clGh5JHV',
  token_secret: 'mqtKIxMIR4iBtBPZCmCLEb-Dz3Y',
};

function search(params = {term: '', location: 'San Francisco'}) {
  const currentTime = new Date().getTime();
  const httpMethod = 'GET',
    url = 'https://api.yelp.com/v2/search',
    parameters = {
      oauth_consumer_key : yelpConfig.consumer_key,
      oauth_token : yelpConfig.token,
      oauth_nonce : 'kllo9940pd9333jh',
      oauth_timestamp : currentTime ,
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0',
      ...params,
    },
    consumerSecret = yelpConfig.consumer_secret,
    tokenSecret = yelpConfig.token_secret;

  // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
  const encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

  let querys = [];
  for(const key of Object.keys(params)) {
    querys.push(`${key}=${params[key]}`);
  }
  const queryString = querys.join('&');
  const signedURL = `https://api.yelp.com/v2/search?${queryString}&oauth_consumer_key=${yelpConfig.consumer_key}&oauth_token=${yelpConfig.token}&oauth_signature_method=HMAC-SHA1&oauth_signature=${encodedSignature}&oauth_timestamp=${currentTime}&oauth_nonce=kllo9940pd9333jh&oauth_version=1.0`;
  return fetch(signedURL, {

  }).then(response => response.json());
}
export default {search};