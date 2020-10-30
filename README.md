# patch
## What is this?
This is a virtual healthcare assistant I created in 24 hours for UB Hacking 2020. Using a Twilio-integrated Flask API, it allows for users to call a number, describe their symptoms, and generate a personalized report provided preliminary medical guidance, leveraging a deep learning model I trained to classify sentences. It also shows users where to go for flu vaccines, coronavirus tests, HIV tests, and blood pressure checkups. Please see the [Devpost](https://devpost.com/software/patch-u3a2bf)

## How do I use this?
### General
You'll need a radar.io account, a mapbox.com account, a Twilio account with a paid number, a deployed frontend and backend (using ngrok), a DataStax Astra account, and a Google Cloud account with access to a trained deep learning model that classifies sentences into "physical" and "depression" symptoms.

### Environment
Pip3 requirements are in requirements.txt. This uses venv. There is an example.env file that must be filled out, and a constants.example.js file in the frontend (client).

## Why?
I attended UB Hacking 2020. I thought this was a cool intersection between healthcare and computer science. I'm pretty happy with it, considering it's my first hackathon.

## Other stuff 
* [x] fix detecting flu/hiv/coronavirus test/vaccines in transcript
* [x] client
* [x] requirements
* [ ] more coronavirus test data
* [ ] train a better AI model lol
* [ ] allow for text convo instead of voice (last priority)
