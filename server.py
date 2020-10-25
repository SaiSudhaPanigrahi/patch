from flask import Flask, jsonify, request;
from flask_talisman import Talisman;
from flask_cors import CORS;
from twilio.twiml.messaging_response import Message, MessagingResponse;
from twilio.twiml.voice_response import Record, Play, VoiceResponse;
from twilio.rest import Client;
from dotenv import load_dotenv;
from nltk.stem.snowball import SnowballStemmer;
from predict import predict;
from cassandra.auth import PlainTextAuthProvider;
from cassandra.cluster import Cluster;
from nanoid import generate;
import os;
import time;
import urllib;
import csv;
import json;
import requests;

load_dotenv();

stemmer = SnowballStemmer("english");

# datastax astra
cloud_config= {'secure_connect_bundle': './secure-connect-patch-db.zip'};
auth_provider = PlainTextAuthProvider(os.getenv("ASTRA_USERNAME"), os.getenv("ASTRA_PASSWORD"));
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect();
session.execute( \
    """
    CREATE TABLE IF NOT EXISTS patch_keyspace.records (
        id text PRIMARY KEY,
        obj text);
    """ \
);

# load twilio
# when you load twilio, set the incoming sms webhook to ngrok url
client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"));

app = Flask(__name__);
Talisman(app);
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGIN")}});

sessions = {};

# set up data
flu_limit = 50;
flu_data = [];
with open("data/nyc_flu_shots.csv", "r") as file_:
    read_csv = csv.DictReader(file_);
    for row in read_csv:
        if len(flu_data) < flu_limit:
            flu_data.append(row);

unfiltered_hiv_data = [];
with open("data/nyc_hiv_tests.csv", "r") as file_:
    read_csv = csv.DictReader(file_);
    for row in read_csv:
        unfiltered_hiv_data.append(row);

# geocode hiv data
hiv_limit = 50;
hiv_data = [];
_i = 0;
while len(hiv_data) < hiv_limit and _i < len(unfiltered_hiv_data):
    data = unfiltered_hiv_data[_i];
    if data["Address"] and data["State"]:
        addy = data["Address"] + ' ' + data["Borough"] + ' ' + data["State"] + ' ' + data["Zip Code"];
        addy = urllib.parse.quote(addy.lower().strip()).replace('%20', '+');
        resp = requests.get( \
            f"https://api.radar.io/v1/geocode/forward?query={addy}", \
            headers={"Authorization": os.getenv("RADAR_SECRET")} \
        ).json();

        if "addresses" in resp and len(resp["addresses"]) > 0:
            data["Latitude"] = resp["addresses"][0]["latitude"];
            data["Longitude"] = resp["addresses"][0]["longitude"];
            hiv_data.append(data);
    _i += 1;

bp_limit = 50;
bp_data = [];
with open("data/nyc_bp_tests.csv", "r") as file_:
    read_csv = csv.DictReader(file_);
    for row in read_csv:
        if len(bp_data) < bp_limit and row["Latitude2"] and row["Longitude2"]:
            bp_data.append(row);

unfiltered_cvd_data = [];
with open("data/nyc_cvd_tests.csv", "r") as file_:
    read_csv = csv.DictReader(file_);
    for row in read_csv:
        unfiltered_cvd_data.append(row);

cvd_data = [];
_i = 0;
while _i < len(unfiltered_cvd_data):
    data = unfiltered_cvd_data[_i];
    addy = data["Address"] + ' ' + data["Borough"] + ' ' + data["State"] + ' ' + data["Zip"];
    addy = urllib.parse.quote(addy.lower().strip()).replace('%20', '+');
    resp = requests.get( \
        f"https://api.radar.io/v1/geocode/forward?query={addy}", \
        headers={"Authorization": os.getenv("RADAR_SECRET")} \
    ).json();

    if "addresses" in resp and len(resp["addresses"]) > 0:
        data["Latitude"] = resp["addresses"][0]["latitude"];
        data["Longitude"] = resp["addresses"][0]["longitude"];
        cvd_data.append(data);
    _i += 1;

@app.route("/")
def index():
    return "OK";

