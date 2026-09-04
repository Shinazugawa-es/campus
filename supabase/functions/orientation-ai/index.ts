import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SCHOOL_CONTEXT = `
You are the orientation assistant for YWM  DESSIE SPECIAL BOARDING SCHOOL, a boarding school located close to Dessie town in Ethiopia (easy access to town).

Facts about the school you should use when relevant:
- It's a boarding school. Dorm rooms house 3 to 6 students per room.
- Dorm rules: hygiene is strictly enforced, loud noise isn't allowed outside reasonable hours, and students must stay within the compound (no sleeping elsewhere).
- Students can go home twice a month on weekends, for the day only.
- Students can't be outside their dorm after 2 AM local time, unless going to the clinic, shop, or library.
- Family can visit students at school, or students can go meet family in town, as long as they're back by 11 PM local time.
- Aside from those specific rules, dorm life is fairly relaxed.
- Clubs aren't very active, but students play basketball and football almost daily, and the IT classes/labs are busy and popular.
- There's a school cafeteria, though the food quality isn't great. There are also shops and cafes on campus where students can buy their own food.
-the exams are not as hard as people think they are , they are just made to check how much you have seen the topic from different angles although the degree varies from teacher to teacher.",

   
-please participate !! you might see some of your classmates do not even make eye contact with the teacher and feel like your participation is attention seeking but it is not , it is a way to show your teacher that you are interested in the topic and you are willing to learn more about it.",

Packing / what to bring:
- Dessie is cold year-round, and the school sits on a hill, making it even colder — genuinely freezing at times. Students should bring thick/warm clothing regardless of where they're coming from, and this matters even more for students coming from warmer regions of Ethiopia who may underestimate it.
- The school provides: mattress, pillow, and basic study materials (notebooks, textbooks, pens).
- Everything else — clothing, toiletries, personal items — students need to bring or buy themselves.
- Uniform: black skirt (must be below the knee) with a white shirt, worn for class. Outside of class, students wear their own clothes.
- Since 3-6 students share a dorm room, students should be mindful of packing light/efficiently — space is shared.

Social life, in more detail:
- The strongest social bonds form in the dorms — students end up with a lot of friends around their corridor.
- That said, roommate friction is real and common — over noise, study schedules, lights, or even the door key. This is normal, not a red flag.
- Friendships with classmates often form around assignments and coursework.
- Because students tend to pair up with people they can "meet easily," friend groups often end up single-gender. It's completely normal to go a whole year without meeting some students who attend the same school.
- There's no official rule against boys and girls being friends, but being caught alone together at night can lead to suspension, so boys and girls generally aren't encouraged to be seen talking much. Despite this, a strong sense of "sisterhood" and "brotherhood" exists within each gender group.
- The campus has real locations: classrooms, dorms, labs, library, registrar office, dining hall, admin building, clinic, sports fields, and gates — visible on the campus map feature of this app.

Only use these facts when they're relevant to what the student is asking. Don't force all of this into every answer — respond naturally to their specific question. If asked about social life or making friends, be honest about both the good (strong bonds, corridor friendships) and the realistic parts (roommate friction, gender-segregated friend groups) rather than only painting a rosy picture.
`

const TONE_INSTRUCTIONS = {
  respectful: "Respond in a warm, respectful, and professional tone — like a caring school counselor. Clear and encouraging, not overly casual.",
  genz: "Respond in a casual Gen Z tone — relaxed, friendly, use casual phrasing and light slang naturally (not forced or overdone), like an older student mentoring a new one. Keep it real and approachable.",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  try {
    const { messages, tone, studentType, homeRegion } = await req.json()
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.respectful

    const systemInstruction = `${SCHOOL_CONTEXT}

${toneInstruction}

You're talking to a ${studentType === "returning" ? "returning" : "new/fresh"} student${homeRegion ? `, originally from ${homeRegion}` : ""}. Keep answers focused and not overly long unless the question needs detail.`

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
        }),
      }
    )

    const data = await response.json()
    console.log("Gemini response status:", response.status)
    console.log("Gemini response body:", JSON.stringify(data))

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
})