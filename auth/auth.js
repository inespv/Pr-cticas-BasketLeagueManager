import jwt from "jsonwebtoken";
const secret = "secretoNode";

export const generarToken = (user) => {
  return jwt.sign({ login: user.login, rol: user.rol }, secret, { expiresIn: "2 hours" });
};

export const verificarToken = (token) => {
  try {
    let resultado = jwt.verify(token.substring(7), secret);
    return resultado;
  } catch (e) {
    console.log(e.message);
  }
};

// auth/auth.js
export function protegerRuta(...roles) {
  return function (req, res, next) {
    // Intentamos obtener el token de la cookie o del header
    let token = req.cookies?.token || req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).redirect('/auth/login');
    }

    try {
      const resultado = jwt.verify(token, secret);
      req.usuario = resultado;

      if (roles.length === 0 || roles.includes(resultado.rol)) {
        return next();
      } else {
        return res.status(403).render('error', { error: "Acceso denegado" });
      }
    } catch (error) {
      return res.status(401).redirect('/auth/login');
    }
  };
}

// export function protegerRuta(...roles) {
//   return function (req, res, next) {
//     let token = req.headers["authorization"];

//     if (token && token.startsWith("Bearer ")) {
//       token = token.slice(7);

//       try {

//         const resultado = jwt.verify(token, secret);
//         req.usuario = resultado;

//         if (roles.length === 0 || roles.includes(resultado.rol)) {
//           return next();
//         } else {
//           return res.status(403).send({ ok: false, error: "Usuario no autorizado (Rol insuficiente)" });
//         }
//       } catch (error) {
//         return res.status(401).send({ ok: false, error: "Token inválido o expirado" });
//       }
//     } else {

//       return res.status(401).send({ ok: false, error: "Login Incorrecto: No se proporcionó token" });
//     }
//   };
// }