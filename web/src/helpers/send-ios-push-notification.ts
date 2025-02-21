// import apn from 'apn';
// import ms from 'ms';

// const cert = `
// -----BEGIN CERTIFICATE-----
// MIIGJTCCBQ2gAwIBAgIIcyUvNyGAEikwDQYJKoZIhvcNAQELBQAwgZYxCzAJBgNV
// BAYTAlVTMRMwEQYDVQQKDApBcHBsZSBJbmMuMSwwKgYDVQQLDCNBcHBsZSBXb3Js
// ZHdpZGUgRGV2ZWxvcGVyIFJlbGF0aW9uczFEMEIGA1UEAww7QXBwbGUgV29ybGR3
// aWRlIERldmVsb3BlciBSZWxhdGlvbnMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkw
// HhcNMjExMTE0MDkxNDAwWhcNMjIxMjE0MDkxMzU5WjCBljEkMCIGCgmSJomT8ixk
// AQEMFGpvbm55YnVyZ2VyLmJlc3RhbmRlMTIwMAYDVQQDDClBcHBsZSBQdXNoIFNl
// cnZpY2VzOiBqb25ueWJ1cmdlci5iZXN0YW5kZTETMBEGA1UECwwKRTk1UTdSNzVC
// QjEYMBYGA1UECgwPSm9uYXRoYW4gQnVyZ2VyMQswCQYDVQQGEwJDSDCCASIwDQYJ
// KoZIhvcNAQEBBQADggEPADCCAQoCggEBAM2jjQi3Ug/N7yUWSSbrPmpTU58ViW7y
// 3vdxb/7fqTd+QiNZ1mTr/MaNBRsVwWRNYLGcgwroL/8T3/etF8b6qZ5J9oLzUvxF
// Su75K2+T8MoRnkELeFtyo6l90S5jW6XlHRdw4goJTeOuR0NObnxFaezx10rWHbXj
// QPdr5PwWGV4Ke7s49cjusOhUl4DS2yMu/f24bm8qLIax6CcFhRL2jmQGwDMMbBaF
// aBMwvoKqgmyCygzDFf017BCnAOqF7Y8UZG21qNE1TrIrotP8A+oajZ+cehK7SyIk
// t/51aJnSbcSZL0xL5Wz3xCpe2CYMTHZ1PjlXL4YSnehxrzdAXKL9SxsCAwEAAaOC
// AnMwggJvMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUiCcXCam2GGCL7Ou69kdZ
// xVJUo7cwggEcBgNVHSAEggETMIIBDzCCAQsGCSqGSIb3Y2QFATCB/TCBwwYIKwYB
// BQUHAgIwgbYMgbNSZWxpYW5jZSBvbiB0aGlzIGNlcnRpZmljYXRlIGJ5IGFueSBw
// YXJ0eSBhc3N1bWVzIGFjY2VwdGFuY2Ugb2YgdGhlIHRoZW4gYXBwbGljYWJsZSBz
// dGFuZGFyZCB0ZXJtcyBhbmQgY29uZGl0aW9ucyBvZiB1c2UsIGNlcnRpZmljYXRl
// IHBvbGljeSBhbmQgY2VydGlmaWNhdGlvbiBwcmFjdGljZSBzdGF0ZW1lbnRzLjA1
// BggrBgEFBQcCARYpaHR0cDovL3d3dy5hcHBsZS5jb20vY2VydGlmaWNhdGVhdXRo
// b3JpdHkwEwYDVR0lBAwwCgYIKwYBBQUHAwIwMAYDVR0fBCkwJzAloCOgIYYfaHR0
// cDovL2NybC5hcHBsZS5jb20vd3dkcmNhLmNybDAdBgNVHQ4EFgQUIXd50Qqt22cn
// gcdnepMzPuE0owgwDgYDVR0PAQH/BAQDAgeAMBAGCiqGSIb3Y2QGAwEEAgUAMBAG
// CiqGSIb3Y2QGAwIEAgUAMIGDBgoqhkiG92NkBgMGBHUwcwwUam9ubnlidXJnZXIu
// YmVzdGFuZGUwBQwDYXBwDBlqb25ueWJ1cmdlci5iZXN0YW5kZS52b2lwMAYMBHZv
// aXAMIWpvbm55YnVyZ2VyLmJlc3RhbmRlLmNvbXBsaWNhdGlvbjAODAxjb21wbGlj
// YXRpb24wDQYJKoZIhvcNAQELBQADggEBAKFAHnZOXy6j9h5135aaPJgPI5YPl7SU
// jvA9PdhETu4q+74qch55os9YzUcKyxYsREqSY/RGXpPqItpb1Zt7/TCmG2C/t4uX
// 4QOPuBPr2uH9kYDAupwMi8r29p0JiWkGnm4tp/heTiwUjyQSP/h7SecKrDWXxlS5
// alfL364TK+HFGLidjZOaY4RBGLAgClrBGJ/B/QiPdQLLTJ4gs9YFaLi7VIWD3yO6
// PYsKJNgoOGry9TLbbj56a1ZW4SDze+0FRF/4917uXjQE1lbZ64R1jTqRk7HHWM+9
// sIUdiLCW5oLoNSe9DYFKYvH58m/hJM9ItvKNtigt9NetD+JAH546HXU=
// -----END CERTIFICATE-----
// `;

