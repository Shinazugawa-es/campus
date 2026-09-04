// General tips shown to all fresh students
export const generalTips = {
  packing: [
    "Pack a mix of light and warmer clothing — temperatures can shift between day and night.",
    "Bring your own basic toiletries for the first week while you settle in.",
    "A reusable water bottle and a small backpack for daily class supplies are essentials.",
    "Don't forget copies of important documents (ID, admission letter, medical records).",
  ],
  social: [
    "Most friendships in the first few weeks form in the dorms and dining hall — show up and say hi.",
    "Clubs and student groups are a great low-pressure way to meet people with similar interests.",
    "It's normal to feel a bit homesick at first — it usually eases once your routine settles in.",
  ],
  academics: [
    "Attend orientation sessions even if they feel repetitive — they often cover things you'll need later (registration, ID cards, etc).",
    "Get to know where your specific classrooms are a day or two before classes start, not the morning of.",
    "the exams are not as hard as people think they are , they are just made to check how much you have seen the topic from different angles although the degree varies from teacher to teacher.",

    "Introduce yourself to your teachers early — it helps if you ever need extra support later.",
    "please participate !! you might see some of your classmates do not even make eye contact with the teacher and feel like your participation is attention seeking but it is not , it is a way to show your teacher that you are interested in the topic and you are willing to learn more about it.",
  ],
}

// Weather/packing tips that vary based on where the student is coming from
export const regionTips = {
  warm: {
    keywords: ["addis", "dire dawa", "jijiga", "gambela"],
    tip: "Coming from a warmer area — pack at least one warm jacket and a blanket, as it can get noticeably colder here, especially at night.",
  },
  cold: {
    keywords: ["dessie", "bahir dar", "gondar", "debre"],
    tip: "You're likely already used to similar weather here, but still pack a light jacket for early mornings.",
  },
  default: {
    tip: "Weather here varies through the year — packing a light jacket for cooler evenings is a safe bet no matter where you're coming from.",
  },
}

// Simple helper: matches a home_region string to a tip category
export function getRegionTip(homeRegion) {
  if (!homeRegion) return regionTips.default.tip

  const region = homeRegion.toLowerCase()

  for (const key of ["warm", "cold"]) {
    if (regionTips[key].keywords.some((keyword) => region.includes(keyword))) {
      return regionTips[key].tip
    }
  }

  return regionTips.default.tip
}