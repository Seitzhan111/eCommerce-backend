export default () => ({
    port: process.env.PORT,
    db_port: process.env.DB_PORT,
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
    secret_jwt: process.env.SECRET,
    expire_jwt: process.env.EXPIRE_JWT,
    mail_host: process.env.MAIL_HOST,
    mail_port: process.env.MAIL_PORT,
    mailDev_incoming_user: process.env.MAILDEV_INCOMING_USER,
    mailDev_incoming_pass: process.env.MAILDEV_INCOMING_PASS,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_secret: process.env.GOOGLE_SECRET,
    facebook_app_id: process.env.FACEBOOK_APP_ID,
    facebook_app_secret: process.env.FACEBOOK_APP_SECRET
})