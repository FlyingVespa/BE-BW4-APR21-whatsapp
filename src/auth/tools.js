import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const JWTAuthenticate = async (user) => {
  // 1. given the user ==> generate the token with user._id as payload
  const accessToken = await generateJWT({ _id: user._id });

  return accessToken;
};

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

// generateJWT()
//   .then(token => console.log(token))
//   .catch(err => console.log(err))

export const verifyJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );

// const promisifiedJWTSign = promisify(jwt.sign)

// promisifiedJWTSign(payload, ).then()
