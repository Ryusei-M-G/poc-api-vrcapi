const VRCHAT_API_BASE = "https://api.vrchat.cloud/api/1";

export const getVrcID = async (req, res) => {
  console.log("--- [DEBUG] getVrcID function started ---");
  const { displayName, authToken } = req.body;

  if (!authToken) {
    return res.status(400).json({
      message: "bad request. please send authToken."
    });
  }

  console.log(`--- [DEBUG] Received displayName: ${displayName} ---`);

  if (!displayName) {
    return res.status(400).json({ message: "bad request. please send displayName." });
  }

  try {
    console.log(`--- [DEBUG] Calling VRChat API for: ${displayName} ---`);
    const response = await fetch(`${VRCHAT_API_BASE}/users?search=${encodeURIComponent(displayName)}&n=1`, {
      headers: {
        "User-Agent": "poc-vrcapi/1.0.0",
        "Cookie": `auth=${authToken}`
      }
    });
    console.log(`--- [DEBUG] VRChat API response status: ${response.status} ---`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`--- [DEBUG] API response not OK. Body: ${errorText} ---`);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const users = await response.json();
    console.log(`--- [DEBUG] Successfully parsed JSON. Found ${users.length} user(s). ---`);

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
        userId: null,
        displayName: null
      });
    }

    const exactMatch = users.find(user => user.displayName === displayName);

    if (!exactMatch) {
      return res.status(404).json({
        message: "Exact match not found",
        userId: null,
        displayName: null
      });
    }

    console.log(`--- [DEBUG] Exact match found: ${exactMatch.id} ---`);
    return res.status(200).json({
      message: "User found",
      userId: exactMatch.id,
      displayName: exactMatch.displayName
    });
  } catch (error) {
    console.error("--- [DEBUG] CRITICAL ERROR in getVrcID catch block ---", error);
    return res.status(500).json({
      message: "Failed to search users",
      error: error.message
    });
  }
};