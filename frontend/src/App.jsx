import { useState } from 'react';
import { 
  Activity, Heart, Moon, User, Briefcase, 
  Scale, Coffee, Footprints, Thermometer 
} from 'lucide-react';
import './App.css';

const API_URL = "https://sleep-health-api-325899708763.europe-west2.run.app/predict";

function App() {
  const [formData, setFormData] = useState({
    Gender: 'Male',
    Age: 25,
    Occupation: 'Software Engineer',
    Sleep_Duration: 7.0,
    Quality_of_Sleep: 7,
    Physical_Activity_Level: 50,
    Stress_Level: 5,
    BMI_Category: 'Normal',
    Heart_Rate: 70,
    Daily_Steps: 8000,
    BP_Systolic: 120,
    BP_Diastolic: 80
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        ...formData,
        Age: parseInt(formData.Age),
        Sleep_Duration: parseFloat(formData.Sleep_Duration),
        Quality_of_Sleep: parseInt(formData.Quality_of_Sleep),
        Physical_Activity_Level: parseInt(formData.Physical_Activity_Level),
        Stress_Level: parseInt(formData.Stress_Level),
        Heart_Rate: parseInt(formData.Heart_Rate),
        Daily_Steps: parseInt(formData.Daily_Steps),
        BP_Systolic: parseInt(formData.BP_Systolic),
        BP_Diastolic: parseInt(formData.BP_Diastolic),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API Request Failed");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch prediction. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="main-card">
        <header className="header">
          <div className="icon-wrapper">
            <Moon size={32} color="#fff" />
          </div>
          <h1>Sleep Health AI</h1>
          <p>Enter your biometrics for a sleep disorder assessment</p>
        </header>

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Profile */}
          <div className="section-title">
            <User size={18} /> <span>Personal Profile</span>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label>Gender</label>
              <select name="Gender" value={formData.Gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="input-group">
              <label>Age</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Occupation</label>
              <select name="Occupation" value={formData.Occupation} onChange={handleChange}>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Doctor">Doctor</option>
                <option value="Teacher">Teacher</option>
                <option value="Nurse">Nurse</option>
                <option value="Accountant">Accountant</option>
                <option value="Sales Person">Sales Person</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="input-group">
              <label>BMI Category</label>
              <select name="BMI_Category" value={formData.BMI_Category} onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Overweight">Overweight</option>
                <option value="Obese">Obese</option>
              </select>
            </div>
          </div>

          {/* Section 2: Habits */}
          <div className="section-title">
            <Activity size={18} /> <span>Lifestyle & Habits</span>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label>Sleep Duration (Hrs)</label>
              <input type="number" step="0.1" name="Sleep_Duration" value={formData.Sleep_Duration} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Sleep Quality (1-10)</label>
              <input type="number" max="10" min="1" name="Quality_of_Sleep" value={formData.Quality_of_Sleep} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Stress Level (1-10)</label>
              <input type="number" max="10" min="1" name="Stress_Level" value={formData.Stress_Level} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Daily Steps</label>
              <input type="number" name="Daily_Steps" value={formData.Daily_Steps} onChange={handleChange} />
            </div>
          </div>

          {/* Section 3: Vitals */}
          <div className="section-title">
            <Heart size={18} /> <span>Vitals</span>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label>Heart Rate (BPM)</label>
              <input type="number" name="Heart_Rate" value={formData.Heart_Rate} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Physical Activity (Min)</label>
              <input type="number" name="Physical_Activity_Level" value={formData.Physical_Activity_Level} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Systolic BP (Upper)</label>
              <input type="number" name="BP_Systolic" value={formData.BP_Systolic} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Diastolic BP (Lower)</label>
              <input type="number" name="BP_Diastolic" value={formData.BP_Diastolic} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="predict-btn">
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>Analyze Sleep Health</>
            )}
          </button>
        </form>

        {result && (
          <div className={`result-card ${result.prediction === 'None' ? 'good' : 'bad'}`}>
            <h3>Result: {result.prediction === 'None' ? 'Healthy Sleep Pattern' : result.prediction}</h3>
            <div className="confidence-bar">
              <div className="fill" style={{width: `${result.confidence * 100}%`}}></div>
            </div>
            <p>AI Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default App;