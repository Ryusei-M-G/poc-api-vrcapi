const VRCHAT_API_BASE = "https://api.vrchat.cloud/api/1";

export const getTrust = async (req, res) => {
  console.log("getTrust called");
  console.log("Request body:", req.body);
  console.log("Request method:", req.method);

  const { USER_ID } = req.body;
  console.log("USER_ID:", USER_ID);

  const authToken = "authcookie_86709dae-d042-475c-a364-7c14d5166d0b";

  if (!USER_ID || !USER_ID.startsWith("usr_")) {
    console.log("Validation failed - USER_ID invalid");
    return res.status(400).json({ message: "bad request. please send vrchat userid." });
  }

  console.log("Validation passed, fetching user data...");

  try {
    console.log(`Fetching: ${VRCHAT_API_BASE}/users/${USER_ID}`);
    const response = await fetch(`${VRCHAT_API_BASE}/users/${USER_ID}`, {
      headers: {
        "User-Agent": "poc-vrcapi/1.0.0",
        "Cookie": `auth=${authToken}`
      }
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log("User data fetched successfully:", data.id, data.displayName);

    const tags = data.tags || [];
    console.log("All tags:", tags);
    const trustTags = tags.filter((tag) => tag.startsWith("system_trust_"));
    console.log("Trust tags found:", trustTags);

    if (trustTags.length === 0) {
      console.log("No trust tags found, returning null");
      return res.status(200).json({
        trust: null,
        message: "No trust level found"
      });
    }

    // トラストレベルの優先順位 (高い順)
    const trustPriority = [
      "system_trust_veteran",
      "system_trust_trusted",
      "system_trust_known",
      "system_trust_intermediate",
      "system_trust_basic",
      "system_trust_newuser",
      "system_trust_visitor"
    ];

    // 最も高いトラストレベルを見つける
    for (const trust of trustPriority) {
      if (trustTags.includes(trust)) {
        const level = trust.replace("system_trust_", "");

        // マッピング
        const trustMapping = {
          veteran: "trusted",
          trusted: "trusted",
          known: "known",
          intermediate: "user",
          basic: "user",
          newuser: "newuser",
          visitor: "visitor"
        };

        const responseData = {
          trust: trustMapping[level] || level,
          userId: data.id,
          displayName: data.displayName
        };

        console.log("Sending response:", responseData);
        return res.status(200).json(responseData);
      }
    }

    console.log("No matching trust level found");
    return res.status(200).json({
      trust: null,
      message: "No matching trust level found"
    });
  } catch (error) {
    console.error("Get trust error:", error);
    return res.status(500).json({
      message: "Failed to fetch trust rank",
      error: error.message
    });
  }
};
