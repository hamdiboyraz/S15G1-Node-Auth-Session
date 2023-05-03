// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const express = require("express");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../auth/auth-middleware");
const userModel = require("../users/users-model");

const router = express.Router();

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post(
  "/register",
  authMiddleware.sifreGecerlimi,
  authMiddleware.usernameBostami,
  async (req, res, next) => {
    try {
      let newUser = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
      };
      newUser = await userModel.ekle(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.post("/login", authMiddleware.usernameVarmi, async (req, res, next) => {
  try {
    if (req.session) req.session.user = req.currentUser;
    res.json({ message: `Hoşgeldin ${req.currentUser.username}` });
  } catch (error) {
    next(error);
  }
});

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */
router.get("/logout", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(400).json({ message: "Oturum bulunamadı!" });
    }

    req.session.destroy((err) => {
      if (!err) {
        return res.json({ message: "Çıkış yapildi" });
      }
      return res
        .status(500)
        .json({ message: "session destroy edilirken hata oluştu" });
    });
  } catch (error) {
    next(error);
  }
});
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;
