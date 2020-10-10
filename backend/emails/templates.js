const globalStyle = `
    body {
        font-family: sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333333;
        padding: 20px;
    }
    a {
        color: #0F2E53;
        text-decoration: none;
        font-weight: bold;
    }
    a.button {
        display: inline-block;
        margin: 16px 0;
        border: 2px solid #0F2E53;
        border-radius: 8px; 
        padding: 6px 12px;
    }
`;

const resetPasswordTemplate = (resetToken) => `
    <html>
        <head>
            <title>Reset Your Password</title>
            <style>${globalStyle}</style>
        </head>
        <body>
            <h1>Reset Your Password</h1>
            <p>Hey there!</p>
            <p>You are about to reset your password. Continue to do so by following this link:</p>
            <p><a class="button" href="${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}" target="_blank">Reset Password</a></p>
            <p style="margin-top: 40px;">
                Cheers Konstantin 👋<br/>
                <a href="${process.env.FRONTEND_URL}" target="_blank">notion.clone</a>
            </p>
        </body>
    </html>
`;

const emailConfirmationTemplate = (activationToken) => `
    <html>
        <head>
            <title>Confirm Your Email</title>
            <style>${globalStyle}</style>
        </head>
        <body>
            <h1>Confirm Your Email</h1>
            <p>Welcome to <strong>notion.clone</strong>!</p>
            <p>Let's confirm your email address. Please click the button to confirm your email address and activate your account:</p>
            <p><a class="button" href="${process.env.FRONTEND_URL}/activateAccount?token=${activationToken}" target="_blank">Confirm Email Address</a></p>
            <p>If you don't confirm your email address within the next 48 hours, your account will be deleted automatically.</p>
            <p style="margin-top: 40px;">
                Cheers Konstantin 👋<br/>
                <a href="${process.env.FRONTEND_URL}" target="_blank">notion.clone</a>
            </p>
        </body>
    </html>
`;

exports.resetPasswordTemplate = resetPasswordTemplate;
exports.emailConfirmationTemplate = emailConfirmationTemplate;
