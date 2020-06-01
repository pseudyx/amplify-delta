/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DELTAS3_BUCKETNAME
Amplify Params - DO NOT EDIT 

You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */// eslint-disable-next-line

require('es6-promise').polyfill();
require('isomorphic-fetch');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({ signatureVersion: 'v4' });
const Sharp = require('sharp'); // for Amazon Linux: http://sharp.pixelplumbing.com/en/stable/install/#aws-lambda how to install the module and native dependencies.

// expect these environment variables to be defined when the Lambda function is deployed
const THUMBNAIL_WIDTH = parseInt(process.env.THUMBNAIL_WIDTH || 40, 10);
const THUMBNAIL_HEIGHT = parseInt(process.env.THUMBNAIL_HEIGHT || 40, 10);

function thumbnailKey(keyPrefix) {
	return `public/profile/${keyPrefix}.jpg`;
}

function makeThumbnail(photo) {
	return Sharp(photo).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT).toBuffer();
}

async function resize(photoBody, bucketName, key) {
    const rmProtected = key.substr(10);
    const userKey = rmProtected.replace('/profile-lg.jpg', '');
    const originalPhotoName = key.substr(key.lastIndexOf('/') + 1)
    
    const thumbnail = await makeThumbnail(photoBody);

	await Promise.all([
		S3.putObject({
			Body: thumbnail,
			Bucket: bucketName,
			Key: thumbnailKey(userKey),
		}).promise(),
	]);

    return {
		photoId: originalPhotoName,
		thumbnail: {
			key: thumbnailKey(userKey),
			width: THUMBNAIL_WIDTH,
			height: THUMBNAIL_HEIGHT
		}
	};
};

async function processRecord(record) {
	const bucketName = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    //console.log('processRecord: ', JSON.stringify(record))
    console.log('bucket: ' + bucketName);
    console.log('key: ' + key);

    if (record.eventName === "ObjectCreated:Put") { 
        console.log('Update file'); 
    }
    if(record.eventName === "ObjectCreated:Post"){
        console.log('New file');
    }

    const originalPhoto = await S3.getObject({ Bucket: bucketName, Key: key }).promise()
  
	const metadata = originalPhoto.Metadata
    console.log('metadata', JSON.stringify(metadata))
    console.log('resize')
    const size = await resize(originalPhoto.Body, bucketName, key);    
    
	const thumbnail = {
        width: size.thumbnail.width,
        height: size.thumbnail.height, 
        key: size.thumbnail.key,
      }
      
    console.log(JSON.stringify(metadata), JSON.stringify(thumbnail))

}


exports.handler = async (event, context, callback) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
 
	try {
		event.Records.forEach(processRecord);
		callback(null, { status: 'Photo Processed' });
	}
	catch (err) {
		console.error(err);
		callback(err);
	}
};

