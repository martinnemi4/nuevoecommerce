import { createTransport } from "nodemailer";

const TEST_MAIL = 'roberto80@ethereal.email';

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: 'hJV7ADC8d4yDVaPbTV'
    }
});

const sendMail = async (usuario, nombre, apellido, email) => {
    try {
        const mailOptions = {
            from: "Servidor",
            to: TEST_MAIL,
            subject: "Nuevo registro",
            html: `<h3 style="color: blue;">usuario: ${usuario}</h3>
            <h3 style="color: blue;">nombre: ${nombre}</h3>
            <h3 style="color: blue;">apellido: ${apellido}</h3>
            <h3 style="color: blue;">mail: ${email}</h3>
            <h3 style="color: blue;">phone: ${phone}</h3>
            <h3 style="color: blue;">adress: ${adress}</h3>
            <h3 style="color: blue;">age: ${age}</h3>
            <h3 style="color: blue;">photo: ${photo}</h3>`,
            
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log(info);
    } catch (err) {
        console.log(err);
    }
}

export default sendMail;
