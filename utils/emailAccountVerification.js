const accountVerification=(url,username)=>{

    return(`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
</head>

<body style="background-color: #f6f9fc; padding: 10px 0;">
    <div style="max-width: 37.5em; margin: 0 auto; background-color: #ffffff; border: 1px solid #f0f0f0; padding: 45px;">
        <div style="text-align: center;">
            <img alt="Vshare"  height="112" width="112"  src=${process.env.CLIENT_URL}/icon_main.png style="display: block; outline: none; border: none; text-decoration: none; margin: 0 auto;">
            
            <p style="font-size: 18px; line-height: 28px; margin: 16px 0; font-family: 'Arial', sans-serif; font-weight: 400; color: #333333;">
            <span style="font-weight: 600; font-family: 'Arial Black', sans-serif; color: #00bcd4;">V</span>share, <span style="font-style: italic; color: #555555;">we care</span>
        </p>
        </div>
        <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 16px; line-height: 26px; margin: 16px 0; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-weight: 300; color: #404040;">Hi <strong>${username}</strong>,</p>
            <p style="font-size: 16px; line-height: 26px; margin: 16px 0; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-weight: 300; color: #404040;">Thank you for registering with us. To verify your email address, please click the button below:</p>
            <a href=${url} style="background-color: #007ee6; border-radius: 4px; color: #fff; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-size: 15px; text-decoration: none; text-align: center; display: inline-block; width: 210px; padding: 14px 7px; line-height: 100%; max-width: 100%;" target="_blank">
                Verify Email account
            </a>
            <p style="font-size: 16px; line-height: 26px; margin: 16px 0; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-weight: 300; color: #404040;">This Link expires in 10 mins </p>
            <p style="font-size: 16px; line-height: 26px; margin: 16px 0; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-weight: 300; color: #404040;">If you didn't register with us or didn't request this email, please disregard it.</p>
            <p style="font-size: 16px; line-height: 26px; margin: 16px 0; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-weight: 300; color: #404040;">Keep your account secure by not sharing this email with anyone. For more information, visit our <a  style="color: #067df7; text-decoration: underline;" target="_blank">Help Center</a>.</p>
            <p style="font-size: 16px; line-height: 26px; margin: 16px 0; font-family: 'Open Sans', 'Helvetica Neue', Arial; font-weight: 300; color: #404040;">Thanks for registering Vshare!,Let's Strengthen our bonds</p>
        </div>
        <a href="https://twitter.com/chay2u"><img alt="Twitter" src="https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png" style="max-width: 32px;"></a>
        <a href="https://www.linkedin.com/in/chay2u/" style="color: #067df7; text-decoration: none; margin-left: 10px;" target="_blank"><img alt="LinkedIn" height="32" src="https://react-email-demo-bdj5iju9r-resend.vercel.app/static/slack-linkedin.png" style="display: inline; outline: none; border: none; text-decoration: none;" width="32"></a>
    </div>
</body>

</html>`)}

module.exports = {accountVerification}
