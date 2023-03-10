//TOKENS

const express = require('express')
var CryptoJS = require("crypto-js");
const path = require('path')
const request = require('request');
var bodyParser = require('body-parser');
var queue = require('express-queue');
var cors = require('cors');
const {
	base64encode,
	base64decode
} = require('nodejs-base64');

var firebase = require("firebase-admin");

var serviceAccount = require(__dirname + "/private/cre.json");

var serviceAccountd = require(__dirname + "/private/admin.json");
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: "https://english-re-edu-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var admin = firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccountd),
	databaseURL: "https://english-re-learning-default-rtdb.asia-southeast1.firebasedatabase.app"
}, 'secondary');

const {
	json
} = require('express');
var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json())
app.use(cors());
app.use(queue({
	activeLimit: 1,
	queuedLimit: -1
}));
var port = process.env.PORT || 5000;
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.send('started'))

app.post('/reg', function (req, res) {
	const BOT_TOKEN = '5977867332:AAFz8bGw2pTuGZlgwYMaFA2UKAO451dL6pY'
	const CHAT_ID = -1001682384010 // <YOUR_CHAT_ID>

	const tmMsg = (text) => {
		const options = {
			method: 'POST',
			url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: CHAT_ID,
				parse_mode: "HTML",
				text
			})
		};
		request(options, function (error, response) {
			if (!error) //throw new Error(error);
				console.log(response.body);
			else console.log(error);
		});
	};


	const upg = (ud) => {
		const v2 = (id) => {
			if (id == null) {
				var updt = 1


			} else {
				var updt = id + 1
			}
			var sliced = ("000" + updt).slice(-4);
			firebase.database().ref("luse").set({
				id: updt
			})
			var data = JSON.stringify(ud)
			console.log(data)
			console.log("Encrypted with " + ud["pw"])
			var encryptt = CryptoJS.AES.encrypt(data, ud["pw"]).toString();
			console.log(encryptt)
			admin.database().ref("students/" + updt).set(ud)
			firebase.database().ref("students/" + encodeURIComponent(base64encode(ud["pn"]))).set({
				data: encryptt,
				id: updt
			})
			tmMsg("<b>??????????? New Student Registration on English RE</b> \n\n" + "Student ID: RE" + sliced + "\n" + "Phone Number: 94" + parseInt(ud["wa"]) + "\n" + "Student Name: " + ud["fn"] + " " + ud["ln"] + "\n\n<b>Hotline: 078 713 40 53</b>" + "\n" + "<b>Happy Learning with English RE</b>")
			res.send(sliced)

		}
		var path3 = "luse/id"
		// Create References
		const dbRefObject = firebase.database().ref().child(path3);
		// Sync object changes
		dbRefObject.once('value', get => v2(get.val()));

	};


	authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV"
	console.log('receiving data ...');
	console.log('body is ', req.body);
	if (req.body != undefined) {
		bb = JSON.parse(JSON.stringify(req.body))
		console.log(bb["reg"].replace("'", '').replace('"', "").replace('"', '').replace("'", ''))
		temp = bb["reg"].replace("'", '').replace('"', "").replace('"', '').replace("'", '')
		console.log(CryptoJS.AES.decrypt(temp, authid).toString(CryptoJS.enc.Utf8))
		outc = CryptoJS.AES.decrypt(temp, authid).toString(CryptoJS.enc.Utf8)
		aa = JSON.parse(outc)

		console.log(aa)
		upg(aa)

	}


})

