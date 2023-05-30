import twilio from 'twilio';

const accountSid = 'ACee86bf7ccd82090a4015e4155b9db053';
const authToken =  '465d16b162009723007399f91daed9bf';

const client = twilio(accountSid, authToken);

const sendSms = async(username, email) => {

    try {

        const smsOptions = {
            from: '+14346088383',
            to: '+543515144695',
            body: `Hola, creaste el siguiente usuario ${username} con el email ${email}`,
        };

        const message = await client.messages.create(smsOptions);

        console.log(message);

    } catch (error) {
        console.log(error)
    }
}

export default sendSms;