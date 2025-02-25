// frontend/cognito.js
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
  } from 'amazon-cognito-identity-js';
  
  const poolData = {
    UserPoolId: 'us-east-1_dhdmutWQv', // same as process.env.COGNITO_USER_POOL_ID
    ClientId: '56ungteq2qkpej9om3km2sh8kc', // same as process.env.COGNITO_CLIENT_ID
  };
  
  const userPool = new CognitoUserPool(poolData);
  
  // 1) Frontend sign-up
  export function signUpUser(email, password) {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
      ];
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.user);  // CognitoUser object
      });
    });
  }
  
  // 2) Confirm sign-up
  export function confirmUser(email, code) {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
  
  // 3) Sign in (returns tokens)
  export function signInUser(email, password) {
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          const idToken = session.getIdToken().getJwtToken();
          const accessToken = session.getAccessToken().getJwtToken();
          const refreshToken = session.getRefreshToken().getToken();
          resolve({ idToken, accessToken, refreshToken });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
  