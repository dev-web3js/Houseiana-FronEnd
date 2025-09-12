const { Resend } = require('resend');

const resend = new Resend('re_QhSfsBLL_CYFc9e1MbKoSLoRcEXomPCha');

async function testEmail() {
  try {
    console.log('Testing Resend email...');
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@support.houseiana.com',  // Your verified domain
      to: 'mo.saiyed@outlook.com',  // Change this to YOUR email where you want to receive
      subject: 'Test Email from Houseiana',
      html: '<p>This is a test email from your verified domain!</p>'
    });

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success! Email sent:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testEmail();