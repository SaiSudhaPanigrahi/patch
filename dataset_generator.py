from nltk.stem.snowball import SnowballStemmer;

stemmer = SnowballStemmer("english");


depression_sentences = [
    "I don't feel like eating",
    "I don't feel like moving",
    "I don't want to eat",
    "I lost my appetite",
    "I don't like eating",
    "I don't have an appetite",
    "I'm hurting",
    "I'm in pain",
    "I want to kill myself",
    "I tried to kill myself",
    "I want to hang myself",
    "I tried to hang myself",
    "I want to end my life",
    "I don't feel like living",
    "I don't want to live",
    "I want to die",
    "I'm not okay",
    "I want to hurt myself",
    "I keep hurting myself",
    "I'm hurting myself",
    "I've been hurting myself",
    "I'm eating much less",
    "I'm eating much more",
    "I'm eating less",
    "I'm eating more",
    "I hate living",
    "I hate my life",
    "I hate",
    "I'm sad",
    "I'm mad",
    "I feel sad",
    "I feel angry",
    "I feel mad",
    "I feel uncomfortable",
    "I feel like killing myself",
    "I feel like hurting myself",
    "I feel like ending my life",
    "I feel like dying",
    "I just want to die",
    "I don't know who to go to",
    "I don't know who to talk to",
    "I don't trust anyone",
    "I don't trust people",
    "I don't have energy",
    "I don't feel like doing anything",
    "I can't stop smoking",
    "I can't stop eating",
    "I feel tired",
    "I feel unmotivated",
    "I'm not motivated",
    "I'm unmotivated",
    "I'm not interested",
    "I feel hopeless",
    "I'm hopeless",
    "I feel helpless",
    "I'm helpless",
    "I feel worthless",
    "I'm worthless",
    "I feel worthless",
    "I'm angry",
    "I'm uncomfortable",
    "I can't concentrate",
    "I'm ashamed",
    "I feel ashamed",
    "I don't feel like concentrating",
    "I don't want to eat",
    "I don't want to move",
    "What's the point",
    "I haven't been doing as well",
    "I haven't been as motivated",
    "I haven't been as happy",
    "I haven't been as pleased",
    "I haven't been as good",
    "I haven't been as great",
    "I haven't been as excited",
    "I haven't been as motivated",
    "I haven't been as comfortable",
    "I don't have a support group",
    "I need a support group",
    "I don't have a support system",
    "I need a support system",
    "I feel like no one likes me",
    "I feel like no one loves me",
    "I feel lonely",
    "I feel alone",
    "I'm lonely",
    "I'm alone",
    "I'm not happy",
    "I don't feel happy",
];

physical_sentences = [
    "I have the flu",
    "I'm coughing",
    "I can't stop coughing",
    "I'm sneezing",
    "I can't stop sneezing",
    "I'm vomiting",
    "I can't stop vomiting",
    "I have diarrhea",
    "I have the chills",
    "My nose is running",
    "My nose won't stop running",
    "I have a runny nose",
    "I have a headache",
    "My head won't stop hurting",
    "My head hurts",
    "My chest hurts",
    "My lungs hurt",
    "My throat hurts",
    "My throat is sore",
    "I keep coughing",
    "I keep sneezing",
    "I want to vomit",
    "I feel hot",
    "My throat feels sore",
    "I keep sweating",
    "I don't feel like eating",
    "I don't feel like moving",
    "I don't want to eat",
    "I lost my appetite",
    "I don't like eating",
    "I don't have an appetite",
    "I need a flu shot",
    "I don't have a flu shot",
    "I didn't get my flu shot",
    "I never got a flu shot",
    "I need a flu vaccine",
    "I don't have a flu vaccine",
    "I didn't get my flu vaccine",
    "I never got a flu vaccine",
    "I need to be vaccinated",
    "I have pink eye",
    "My eyes hurt",
    "I'm hurting",
    "I'm in pain",
    "I can't taste",
    "I can't taste anything",
    "I can't smell",
    "I can't smell anything",
    "I can't sense flavors",
    "I'm short of breath",
    "I'm nauseous",
    "I feel nauseous",
    "I'm coughing phlegm",
    "It hurts to swallow",
    "It hurts to eat",
    "It hurts to walk",
    "It hurts to move",
];

