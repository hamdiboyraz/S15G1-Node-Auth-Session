const db = require("../../data/db-config");
/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
async function bul() {
  // OPT 1-2-3
  // let users = await db("users");
  // OPT 1-2
  // users = users.map((user) => {
  //   // OPT 1
  //   // delete user.password;
  //   // return { ...user };
  //   // OPT 2
  //   return { user_id: user.user_id, username: user.username };
  // });
  // OPT 3
  // users = users.map(({ user_id, username }) => {
  //   return { user_id, username };
  // });
  // OPT 4
  const users = await db.select("user_id", "username").from("users");
  return users;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
  goreBul({user_id:2})
  goreBul({username:kullanici})
 */
async function goreBul(filtre) {
  const users = await db("users").where(filtre);
  return users;
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  const user = await db("users").where("user_id", user_id).first();
  delete user.password;
  return user;
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  const [user_id] = await db("users").insert(user);
  return await idyeGoreBul(user_id);
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
