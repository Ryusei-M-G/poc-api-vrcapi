const VRCHAT_API_BASE = "https://api.vrchat.cloud/api/1";

export const getVrcID = async (req, res) => {
  const { displayName } = req.body;
  const authToken = "authcookie_86709dae-d042-475c-a364-7c14d5166d0b";

  if (!displayName) {
    return res.status(400).json({ message: "bad request. please send displayName." });
  }

  try {
    const response = await fetch(`${VRCHAT_API_BASE}/users?search=${encodeURIComponent(displayName)}&n=1`, {
      headers: {
        "User-Agent": "poc-vrcapi/1.0.0",
        "Cookie": `auth=${authToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const users = await response.json();

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

    return res.status(200).json({
      message: "User found",
      userId: exactMatch.id,
      displayName: exactMatch.displayName
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to search users",
      error: error.message
    });
  }
};