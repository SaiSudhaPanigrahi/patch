from flask import Flask, jsonify, request;
from flask_talisman import Talisman;
from flask_cors import CORS;
from twilio.twiml.messaging_response import Message, MessagingResponse;
from twilio.twiml.voice_response import Record, Play, VoiceResponse;
from twilio.rest import Client;
from dotenv import load_dotenv;
from nltk.stem.snowball import SnowballStemmer;
from predict import predict;
import os;
import time;
import urllib;
import asyncio;

load_dotenv();

stemmer = SnowballStemmer("english");

# load twilio
# when you load twilio, set the incoming sms webhook to ngrok url
client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"));

app = Flask(__name__);
Talisman(app);
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGIN")}});

sessions = {};

@app.route("/")
def index():
    return "OK";

@app.route("/sms", methods=["POST"])
def sms():
    global sessions;
    if client:
        """
        ImmutableMultiDict([
            ('ToCountry', 'US'), 
            ('ToState', 'IN'),
            ('SmsMessageSid', 'SMd9efdf2b60a3198f9620110a1176959e'),
            ('NumMedia', '0'),
            ('ToCity', ''),
            ('FromZip', '46225'),
            ('SmsSid', 'SMd9efdf2b60a3198f9620110a1176959e'),
            ('FromState', 'IN'),
            ('SmsStatus', 'received'),
            ('FromCity', 'INDIANAPOLIS'),
            ('Body', 'U'),
            ('FromCountry', 'US'),
            ('To', '+13173428661'),
            ('ToZip', ''),
            ('NumSegments', '1'),
            ('MessageSid', 'SMd9efdf2b60a3198f9620110a1176959e'),
            ('AccountSid', 'AC4ee1e825f2535c7b471e3215a2d722ca'),
            ('From', '+13174531186'),
            ('ApiVersion', '2010-04-01')]
        )
        """

        msg = urllib.parse.quote(request.form['Body']);
        from_num = request.form["From"];
        to_num = request.form["To"];

        response = MessagingResponse();
        if msg and from_num:
            if from_num not in sessions:
                response.message("Hello! You've reached Patch. Would you like us to give you a call so we can ask you some questions?")
                sessions[from_num] = [msg];
            else:
                # see how many responses theyve given
                # use that to see what we should say next
                num_responses = len(sessions[from_num]);
                
                if num_responses == 1:
                    # see if yes/no
                    prev_response = stemmer.stem(msg.strip().lower());

                    if prev_response == "yes":
                        response.message("Great! We're calling you now.");
                        client.api.account.calls.create(to=from_num, from_=to_num, url=os.getenv("NGROK_URL") + "/call");
                    elif prev_response == "no":
                        response.message("Okay. We'll implement a text conversation soon. Thanks for using Patch.");
                        del sessions[from_num];
                    else:
                        response.message("Sorry, we didn't understand. Could you say that again?");
                elif num_responses == 2:
                    # this is after the call
                    pass;
        else:
            response.message("Sorry, we couldn't understand your response. Could you try again?");

        return str(response);
    else:
        return "";

@app.route("/call", methods=["POST"])
def call():
    global sessions;
    if client:
        from_num = request.form["From"];
        to_num = request.form["To"];

        if from_num not in sessions:
            sessions[from_num] = [""];

        response = VoiceResponse();
        response.play("https://raw.githubusercontent.com/rasfmar/patch/main/intro.mp3");
        response.record( \
            action=os.getenv("NGROK_URL") + "/record", \
            method="POST", \
            playBeep=True, \
            timeout=5, \
            trim=True, \
            transcribeCallback=os.getenv("NGROK_URL") + "/audio" \
        );
        response.play("https://raw.githubusercontent.com/rasfmar/patch/main/outro.mp3");

        return str(response);
    else:
        return "";

if __name__ == "__main__":
    app.run()

@app.route("/record", methods=["POST"])
def record():
    global sessions;
    if client:
        from_num = request.form["From"];
        to_num = request.form["To"];

        message = "Thanks! We'll be in touch with some helpful information.";

        client.api.account.messages.create( \
            body=message, to=from_num, from_=to_num);

        response = MessagingResponse();
        response.message(message);
        return str(response);
    else:
        return "";


@app.route("/audio", methods=["POST"])
def audio():
    global sessions;
    if client:
        from_num = request.form["From"];
        to_num = request.form["To"];
        transcript = request.form["TranscriptionText"];
        msg = "Oops! We couldn't understand what you said.";
        sentences = [];
        predictions = {
            "physical": 0.0,
            "depression": 0.0,
            "normal": 0.0,
        };

        if transcript:
            splits = ["and", "or", "but", ","];
            temp = stemmer.stem(transcript);
            for item in splits:
                temp = temp.replace(item, '.');
            sentences = [sentence.strip() for sentence in temp.split('.') if sentence.strip()];

        if sentences:
            for sentence in sentences:
                results = predict(sentence);
                for result in results:
                    predictions[result] += results[result];
            for item in predictions:
                predictions[item] /= len(sentences);
            msg = "";
            if predictions["physical"] > 0.25:
                msg += "Because of your symptoms, we believe it would be best if you were tested for coronavirus. ";
            if predictions["depression"] > 0.25:
                msg += ("Also, o" if msg else "O") + "ur prediction is that you may be suffering from diminished mental health. You should know that we're here for you, and we'll provide you guidance on this as well. ";
            if "flu shot" in transcript or "flu vaccine" in transcript:
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes flu vaccinations. ";
            if "hiv" in transcript:
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes HIV tests. ";
            if "coronavirus" in transcript or "covid" in transcript:
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes coronavirus tests. ";
            msg += "Click this link to get access to your personalized report: ";

        client.api.account.messages.create( \
            body=msg, to=from_num, from_=to_num);
        
        response = MessagingResponse();
        response.message(msg);

        del sessions[from_num];

        # sessions[to_num].append("");
        return str(response);
    else:
        return "";