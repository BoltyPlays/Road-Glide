const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getOttawaRegionalWeather } = require("./weather");
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview"
});

// Why getAreaMultipliers? To save on tokens bc I'm broke, Gemini will calculate the "delay" multiplier for each area, like Orléans, Kanata, and more. 
async function getAreaMultipliers(weatherData) {
    // Time to put my wasted $200 on that prompt-engineering Carleton mini-course to use
    const prompt = `
    Hello there! You are an Ottawa Traffic and Weather expert, and your job is to give a "delay multiplier" on bus arrival. 
    A "delay multiplier" is a multipler that multiplies the time of the bus's arrival, based on traffic and weather of the area. 
    To kick things off, check out the weather found here: ${JSON.stringify(weatherData, null, 2)}. 
    Now here's the main show: you have to return a JSON object with delay multipliers, where 1.0 < x < 3.0, for the following sectors:
    "Downtown", "Ottawa East and Orléans", "South-East Ottawa", "Ottawa West", "Kanata", "Barrhaven", "Nepean", and "South Keys and Findlay Creek". This site may be helpful: "https://www.octranspo.com/en/our-services/navigation/route-numbers/"
    There is a specific format. Please return ONLY the JSON in this format: {"Area": x}, where x is the delay multiplier. Do not add any text other than the JSON.
    Here's an example: it's snowing (yay!) in the Orléans area, but there's traffic (oh no!). You then calculate that the delay mulitplier is 2.6. The format should be {"Ottawa East and Orléans": 2.6}. Once again, this is an example.
    That's all! Have fun :D
    `;
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // This looks weird but if Gemini does add text, this should only extract the JSON
        const jsonExtract = text.match(/\{[\s\S]*\}/);

        if (jsonExtract) {
            return JSON.parse(jsonExtract[0]);
        }
        throw new Error("What's an error...? No JSON was found");
    } catch (error) {
        console.error("All multipliers are set to 1.0. Gemini flew away because uhh... ", error.message);
        return { "Downtown": 1.0, "Ottawa East and Orléans": 1.0, "South-East Ottawa": 1.0, "Ottawa West": 1.0, "Kanata": 1.0, "Barrhaven": 1.0, "Nepean": 1.0, "South Keys and Findlay Creek": 1.0 };
    }
}

module.exports = { getAreaMultipliers };