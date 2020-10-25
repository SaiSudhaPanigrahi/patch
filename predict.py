# from google.cloud import automl_v1
# from google.cloud.automl_v1.proto import service_pb2
from google.api_core.client_options import ClientOptions
from google.cloud import automl
from dotenv import load_dotenv;
load_dotenv();

model_name = "projects/932962647617/locations/us-central1/models/TCN4385233902105526272";

def predict(content):
    options = ClientOptions(api_endpoint="automl.googleapis.com");
    prediction_client = automl.PredictionServiceClient(client_options=options);
    payload = {"text_snippet": {"content": content, "mime_type": "text/plain"} };
    request = prediction_client.predict(name=model_name, payload=payload);

    data = {};
    for item in request.payload:
        data[item.display_name] = item.classification.score;

    return data;
