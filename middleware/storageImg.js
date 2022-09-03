const multer = require("multer");

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const commonKeys = require('../common/common')

const s3 = new aws.S3({
    /* ... */
    secretAccessKey: commonKeys.awsKeys.SECRET_ACCESS_KEY,
    accessKeyId: commonKeys.awsKeys.ACCESS_KEY_ID,
    region: 'us-east-1'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'mint-cad',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}.jpg`);
        }
    })
});

module.exports = upload;