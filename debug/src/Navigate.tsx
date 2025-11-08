import { Link } from "react-router-dom";

const styles = {
  nav: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "16px 24px",
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#667eea",
    fontWeight: "600",
    fontSize: "16px",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
  navLinkHover: {
    backgroundColor: "#f0f0f0",
  },
  spacer: {
    height: "64px",
  },
};

const Navigate = () => {
  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link
            to="/"
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Trust Checker
          </Link>
          <Link
            to="/getname"
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            ID Finder
          </Link>
        </div>
      </nav>
      <div style={styles.spacer} />
    </>
  );
};

export default Navigate;