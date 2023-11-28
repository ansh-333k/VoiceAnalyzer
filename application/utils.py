import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.util import ngrams

def preprocess(text):
  text = text.lower()
  text = re.sub(r'http\S+', ' ', text)
  text = re.sub(r'\d+', ' ', text)
  text = re.sub(r'[^\w\s]', ' ', text)
  text = re.sub(r'\s+', ' ', text).strip()
  words = word_tokenize(text)
  stop_words = set(stopwords.words('english'))
  words = [word for word in words if word not in stop_words]
  lemmatizer = WordNetLemmatizer()
  words = [lemmatizer.lemmatize(word) for word in words]
  words = [word for word in words if len(word) > 2]
  words = [word for word in words if word.isalpha()]
  return words


def extract_phrases(text):
  phrases = []
  for i in range(2, 5):
    phrases += ngrams(text.split(), i)
  return phrases


def similarity(data):
  del data['other']
  user = set(data.pop('user'))
  c, u, o, l = 0, 0, 0, []
  for key, value in data.items():
    for v in user.union(set(value)): 
      if v in user: u += 1
      if v in set(value): o += 1
      if v in user and v in set(value): c += 1
    l.append([key, round((c * 100) / ((u**0.5) * (o**0.5)), 2)])
  return sorted(l, key=lambda x: x[1], reverse=True)