app.post('/up', function (req, res) {
	const BOT_TOKEN = '5977867332:AAFz8bGw2pTuGZlgwYMaFA2UKAO451dL6pY'
	const CHAT_ID = -1001682384010 // <YOUR_CHAT_ID>

	const tmMsg = (text) => {
		const options = {
			method: 'POST',
			url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: CHAT_ID,
				parse_mode: "HTML",
				text
			})
		};
		request(options, function (error, response) {
			if (!error) //throw new Error(error);
				console.log(response.body);
			else console.log(error);
		});
	};


	const upd = (ud, id, pd) => {
		console.log("ing......")
		var updt = id
		console.log(ud, id)
		var pushing = JSON.parse(ud)
		console.log(pushing)
		admin.database().ref("students/" + updt).update(pushing).then((result) => {

			const stup = (dt) => {
				console.log(dt)
				console.log("Encrypted with " + dt["pw"])

				var data = JSON.stringify(dt)
				tmMsg("<b>???? Student Profile Update</b>\n\n" + data)

				var encryptt = CryptoJS.AES.encrypt(data, dt["pw"]).toString();
				console.log(dt["pn"], authid)
				if (pd != null && pd != undefined && pd != "" && pd != "''") {
					firebase.database().ref("students/" + pd).set({
						data: encryptt,
						id: updt
					})
				}
				res.send(data)
			}
			var pathc = "students/" + updt
			const dbRefObject = admin.database().ref().child(pathc);
			dbRefObject.once('value', snap => stup(snap.val()));

		})


	};


	authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV"
	console.log('receiving data ...');
	console.log('body is ', req.body);
	if (req.body != undefined) {
		bb = JSON.parse(JSON.stringify(req.body))
		var id = bb["id"]
		var pd = bb["path"]
		console.log(bb["up"].replace("'", '').replace('"', "").replace('"', '').replace("'", ''))
		temp = bb["up"].replace("'", '').replace('"', "").replace('"', '').replace("'", '')
		console.log(CryptoJS.AES.decrypt(temp, authid).toString(CryptoJS.enc.Utf8))
		uu = CryptoJS.AES.decrypt(temp, authid).toString(CryptoJS.enc.Utf8)

		console.log("Updates" + uu)

		upd(uu, id, pd)

	}
})

app.post("/changepassword", async (req, res) => {

	const BOT_TOKEN = '5977867332:AAFz8bGw2pTuGZlgwYMaFA2UKAO451dL6pY'
	const CHAT_ID = -1001682384010 // <YOUR_CHAT_ID>
	
	const tmMsg = (text) => {
		const options = {
			method: 'POST',
			url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: CHAT_ID,
				parse_mode: "HTML",
				text
			})
		};
		request(options, function (error, response) {
			if (!error) //throw new Error(error);
				console.log(response.body);
			else console.log(error);
		});
	};

		const email = req.body.email;
		const phoneNumber = req.body.phoneNumber;
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		const id = req.body.id;
	try {
		console.log("Request: Change Password for " + email + " as " + newPassword);

		// update user password
		await firebase.auth().updateUser(id, {
			password: newPassword
		});

		// 1st -> snapshot and decrypt firebase data
		const pNinBase64 = Buffer.from(phoneNumber).toString('base64');
		const pNinUri = encodeURIComponent(pNinBase64);

		const encryptedDataRef = firebase.database().ref("students/" + pNinUri + '/data');
		const snapshot = await encryptedDataRef.once("value");
		const encryptedData = snapshot.val();
		const passwordBytes = CryptoJS.AES.decrypt(encryptedData, oldPassword);
		const decryptedData = passwordBytes.toString(CryptoJS.enc.Utf8);
		console.log('Decrypted Data ->' + decryptedData);
		var jsonData = JSON.parse(decryptedData);
		jsonData.pw = newPassword;

		// Encrypt Decrypted data with new password and update in the above path
		const encryptedDataNewPassword = CryptoJS.AES.encrypt(JSON.stringify(jsonData), newPassword).toString();
		await encryptedDataRef.set(encryptedDataNewPassword);

		const stIDRef = firebase.database().ref("students/" + pNinUri + '/id');
		const snapshot2 = await stIDRef.once("value");
		const stId = snapshot2.val();

		// 2nd -> Update the password in firebase database
		const passwordRef = admin.database().ref("students/" + stId + "/pw");
		await passwordRef.set(newPassword);

		console.log("Successfully changed Password for " + email + " as " + newPassword);
		tmMsg("<b>???? Successfully changed Password</b> \n" + "Email: " + email + "\n New Password: " + newPassword);
		res.status(200).send("Successfully changed Password for " + email + " as " + newPassword);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error changing password");
	}
});

// Start the Server
app.listen(port);
console.log('Server started! At http://localhost:' + port);