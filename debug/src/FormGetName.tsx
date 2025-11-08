import axios from "axios";
import { useState } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center" as const,
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    boxSizing: "border-box" as const,
    outline: "none",
  },
  inputFocus: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  button: {
    width: "100%",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
  result: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
  },
  resultError: {
    backgroundColor: "#ffebee",
    borderLeft: "4px solid #f44336",
  },
  resultSuccess: {
    backgroundColor: "#e8f5e9",
    borderLeft: "4px solid #4caf50",
  },
  resultTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  resultContent: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "6px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#555",
    overflowX: "auto" as const,
    fontFamily: "'Courier New', monospace",
  },
};

const FormGetName = () => {
  const [displayName, setDisplayName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    if (!displayName) {
      alert("Please enter a Display Name");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:3000/api/getVrcId", {
        displayName: displayName,
      });
      setResult(response.data);
    } catch (error: any) {
      setResult({
        error: true,
        message: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    ...styles.input,
    ...(isFocused ? styles.inputFocus : {}),
  };

  const buttonStyle = {
    ...styles.button,
    ...(loading ? styles.buttonDisabled : {}),
    ...(isHovered && !loading ? styles.buttonHover : {}),
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>VRChat User ID Finder</h1>

        <div style={styles.formGroup}>
          <label style={styles.label}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter display name"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleClick}
          disabled={loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={buttonStyle}
        >
          {loading ? "Searching..." : "Find User ID"}
        </button>

        {result && (
          <div
            style={{
              ...styles.result,
              ...(result.error ? styles.resultError : styles.resultSuccess),
            }}
          >
            <div style={styles.resultTitle}>
              {result.error ? "Error" : "Result"}
            </div>
            {result.error ? (
              <div style={styles.resultContent}>{result.message}</div>
            ) : (
              <div style={styles.resultContent}>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Display Name:</strong> {result.displayName}
                </div>
                <div>
                  <strong>User ID:</strong> {result.userId}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormGetName;