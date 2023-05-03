// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!
const express = require("express");
const userController = require("./users-model");
const authMiddleware = require("../auth/auth-middleware");
const router = express.Router();

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */

router.get("/", authMiddleware.sinirli, async (req, res, next) => {
  try {
    const users = await userController.bul();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;
