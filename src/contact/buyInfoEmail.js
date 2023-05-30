import { createTransport } from "nodemailer";

const TEST_MAIL = 'roberto80@ethereal.email';

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: 'cpzXn84YTCCeFxD45V'
    }
});

const sendBuyData = async (products, username, email) => {
    try {
      const productHtml = products.map((product) => {
        return `<p>${product.title} - ${product.price}</p>`;
      }).join('');
  
      const mailOptions = {
        from: "Servidor Node",
        to: TEST_MAIL,
        subject: `Nuevo pedido de ${username} email: ${email}`,
        html: `<h3 style="color: blue;">Productos comprados: </h3>${productHtml}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
    } catch (err) {
      console.log(err);
    }
  }

export default sendBuyData;