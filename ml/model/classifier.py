import numpy as np
from sklearn.ensemble import RandomForestClassifier

class NumberClassifier:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=10)
        self._train_sample_model()
    
    def _train_sample_model(self):

        X = np.random.rand(100, 4)
        y = np.random.randint(0, 5, 100)
        self.model.fit(X, y)
    
    def predict(self, features):
        features = np.array(features).reshape(1, -1)
        prediction = self.model.predict(features)[0]
        probability = np.max(self.model.predict_proba(features)[0])
        
        return {
            "predicted_class": int(prediction),
            "confidence": float(probability)
        } 