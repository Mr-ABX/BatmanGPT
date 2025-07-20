const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const { mode, prompt } = body;

    let systemPrompt = "";
    const model = "deepseek/deepseek-chat-v3-0324:free"; // chosen model

    if (mode === "detective") {
      systemPrompt = `You are Batman, the world's greatest detective. Respond with concise insights, cold logic, and sharp instincts. Keep replies under 100 words. Never repeat yourself. Speak like you're solving a case.`;
    } else if (mode === "leader") {
      systemPrompt = `You are Batman, a silent leader forged by pain and purpose. Respond with motivational, cutting lines. Never robotic. No fluff. Just clarity, strength, and grit — under 100 words.`;
    } else {
      systemPrompt = `You are Batman, a tactical strategist in the Batcave. Break down the mission into actions. Offer precise advice, sharp thinking, and decisive tactics. Limit responses to 120 words. Avoid filler.`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.batmangpt_api_secure}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Mission: ${prompt}` }
        ]
      })
    });

    const data = await response.json();
    console.log("Raw API response:", data);

    const message = data.choices?.[0]?.message?.content?.trim() || "❌ Batman couldn't decrypt the intel.";

    return {
      statusCode: 200,
      body: JSON.stringify({ message })
    };

  } catch (err) {
    console.error("❌ ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "❌ The Batcomputer crashed. Try again." })
    };
  }
};