normal_sentences = [
    "I don't have the flu",
    "I'm not coughing",
    "I'm not sneezing",
    "I'm not vomiting",
    "I don't have diarrhea",
    "I don't have the chills",
    "My nose isn't running",
    "I don't have a runny nose",
    "I don't have a headache",
    "My head isn't hurting",
    "My head doesn't hurt",
    "My chest doesn't hurt",
    "My chest isn't hurting",
    "My lungs aren't hurting",
    "My lungs don't hurt",
    "My throat doesn't hurt",
    "My throat isn't sore",
    "I don't keep coughing",
    "I don't keep sneezing",
    "I don't want to vomit",
    "I don't feel hot",
    "My throat doesn't feel sore",
    "My throat isn't sore",
    "I don't keep sweating",
    "I feel okay",
    "I feel normal",
    "I feel fine",
    "I feel great",
    "I feel awesome",
    "I feel excellent",
    "I'm not bad",
    "I don't feel bad",
    "I'm fine",
    "I'm okay",
    "I'm normal",
    "I'm great",
    "I'm not very hot",
    "I'm not hot",
    "I can eat",
    "I can smell",
    "I can breathe",
    "I'm not short of breath",
    "I can taste",
    "I can sense flavors",
    "I have an appetite",
    "I don't feel like coughing",
    "I don't feel like sneezing",
    "I don't feel like vomiting",
    "I'm not nauseous",
    "I'm not coughing phlegm",
    "I don't need a flu shot",
    "I have a flu shot",
    "I got my flu shot",
    "I already got a flu shot",
    "I don't need a flu vaccine",
    "I have a flu vaccine",
    "I got my flu vaccine",
    "I already got a flu vaccine",
    "I have my appetite",
    "I have an appetite",
    "I like eating",
    "I'm not hurting",
    "I'm not in pain",
    "I don't want to kill myself",
    "I want to live",
    "I don't want to die",
    "I don't want to end my life",
    "I feel like living",
    "I love",
    "I like",
    "I love life",
    "I like life",
    "I don't want to hurt myself",
    "I don't keep hurting myself",
    "I'm not hurting myself",
    "I've not been hurting myself",
    "I haven't been hurting myself",
    "I love living",
    "I like living",
    "I love my life",
    "I love my life",
    "I don't hate",
    "I'm not sad",
    "I don't feel sad",
    "I'm not mad",
    "I don't feel mad",
    "I don't feel angry",
    "I don't feel uncomfortable",
    "I don't feel like killing myself",
    "I don't feel like hurting myself",
    "I don't feel like ending my life",
    "I don't feel like dying",
    "I know who to go to",
    "I know who to talk to",
    "I trust",
    "I trust anyone",
    "I trust people",
    "I have energy",
    "I feel energetic",
    "I feel like doing things",
    "I've stopped smoking",
    "I have stopped smoking",
    "I don't smoke",
    "I don't feel tired",
    "I feel motivated",
    "I'm motivated",
    "I'm interested",
    "I don't feel hopeless",
    "I'm not hopeless",
    "I don't feel helpless",
    "I'm not helpless",
    "I don't feel worthless",
    "I'm not worthless",
    "I feel like I have worth",
    "I'm angry",
    "I'm comfortable",
    "I'm not ashamed",
    "I don't feel ashamed",
    "I can concentrate",
    "I feel like concentrating",
    "I want to move",
    "I feel like moving",
    "I have been doing as well",
    "I've been doing well",
    "I have been as motivated",
    "I've been motivated",
    "I have been as happy",
    "I've been happy",
    "I'm happy",
    "I'm grateful",
    "I have been as pleased",
    "I've been pleased",
    "I'm pleased",
    "I have been good",
    "I've been good",
    "I have been as great",
    "I've been great",
    "I'm great",
    "I have been as excited",
    "I've been excited",
    "I'm excited",
    "I have been as motivated",
    "I've been motivated",
    "I have been comfortable",
    "I've been comfortable",
];