// const key = `
// Bag Attributes
//     friendlyName: Apple Push Services: jonnyburger.bestande
//     localKeyID: 21 77 79 D1 0A AD DB 67 27 81 C7 67 7A 93 33 3E E1 34 A3 08 
// subject=/UID=jonnyburger.bestande/CN=Apple Push Services: jonnyburger.bestande/OU=E95Q7R75BB/O=Jonathan Burger/C=CH
// issuer=/C=US/O=Apple Inc./OU=Apple Worldwide Developer Relations/CN=Apple Worldwide Developer Relations Certification Authority
// -----BEGIN CERTIFICATE-----
// MIIGJTCCBQ2gAwIBAgIIcyUvNyGAEikwDQYJKoZIhvcNAQELBQAwgZYxCzAJBgNV
// BAYTAlVTMRMwEQYDVQQKDApBcHBsZSBJbmMuMSwwKgYDVQQLDCNBcHBsZSBXb3Js
// ZHdpZGUgRGV2ZWxvcGVyIFJlbGF0aW9uczFEMEIGA1UEAww7QXBwbGUgV29ybGR3
// aWRlIERldmVsb3BlciBSZWxhdGlvbnMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkw
// HhcNMjExMTE0MDkxNDAwWhcNMjIxMjE0MDkxMzU5WjCBljEkMCIGCgmSJomT8ixk
// AQEMFGpvbm55YnVyZ2VyLmJlc3RhbmRlMTIwMAYDVQQDDClBcHBsZSBQdXNoIFNl
// cnZpY2VzOiBqb25ueWJ1cmdlci5iZXN0YW5kZTETMBEGA1UECwwKRTk1UTdSNzVC
// QjEYMBYGA1UECgwPSm9uYXRoYW4gQnVyZ2VyMQswCQYDVQQGEwJDSDCCASIwDQYJ
// KoZIhvcNAQEBBQADggEPADCCAQoCggEBAM2jjQi3Ug/N7yUWSSbrPmpTU58ViW7y
// 3vdxb/7fqTd+QiNZ1mTr/MaNBRsVwWRNYLGcgwroL/8T3/etF8b6qZ5J9oLzUvxF
// Su75K2+T8MoRnkELeFtyo6l90S5jW6XlHRdw4goJTeOuR0NObnxFaezx10rWHbXj
// QPdr5PwWGV4Ke7s49cjusOhUl4DS2yMu/f24bm8qLIax6CcFhRL2jmQGwDMMbBaF
// aBMwvoKqgmyCygzDFf017BCnAOqF7Y8UZG21qNE1TrIrotP8A+oajZ+cehK7SyIk
// t/51aJnSbcSZL0xL5Wz3xCpe2CYMTHZ1PjlXL4YSnehxrzdAXKL9SxsCAwEAAaOC
// AnMwggJvMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUiCcXCam2GGCL7Ou69kdZ
// xVJUo7cwggEcBgNVHSAEggETMIIBDzCCAQsGCSqGSIb3Y2QFATCB/TCBwwYIKwYB
// BQUHAgIwgbYMgbNSZWxpYW5jZSBvbiB0aGlzIGNlcnRpZmljYXRlIGJ5IGFueSBw
// YXJ0eSBhc3N1bWVzIGFjY2VwdGFuY2Ugb2YgdGhlIHRoZW4gYXBwbGljYWJsZSBz
// dGFuZGFyZCB0ZXJtcyBhbmQgY29uZGl0aW9ucyBvZiB1c2UsIGNlcnRpZmljYXRl
// IHBvbGljeSBhbmQgY2VydGlmaWNhdGlvbiBwcmFjdGljZSBzdGF0ZW1lbnRzLjA1
// BggrBgEFBQcCARYpaHR0cDovL3d3dy5hcHBsZS5jb20vY2VydGlmaWNhdGVhdXRo
// b3JpdHkwEwYDVR0lBAwwCgYIKwYBBQUHAwIwMAYDVR0fBCkwJzAloCOgIYYfaHR0
// cDovL2NybC5hcHBsZS5jb20vd3dkcmNhLmNybDAdBgNVHQ4EFgQUIXd50Qqt22cn
// gcdnepMzPuE0owgwDgYDVR0PAQH/BAQDAgeAMBAGCiqGSIb3Y2QGAwEEAgUAMBAG
// CiqGSIb3Y2QGAwIEAgUAMIGDBgoqhkiG92NkBgMGBHUwcwwUam9ubnlidXJnZXIu
// YmVzdGFuZGUwBQwDYXBwDBlqb25ueWJ1cmdlci5iZXN0YW5kZS52b2lwMAYMBHZv
// aXAMIWpvbm55YnVyZ2VyLmJlc3RhbmRlLmNvbXBsaWNhdGlvbjAODAxjb21wbGlj
// YXRpb24wDQYJKoZIhvcNAQELBQADggEBAKFAHnZOXy6j9h5135aaPJgPI5YPl7SU
// jvA9PdhETu4q+74qch55os9YzUcKyxYsREqSY/RGXpPqItpb1Zt7/TCmG2C/t4uX
// 4QOPuBPr2uH9kYDAupwMi8r29p0JiWkGnm4tp/heTiwUjyQSP/h7SecKrDWXxlS5
// alfL364TK+HFGLidjZOaY4RBGLAgClrBGJ/B/QiPdQLLTJ4gs9YFaLi7VIWD3yO6
// PYsKJNgoOGry9TLbbj56a1ZW4SDze+0FRF/4917uXjQE1lbZ64R1jTqRk7HHWM+9
// sIUdiLCW5oLoNSe9DYFKYvH58m/hJM9ItvKNtigt9NetD+JAH546HXU=
// -----END CERTIFICATE-----
// Bag Attributes
//     friendlyName: Jonathan Burger
//     localKeyID: 21 77 79 D1 0A AD DB 67 27 81 C7 67 7A 93 33 3E E1 34 A3 08 
// Key Attributes: <No Attributes>
// -----BEGIN PRIVATE KEY-----
// MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNo40It1IPze8l
// Fkkm6z5qU1OfFYlu8t73cW/+36k3fkIjWdZk6/zGjQUbFcFkTWCxnIMK6C//E9/3
// rRfG+qmeSfaC81L8RUru+Stvk/DKEZ5BC3hbcqOpfdEuY1ul5R0XcOIKCU3jrkdD
// Tm58RWns8ddK1h2140D3a+T8FhleCnu7OPXI7rDoVJeA0tsjLv39uG5vKiyGsegn
// BYUS9o5kBsAzDGwWhWgTML6CqoJsgsoMwxX9NewQpwDqhe2PFGRttajRNU6yK6LT
// /APqGo2fnHoSu0siJLf+dWiZ0m3EmS9MS+Vs98QqXtgmDEx2dT45Vy+GEp3oca83
// QFyi/UsbAgMBAAECggEAKajxoItrD5Kb2TqblUvhOC8raLY3Qofnjd+oXc03/esR
// QRIpMgbxDdRx7VvJ8yUN6s2XarVBS/7dx9KEV6ZeiJfZXgwnir4LAUDvgMpK5NUO
// 54SIXJZr+6FmqGwum/w/mYkf8gKSiga7nzIbhgeV/w+7mwinujqQ5c8w87USbI98
// IT9QQ1GzhX6sM+LlBN0WT+HdfikzBZ0M2hgGhbauYfQzc99cPWpqF7mmVSGk9TmT
// sxuuiUXRkDjKWMgONZaTIX3C7LPSi4Oq/IG8CQ4exCF7mU3zwpbiZPFDdXTGhdVi
// 0Hv1xc/2EtfBzsxYbfC0kQT+P0XiYPSt/wMx1HMxAQKBgQDslGhG22bybTH85v0G
// sowSkzCIFFVS35vxst0fhMsoJ4oulGIsCn8kFXXO/0tcBnioMFB8GU42Jrvm6ZQg
// PTDvgFVp90vvBWPDLGcKEt2/Mzh82JQVdNSNzwFsKV4ALq4aUFUyzsXcDujml7Ya
// /+ZLIZ3s2xrC+G9JigJ5C7P8gQKBgQDehPBQeZxb6Q4YIbqqAZK4Q1QGhAq4Flak
// ntR9vUUtRD7rC7l/6VgCWrXdC7YbkJ88vtzPb43N5ivCuYma7MzJg4XWGvjfCrJY
// i8iQDCSSr0D/n0YY6vtsTgpCEe67FdpBi9O3WKbex2Ck8KZhZC45VyEur+bWHsj6
// V7566zLpmwKBgDLQ6dkWdXVrKQqWnxDaNyYiQZFpNK6ZY0i2T7LedjjIzXCV5MRq
// +MZKacStp4U7ypzty8vsL5WIGmJOF8gY/LLlEPOy77eGo9gfaH6McN8J5H9EkgJN
// 1v4i0b5m4E8Pt8vlJ3fDXFKZTUOCoNYJ03Cd5usiYQwyCs1z/HX9ooqBAoGAAu/c
// QCOqxafI0Na5IP9OUXJKDJ/3iEB7OkcCZPp3jEZnUjDgbOjGiZlq5xT9fVWmVGXs
// gixlwb70+uf6Afp4JXy/6niGqmL4waRurEAMx4bao8UVZsTLNr288uxLq1p5e/39
// eGEKKsyU4PhwKb7pwUX+ISCfOlpDqtI3qGWsUVsCgYEAw7142Q4U9+HewxKCcmHh
// wJmDN7NWUPMOc2xoEuEsr8Ot0UFACoJ+0WXekwuJ3Op2jXiP1If1h6TIVclpeCD/
// fJ209a4eVMuMohqn6joSwj1OcFBSCnX/9RiYy9V3ulS8vtY5Kuaz0nF4md/sqGb4
// roya1Jec53U5r3OsZp4SXOs=
// -----END PRIVATE KEY-----
// `;

// const options = {
// 	cert,
// 	key,
// 	production: process.env.NODE_ENV === 'production',
// };

// const apnProvider = new apn.Provider(options);

// export const sendIosPushNotification = ({
// 	deviceToken,
// 	channel,
// 	title,
// 	subtitle,
// 	uni_identifier,
// 	university,
// }: {
// 	deviceToken: string;
// 	channel: string;
// 	title: string;
// 	subtitle: string;
// 	uni_identifier: string;
// 	university: string;
// }) => {
// 	const note = new apn.Notification();
// 	note.sound = 'ping.aiff';
// 	note.expiry = Math.round((Date.now() + ms('1d')) / 1000);
// 	// @ts-expect-error
// 	note.title = title;
// 	// @ts-expect-error
// 	note.body = subtitle;
// 	note.topic = 'jonnyburger.bestande';
// 	note.threadId = channel;
// 	// @ts-expect-error
// 	note.pushType = 'alert';
// 	note.mutableContent = false;
// 	note.payload = {uni_identifier, university};
// 	return apnProvider.send(note, deviceToken);
// };
