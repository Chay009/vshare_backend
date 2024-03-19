const mailOTP=(code)=>{
    return ( `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
    </head>
    
    <body style="background-color: #ffffff; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
        <div style="max-width: 37.5em; margin: 0 auto; padding: 0 20px;">
            <div style="margin-top:32px; text-align: center;">
                <img alt="Vshare"  height="112" width="112" src=${process.env.CLIENT_URL}/icon_main.png style="display: block; outline: none; border: none; text-decoration: none; margin: 0 auto;" width="120">
                <p style="font-size: 18px; line-height: 28px; margin: 16px 0; font-family: 'Arial', sans-serif; font-weight: 400; color: #333333;">
                <span style="font-weight: 600; font-family: 'Arial Black', sans-serif; color: #00bcd4;">V</span>share, <span style="font-style: italic; color: #555555;">we care</span>
            </p>
            </div>

            <div style="text-align: center;">
                <h1 style="color: #1d1c1d; font-size: 36px; font-weight: 700; margin: 30px 0; padding: 0; line-height: 42px;">Confirm your email address</h1>
                <p style="font-size: 20px; line-height: 28px; margin: 16px 0; margin-bottom: 30px;">Your confirmation code is below - enter it in your open browser window and we'll help you get signed in.</p>
                <div style="background:rgb(245, 244, 245); border-radius: 4px; margin-bottom: 30px; padding: 40px 10px; text-align: center;">
                    <p style="font-size: 30px; line-height: 24px; margin: 16px 0; vertical-align: middle;">${code}</p>
                </div>
                <p style="font-size: 18px; line-height: 24px; margin: 16px 0; color: #000;">This code is valid for 5 minutes</p>
                <p style="font-size: 14px; line-height: 24px; margin: 16px 0; color: #000;">If you didn't request this email, there's nothing to worry about, you can safely ignore it.</p>
            </div>
            <div style="text-align: center;">
                <a href="/" style="color: #067df7; text-decoration: none; margin-left: 10px;" target="_blank"><img alt="Slack" height="32" src="https://react-email-demo-bdj5iju9r-resend.vercel.app/static/slack-twitter.png" style="display: inline; outline: none; border: none; text-decoration: none;" width="32"></a>
               
                <a href="/" style="color: #067df7; text-decoration: none; margin-left: 10px;" target="_blank"><img alt="Slack" height="32" src="https://react-email-demo-bdj5iju9r-resend.vercel.app/static/slack-linkedin.png" style="display: inline; outline: none; border: none; text-decoration: none;" width="32"></a>
            </div>
        </div>
    </body>
    
    </html>`)
   
}

module.exports ={mailOTP}