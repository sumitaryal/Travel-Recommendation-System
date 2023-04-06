import numpy as np

class TfidfVectorizer:
    def __init__(self):
        self.vocab = {} # initialize an empty dictionary to store the vocabulary
        self.idf = None # initialize idf as None
        
    def fit(self, X):
        # Create the vocabulary
        vocab_idx = 0
        for doc in X:
            for word in doc.split(): # split each document into words
                if word not in self.vocab: # check if the word is already in the vocabulary
                    self.vocab[word] = vocab_idx # add the word to the vocabulary
                    vocab_idx += 1
        
        # Compute the IDF values
        n_docs = len(X)
        self.idf = np.zeros(len(self.vocab)) # initialize idf as a zero array of length n_words
        for word, idx in self.vocab.items(): # loop over all words in the vocabulary
            count = 0
            for doc in X:
                if word in doc.split(): # check if the word occurs in the document
                    count += 1
            self.idf[idx] = np.log(n_docs / (count + 1))  # calculate IDF and store in idf
        
        return self
    
    def transform(self, X):
        # Convert the documents to vectors using the TF-IDF weighting
        n_docs = len(X)
        n_words = len(self.vocab)
        X_tfidf = np.zeros((n_docs, n_words)) # initialize the output array as a zero array of shape (n_docs, n_words)
        for i, doc in enumerate(X):
            word_counts = {}
            for word in doc.split(): # count the occurrences of each word in the document
                if word not in word_counts:
                    word_counts[word] = 0
                word_counts[word] += 1
            for word, count in word_counts.items(): # loop over all words in the document
                if word in self.vocab:
                    tf = count / len(doc.split()) # compute the term frequency (TF)
                    idf = self.idf[self.vocab[word]] # look up the IDF value for the word
                    X_tfidf[i, self.vocab[word]] = tf * idf # compute the TF-IDF value and store in the output array
        
        return X_tfidf