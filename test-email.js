/**
 * Test script for Zoho email integration
 * Run: node test-email.js
 */

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const ZOHO_CONFIG = {
  host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.ZOHO_SMTP_PORT || '587'),
  secure: process.env.ZOHO_SMTP_SECURE === 'true',
  auth: {
    user: process.env.ZOHO_SMTP_USER || '',
    pass: process.env.ZOHO_SMTP_PASS || '',
  },
};

const SENDER = {
  email: process.env.ZOHO_SENDER_EMAIL || 'noreply@apparelcast.shop',
  name: process.env.ZOHO_SENDER_NAME || 'ApparelCast',
};

async function testEmail() {
  console.log('🧪 Testing Zoho Email Configuration...\n');
  
  // Check configuration
  if (!ZOHO_CONFIG.auth.user || !ZOHO_CONFIG.auth.pass) {
    console.error('❌ Error: Zoho SMTP credentials not configured!');
    console.log('\nPlease set the following in your .env.local file:');
    console.log('- ZOHO_SMTP_USER');
    console.log('- ZOHO_SMTP_PASS');
    process.exit(1);
  }

  console.log('Configuration:');
  console.log(`  Host: ${ZOHO_CONFIG.host}`);
  console.log(`  Port: ${ZOHO_CONFIG.port}`);
  console.log(`  Secure: ${ZOHO_CONFIG.secure}`);
  console.log(`  User: ${ZOHO_CONFIG.auth.user}`);
  console.log(`  Sender: ${SENDER.name} <${SENDER.email}>\n`);

  try {
    // Create transporter
    const transporter = nodemailer.createTransport(ZOHO_CONFIG);

    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Prompt for test email
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Enter email address to send test to (or press Enter to skip): ', async (testEmail) => {
      readline.close();

      if (!testEmail.trim()) {
        console.log('\n✅ Configuration verified! Skip sending test email.');
        console.log('\nYou can now use Zoho email in your ApparelCast store! 🎉');
        process.exit(0);
      }

      console.log(`\n📧 Sending test email to ${testEmail}...`);

      const mailOptions = {
        from: `${SENDER.name} <${SENDER.email}>`,
        to: testEmail,
        subject: '✓ ApparelCast Email Test - Success!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #16a34a; color: #fff; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px 20px; }
                .success-box { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #16a34a; border-radius: 4px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .code { background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">✓ Email Test Successful!</h1>
                </div>
                
                <div class="content">
                  <h2 style="color: #16a34a;">🎉 Your Zoho Email Integration is Working!</h2>
                  
                  <div class="success-box">
                    <p><strong>Congratulations!</strong> If you're reading this email, your Zoho Mail SMTP configuration is working perfectly.</p>
                    
                    <p><strong>Configuration Details:</strong></p>
                    <div class="code">
                      Sender: ${SENDER.name}<br>
                      Email: ${SENDER.email}<br>
                      Time: ${new Date().toLocaleString()}<br>
                      Status: ✅ Active
                    </div>
                  </div>

                  <h3>What This Means:</h3>
                  <ul style="line-height: 2;">
                    <li>✅ Your ApparelCast store can send emails</li>
                    <li>✅ Order confirmations will work</li>
                    <li>✅ Shipping notifications will work</li>
                    <li>✅ Admin alerts will work</li>
                  </ul>

                  <h3>Next Steps:</h3>
                  <ol style="line-height: 2;">
                    <li>Complete your store setup</li>
                    <li>Test the full checkout flow</li>
                    <li>Launch your store!</li>
                  </ol>

                  <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
                    <strong>Need help?</strong> Check out the ZOHO_EMAIL_SETUP.md documentation in your project.
                  </p>
                </div>

                <div class="footer">
                  <p><strong>ApparelCast</strong></p>
                  <p>Powered by Zoho Mail</p>
                  <p>© ${new Date().getFullYear()} ApparelCast. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`\n✨ Check ${testEmail} for the test email.`);
        console.log('\nYour Zoho email integration is ready to use! 🎉');
      } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Verify your Zoho password is correct');
        console.log('2. Enable "Less secure apps" in Zoho settings (if using regular password)');
        console.log('3. Or use an app-specific password');
        console.log('4. Check if your account has SMTP access enabled');
        console.log('5. Verify the email address is correct');
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your internet connection');
    console.log('2. Verify SMTP credentials are correct');
    console.log('3. Ensure SMTP access is enabled in Zoho');
    console.log('4. Try using port 465 with secure:true');
    console.log('5. Check firewall/antivirus settings');
    process.exit(1);
  }
}

testEmail();