@app.route("/sms", methods=["POST"])
def sms():
    global sessions;
    if client:
        """
            ('FromZip', '46225'),
            ('FromState', 'IN'),
            ('FromCity', 'INDIANAPOLIS'),
            ('FromCountry', 'US'),
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
        # response.play("https://raw.githubusercontent.com/rasfmar/patch/main/outro.mp3");

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

        if to_num != os.getenv("TWILIO_NUMBER"):
            from_num, to_num = to_num, from_num;

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

        if to_num != os.getenv("TWILIO_NUMBER"):
            from_num, to_num = to_num, from_num;
        
        original_transcript = request.form["TranscriptionText"];
        transcript = original_transcript.lower();
        msg = "Oops! We couldn't understand what you said.";
        sentences = [];
        predictions = {
            "physical": 0.0,
            "depression": 0.0,
            "normal": 0.0,
        };
        data = {
            "original_transcript": "",
            "sentences": [],
            "performances": [],
            "overall": {
                "physical": 0.0,
                "depression": 0.0,
                "normal": 0.0,
            },
            "hiv": False,
            "flu": False,
            "blood_pressure": False,
            "coronavirus": False,
        };
        data["original_transcript"] = original_transcript;

        if transcript:
            splits = ["also", " and ", " or ", " but ", ","];
            temp = stemmer.stem(transcript);
            for item in splits:
                temp = temp.replace(item, '.');
            sentences = [sentence.strip() for sentence in temp.split('.') if sentence.strip()];

        if sentences:
            data["sentences"] = sentences[:];
            for sentence in sentences:
                results = predict(sentence);
                data["performances"].append(results);
                for result in results:
                    predictions[result] += results[result];
            for item in predictions:
                predictions[item] /= len(sentences);
            data["overall"]["physical"] = predictions["physical"];
            data["overall"]["depression"] = predictions["depression"];
            data["overall"]["normal"] = predictions["normal"];
            msg = "";
            if predictions["physical"] > 0.125:
                msg += "Because of your symptoms, we believe it would be best if you were tested for coronavirus. ";
            if predictions["depression"] > 0.125:
                msg += ("Also, o" if msg else "O") + "ur prediction is that you may be suffering from diminished mental health. You should know that we're here for you, and we'll provide you guidance on this as well. ";
            if "flu" in transcript:
                data["flu"] = True;
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes flu vaccinations. ";
            if "hiv" in transcript or "h i v" in transcript or "h i b" in transcript:
                data["hiv"] = True;
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes HIV tests. ";
            if "corona virus" in transcript or "coronavirus" in transcript or "covid" in transcript:
                data["coronavirus"] = True;
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes coronavirus tests. ";
            if "blood pressure" in transcript:
                data["blood_pressure"] = True;
                msg += ("Additionally, w" if msg else "W") + "e've found a location near you that distributes blood pressure tests. ";
            msg += "Click this link to get access to your personalized report: ";
        
        print(transcript);
        print(str(sentences));
        print(predictions);

        # insert into astra
        # injection is definitely a concern, but this is a 24 hour hackathon
        if session:
            id = generate("abcdefghijklmnopqrstuvwxyz0123456789", size=10);
            session.execute( \
                "INSERT INTO patch_keyspace.records (id, obj) VALUES (%s,%s)", \
                [id, json.dumps(data)] \
            );
            msg += os.getenv("CORS_ORIGIN") + "/" + id;

        client.api.account.messages.create( \
            body=msg, to=from_num, from_=to_num);
        
        response = MessagingResponse();
        response.message(msg);

        del sessions[from_num];

        # sessions[to_num].append("");
        return str(response);
    else:
        return "";

@app.route("/data/flu", methods=["GET"])
def data_flu_all():
    return json.dumps(flu_data);

@app.route("/data/hiv", methods=["GET"])
def data_hiv_all():
    return json.dumps(hiv_data);

@app.route("/data/bp", methods=["GET"])
def data_bp_all():
    return json.dumps(bp_data);

@app.route("/data/cvd", methods=["GET"])
def data_cvd_all():
    return json.dumps(cvd_data);
