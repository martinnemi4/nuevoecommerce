import compression from "compression";
import { Router } from "express";
import passport from "passport";
import { authController } from "../controllers/index.js";
import generateFaker from "../faker.js";
import logger from "../lib/logger.js";
import { Carts } from "../table/car.model.js";
import { Product } from "../table/product.model.js";
import sendBuyData from "../contact/buyInfoEmail.js";
import sendInfoSms from "../contact/buyInfoSms.js";

const router = Router();

// LOGIN
router
  .route("/login")
  
  .get(authController.getLogin)
  
  .post(
    passport.authenticate("login", { failureRedirect: "/fail-login" }),
    authController.getLogin
);

// REGISTER
router.route("/register")
  
  .get(authController.getRegister)

  .post(
    passport.authenticate("register", { failureRedirect: "/fail-register" }),
    authController.getLoginMail
);

// FAIL LOGIN  
router.get("/fail-login", authController.getLoginFailiure);

// FAIL REGISTER
router.get("/fail-register", authController.getRegisterFailiure);

// LOGOUT
router.get("/logout", authController.logOut);

// INICIO OK
router.get("/login/adminproductos", async (req, res) => {

  try {
    const { user } = req.session.passport;
    const products = await Product.find({}).lean();
    
    if (!user) {
      return res.redirect("/login");
    }

    res.render("inicio-ok", { user, products });
  } catch (err) {
    logger.error(err);
  }
});

//AGREGAR PRODUCTO AL CARRITO
router.route("/addProduct")
  .post( async (req, res) => {
    try {
      const { title, price, productId } = req.body;
      const { user } = req.session.passport;
      const products = await Product.find({}).lean();

      const cartFinded = await Carts.findOne({ username: user.username}).lean();

      if (cartFinded) {
        cartFinded.products.push({ title, price, productId });

        await Carts.findOneAndUpdate({ username: user.username}, cartFinded);
      } else {
        console.log("No se encontro carrito para el usuario")
      }

      res.render("show-cart", { user, products, cartFinded });
    } catch (err) {
      logger.error(err);
      res.status(500).send("Error al agregar el producto al carrito.");
    }
  });

router.put("/cart/:productId", async (req, res) => {
  try {

    const { productId } = req.params;

    const product = await Product.findById(productId);

    const cart = await Carts.findOne({
      username: req.session.passport.user.username,
    });

    cart.products.push(product);

    await Carts.updateOne(
      { username: req.session.passport.user.username },
      cart
    );

    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    logger.error({ error: err }, "Error adding product");

    res.sendStatus(500);
  }
});

router.route('/buyProducts')
 .post( async (req, res) => {
  const { username, email } = req.body;
  const { user } = req.session.passport;
  const cart = await Carts.findOne({ username: username});
  const products = cart.products;

  sendBuyData(products, username, email)
  sendInfoSms(products, email)

  res.render("buy-success", { user, products })
})

//
router.get("/info", compression(), authController.info);

//
router.get("/info-uncomp", authController.info);

//
router.get("/api/random", authController.getRandom);

export default router;