# thanks https://github.com/tdhoward/pyTypo/blob/master/tpo.py
keys_nearby = {
    'a': ['q','w','s','z'],
    'b': ['v','g'],
    'c': ['x','d','f','v'],
    'd': ['s','e','r','f','c','x'],
    'e': ['r','d','s','w'], # 3, 4
    'f': ['r','t','g','v','c','d'],
    'g': ['t','b','v','f'],
    'h': ['y','u','j','n'],
    'i': ['o','k','j','u'], # 8, 9
    'j': ['u','i','k','m','n','h'],
    'k': ['i','o','l',',','m','j'],
    'l': ['o','p',';','.',',','k'],
    'm': ['k',',','n','j'],
    'n': ['h','j','m'],
    'o': ['p','l','k','i'], # 0, 9
    'p': ['[',';','l','o'], #0, -
    'q': ['w','a'],  # 2, 1
    'r': ['t','f','d','e'], # 4,5
    's': ['e','d','x','z','a','w'],
    't': ['g','f','r'],  # 5, 6
    'u': ['i','j','h','y'],  # 7, 8
    'v': ['g','b','c','f'],
    'w': ['e','s','a','q'],  #3, 2
    'x': ['d','c','z','s'],
    'y': ['u','h'], # 7
    'z': ['s','x','a'],
}

def main():
    data = {};
    for s in depression_sentences:
        s = stemmer.stem(s);
        sents = [s];
        words = s.split(' ');

        # reverse letters
        for i in range(len(s) - 1):
            tempStr = s[:i] + s[i + 1] + s[i] + s[i+2:];
            sents.append(tempStr);

        # wrong letters
        # should propogate through all sentences but whatever i guess
        for i in range(len(s)):
            if s[i] in keys_nearby:
                keys = keys_nearby[s[i]];
                for k in keys:
                    tempStr = s[:i] + k + s[i+1:];
                    sents.append(tempStr);

        # removed letters
        for i in range(len(s)):
            tempStr = s[:i] + s[i+1:];
            sents.append(tempStr);
        
        # extra letters
        for i in range(len(s)):
            if s[i] in keys_nearby:
                keys = keys_nearby[s[i]];
                keys.append(s[i]);
                for k in keys:
                    tempStr = s[:i] + k + s[i:];
                    sents.append(tempStr);
                    tempStr = s[:i+1] + k + s[i+1:];
                    sents.append(tempStr);

        for sn in sents:
            data[sn] = "depression";

    for s in physical_sentences:
        s = stemmer.stem(s);
        sents = [s];
        words = s.split(' ');

        # reverse letters
        for i in range(len(s) - 1):
            tempStr = s[:i] + s[i + 1] + s[i] + s[i+2:];
            sents.append(tempStr);

        # wrong letters
        # should propogate through all sentences but whatever i guess
        for i in range(len(s)):
            if s[i] in keys_nearby:
                keys = keys_nearby[s[i]];
                for k in keys:
                    tempStr = s[:i] + k + s[i+1:];
                    sents.append(tempStr);

        # removed letters
        for i in range(len(s)):
            tempStr = s[:i] + s[i+1:];
            sents.append(tempStr);
        
        # extra letters
        for i in range(len(s)):
            if s[i] in keys_nearby:
                keys = keys_nearby[s[i]];
                keys.append(s[i]);
                for k in keys:
                    tempStr = s[:i] + k + s[i:];
                    sents.append(tempStr);
                    tempStr = s[:i+1] + k + s[i+1:];
                    sents.append(tempStr);

        for sn in sents:
            data[sn] = "physical";
    
    for s in normal_sentences:
        s = stemmer.stem(s);
        sents = [s];
        words = s.split(' ');

        # reverse letters
        for i in range(len(s) - 1):
            tempStr = s[:i] + s[i + 1] + s[i] + s[i+2:];
            sents.append(tempStr);

        # wrong letters
        # should propogate through all sentences but whatever i guess
        for i in range(len(s)):
            if s[i] in keys_nearby:
                keys = keys_nearby[s[i]];
                for k in keys:
                    tempStr = s[:i] + k + s[i+1:];
                    sents.append(tempStr);

        # removed letters
        for i in range(len(s)):
            tempStr = s[:i] + s[i+1:];
            sents.append(tempStr);
        
        # extra letters
        for i in range(len(s)):
            if s[i] in keys_nearby:
                keys = keys_nearby[s[i]];
                keys.append(s[i]);
                for k in keys:
                    tempStr = s[:i] + k + s[i:];
                    sents.append(tempStr);
                    tempStr = s[:i+1] + k + s[i+1:];
                    sents.append(tempStr);

        for sn in sents:
            data[sn] = "normal";

    csv = "";

    for sn in data:
        csv += f"\"{sn}\",{data[sn]}\n";
    
    with open("data.csv", "w") as f:
        f.write(csv);

    print("exported");

if __name__ == "__main__":
    main();