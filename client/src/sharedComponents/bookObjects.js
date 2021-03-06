import {
  nickMarkup,
  step4Markup,
  step5Markup,
  step6Markup,
  step7Markup,
  step8Markup,
  step9Markup,
  step10Markup,
  step11Markup,
  step12Markup,
  step4MarkupPurple,
  step5MarkupPurple,
  step6MarkupPurple,
  step7MarkupPurple,
  step8MarkupPurple,
  step9MarkupPurple,
  step10MarkupPurple,
  step11MarkupPurple,
  step12MarkupPurple
} from "./markupObjects";

import { sampleWithMSV } from "./sampleWithMSV";

import {
  group1SpellingObj,
  group2SpellingObj,
  group3SpellingObj,
  group4SpellingObj,
  purpleGroup1SpellingObj,
  purpleGroup2SpellingObj,
  purpleGroup3SpellingObj,
  purpleGroup4SpellingObj
} from "./spellingObjects";

export const fireflyBook = {
  title: "Firefly Night",
  author: "Dianne Ochiltree",
  bookKey: "demo",
  numPages: 3, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/sample-book-assets/firefly-cover.png",
  introAudioSrc: "/audio/VB/VB-book-intro.mp3",
  pages: {
    1: {
      lines: [
        "The moon is high\nand the stars are bright.",
        'Daddy tells me,\n"It\'s a firefly night!"'
      ],
      img: "/images/dashboard/sample-book-assets/firefly-2.png"
    },
    2: {
      lines: [
        "Fireflies shine.\nAll of them glow.",
        "I race to show Daddy\ntheir dancing light show."
      ],
      img: "/images/dashboard/sample-book-assets/firefly-4.png"
    },
    3: {
      lines: [
        "I open my jar. They fly away quickly and shine. ",
        "I love catching fireflies, but they are not mine."
      ],
      img: "/images/dashboard/sample-book-assets/firefly-3.png"
    }
  },
  numSections: 3,
  sections: {
    1: "Retell",
    2: "Within the Text",
    3: "Beyond and About the Text"
  },
  numQuestions: 3,
  numOralReadingQuestions: 3,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Firefly Night. Includes all major events of plot in sequence, and shows insight into the girl's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Firefly Night. Includes major events of plot in sequence. Describes the girl's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Firefly Night. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Firefly Night. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      section: 1
    },
    2: {
      title: "Why did the girl and her dad go outside?",
      audioSrc: "/audio/VB/firefly/why-did-outside.mp3",
      points: 1,
      section: 2,
      rubric: {
        1: "Response shows partial understanding of Firefly Night. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Firefly Night. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      }
    },
    3: {
      title: "Why do you think the girl chose to let the fireflies go?",
      audioSrc: "/audio/VB/firefly/why-chose.mp3",
      points: 2,
      section: 3,
      rubric: {
        1: "Response shows partial understanding of Firefly Night. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Firefly Night. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      }
    }
  },

  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

export const step1 = {
  title: "STEP 1 is not yet available",
  stepLevel: 1,
  stepSeries: "NONE",
  bookKey: "step1",
  brand: "STEP"
};

export const step2 = {
  title: "STEP 2 is not yet available",
  stepLevel: 2,
  stepSeries: "NONE",
  bookKey: "step2",
  brand: "STEP"
};

export const step3 = {
  title: "STEP 3 is not yet available",
  stepLevel: 3,
  stepSeries: "NONE",
  bookKey: "step3",
  brand: "STEP"
};

//////////// YELLOW START ////////////

export const step4 = {
  title: "Upside Down",
  author: "Stefan Olson",
  bookKey: "step4",
  brand: "STEP",
  stepLevel: 4,
  stepSeries: "YELLOW",
  fpLevel: "E",
  markup: step4Markup,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step/step-cover.jpg",
  introAudioSrc: "/audio/peter-intro-short.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numQuestions: 6,
  numOralReadingQuestions: 6,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "Where is Peter playing upside down?",
      audioSrc: "/audio/step/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What are some things Peter sees upside down?",
      audioSrc: "/audio/step/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "Why is Peter looking at things upside down?",
      audioSrc: "/audio/step/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Who comes to visit Peter?",
      audioSrc: "/audio/step/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: 'Why does Peter say, "Will her hat fall off?"',
      audioSrc: "/audio/step/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title: "Why does Peter ask Jill to play upside down with him?",
      audioSrc: "/audio/step/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step5 = {
  title: "Saturday Shopping",
  author: "Stefan Olson",
  bookKey: "step5",
  brand: "STEP",
  stepLevel: 5,
  stepSeries: "YELLOW",

  fpLevel: "G",
  markup: step5Markup,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step5/rufus-cover.jpg",
  introAudioSrc: "/audio/ruffy-intro-new.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numQuestions: 6,
  numOralReadingQuestions: 6,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "When does Ruffy bark in the car?",
      audioSrc: "/audio/step5/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What food does the boy in the story really want to buy?",
      audioSrc: "/audio/step5/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "Why does Ruffy run into the store?",
      audioSrc: "/audio/step5/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Why does the boy think that he and Ruffy are in big trouble?",
      audioSrc: "/audio/step5/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "Why doesn't the store manager get mad? How do you know?",
      audioSrc: "/audio/step5/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title: "Why does the family think Ruffy is a good dog?",
      audioSrc: "/audio/step5/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step6 = {
  title: "Comedy Garage",
  author: "Jane Richards",
  bookKey: "step6",
  brand: "STEP",
  stepLevel: 6,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step6Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step6/step6-cover.jpg",
  introAudioSrc: "/audio/intros/step6.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title:
        "What do the kids in the story have to do to get ready for the comedy show?",
      audioSrc: "/audio/step6/comp/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why do the children put Mittens upstairs?",
      audioSrc: "/audio/step6/comp/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What do Max and Linda do at the show?",
      audioSrc: "/audio/step6/comp/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Why do the people think the show is funny?",
      audioSrc: "/audio/step6/comp/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "What does Zina do at the show?",
      audioSrc: "/audio/step6/comp/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title:
        "Why is the audience surprised when the cat walks across the screen?",
      audioSrc: "/audio/step6/comp/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    7: {
      title: "Why do the children want to put on another show the next week?",
      audioSrc: "/audio/step6/comp/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    8: {
      title: "Why do the children promise to let Mittens be in the next show?",
      audioSrc: "/audio/step6/comp/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group2SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step7 = {
  title: "My Friend Kendra",
  author: "Stefan Olson",
  bookKey: "step7",
  brand: "STEP",
  stepLevel: 7,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step7Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step7/cover.jpg",
  introAudioSrc: "/audio/intros/step7.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "Who, was the first Kendra?",
      audioSrc: "/audio/step7/comp/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What happened to the first Kendra?",
      audioSrc: "/audio/step7/comp/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "Why does Lisa name her invisible friend Kendra?",
      audioSrc: "/audio/step7/comp/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title:
        "Does Lisa’s mother think that Kendra is a real girl? How do you know from the story?",
      audioSrc: "/audio/step7/comp/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "What kinds of things does Lisa pretend to do with Kendra?",
      audioSrc: "/audio/step7/comp/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title:
        "Why do you think Lisa says that Kendra does bad things at school, like making faces?",
      audioSrc: "/audio/step7/comp/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    7: {
      title:
        "In what ways does pretending to have a friend like Kendra help Lisa?",
      audioSrc: "/audio/step7/comp/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    8: {
      title: "Why do you think Lisa pretends to have an invisible friend?",
      audioSrc: "/audio/step7/comp/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group2SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step8 = {
  title: "The Frog Princess",
  author: "Stefan Olson",
  bookKey: "step8",
  brand: "STEP",
  stepLevel: 8,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step8Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/step8.jpg",
  introAudioSrc: "/audio/intros/step8.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        "First, what is the Frog Princess like at the beginning of the story?",
      audioSrc: "/audio/step8/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "How does the young man meet the Frog Princess?",
      audioSrc: "/audio/step8/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why is it so important that the young man get the Frog Princess to kiss him?",
      audioSrc: "/audio/step8/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "Who created the young man’s problem?",
      audioSrc: "/audio/step8/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title: "Why doesn’t the Frog Princess think the young man is handsome?",
      audioSrc: "/audio/step8/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    7: {
      title:
        "Why does the Frog Princess let the young man stay with her by the pond?",
      audioSrc: "/audio/step8/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    8: {
      title:
        "Why doesn’t the young man look ugly to the Princess after she is turned into a young woman?",
      audioSrc: "/audio/step8/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    9: {
      title:
        "Why do you think the Prince and Princess live happily ever after?",
      audioSrc: "/audio/step8/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group3SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step9 = {
  title: "The Fourth Letter",
  author: "Jane Richards",
  bookKey: "step9",
  brand: "STEP",
  stepLevel: 9,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step9Markup,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step9/step9-cover.jpg",
  introAudioSrc: "/audio/intros/step9.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title:
        "Why does Jeffrey try on Marcus’s skates even though his mother told him not to stop anywhere?",
      audioSrc: "/audio/step5/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What does Jeffrey do to try to find the lost letter?",
      audioSrc: "/audio/step5/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        "Why isn’t Jeffrey’s mother angry when he tells her the whole story?",
      audioSrc: "/audio/step5/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why does Jeffrey’s mother trust him to mail the letters?",
      audioSrc: "/audio/step9/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "When does Jeffrey notice that the fourth letter is missing?",
      audioSrc: "/audio/step9/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why doesn’t Jeffrey tell his mother about the letter at dinner, as he had planned?",
      audioSrc: "/audio/step9/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "What was in the letter that Jeffrey lost?",
      audioSrc: "/audio/step9/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        "Why does Jeffrey finally tell his mother what happened to the fourth letter?",
      audioSrc: "/audio/step9/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: group3SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step10 = {
  title: "Juliet, Pig Detective",
  author: "Jane Richards",
  bookKey: "step10",
  brand: "STEP",
  stepLevel: 10,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step10Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/step10.jpg",
  introAudioSrc: "/audio/intros/step10.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title: "What does Juliet know about what detectives do?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        "Why does Norma bring Juliet a cap, a magnifying glass, and a funny-looking cap to wear?",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What makes Juliet a good detective?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "First, why does Juliet want to be a detective?",
      audioSrc: "/audio/step10/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title:
        "Why does Norman think that Juliet will have a problem becoming a detective?",
      audioSrc: "/audio/step10/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why does Juliet make a new sign with a long list of the things she can do?",
      audioSrc: "/audio/step10/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "How does Juliet know that the balloon is in the tree?",
      audioSrc: "/audio/step10/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title: "What is the author trying to teach us in the book?",
      audioSrc: "/audio/step10/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: group3SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step11 = {
  title: "Help! My Desk is Haunted!",
  author: "Jane Richards",
  bookKey: "step11",
  brand: "STEP",
  stepLevel: 11,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step11Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/step11.jpg",
  introAudioSrc: "/audio/intros/step11.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title: "Why doesn't Daniel have his own desk at school?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        "Why does everyone in the class come to believe that Daniel's desk is haunted?",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        'How does having a "haunted" desk help Daniel make friends at his new school?',
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        "First, How does Daniel feel about being in his new school? Why do you think that?",
      audioSrc: "/audio/step11/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "Why doesn’t Ms. Hayes believe that the desk is haunted?",
      audioSrc: "/audio/step11/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title: "Why does Ike Mills offer to buy Daniel a new desk?",
      audioSrc: "/audio/step11/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "How are Daniel and Ike Mills alike?",
      audioSrc: "/audio/step11/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        'Why is Daniel the only one in the class who isn’t sure what to write about what he’s learned from their "funny experience"?',
      audioSrc: "/audio/step11/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: group4SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step12 = {
  title: "The Magic Ring",
  author: "Jane Richards",
  bookKey: "step12",
  brand: "STEP",
  stepLevel: 12,
  stepSeries: "YELLOW",

  fpLevel: "I",
  markup: step12Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/step12.jpg",
  introAudioSrc: "/audio/intros/step12.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title: "Why does Martin spend all the family's money on a cat?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why isn't the Princess happy after she marries Martin?",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "How does Misha the cat get the ring back for Martin?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why does Martin's mother send him away?",
      audioSrc: "/audio/step12/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title:
        "hy do you think the beautiful lady tells Martin that the ring’s power must be kept a secret?",
      audioSrc: "/audio/step12/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title: "How does the Princess learn the source of Martin's power?",
      audioSrc: "/audio/step12/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "Why does the King lock Martin in the tower?",
      audioSrc: "/audio/step12/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        "Why does Martin ask for golden armor and a dashing black horse before he goes back to the Princess?",
      audioSrc: "/audio/step12/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: group4SpellingObj,
  numSpellingQuestions: 20
};

export const fpBook = {
  title: "Bedtime for Nick",
  author: "Steve Olson",
  bookKey: "nick",
  genre: "FICTION",
  fpLevel: "G",
  brand: "FP",
  stepLevel: 5,
  numPages: 10, // if you want a shorter book for testing purposes just change this
  isWideBook: true,
  coverImage: "/images/dashboard/bedtime-large.jpg",
  introAudioSrc: "/audio/intro-nick-short.mp3",
  markup: nickMarkup,
  pages: {
    1: {
      lines: [
        "Nick was looking at his book.",
        'His mom came in and said, "It’s time for bed."',
        '"Okay, Mom," said Nick.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/1.jpg"
    },
    2: {
      lines: [
        "Nick put on his pajamas.",
        "He washed his face and brushed his teeth.",
        "He was ready for bed."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/2.jpg"
    },
    3: {
      lines: [
        '"Will you read me a story?" Nick asked his mom.',
        "Mom read the story to Nick.",
        "Nick liked the story about the magic fish."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/3.jpg"
    },

    4: {
      lines: [
        "When the story was over, Nick's mom turned off the light.",
        '"Good night, Nick," his mom said.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/4.jpg"
    },
    5: {
      lines: [
        '"Will you turn on the nightlight?" asked Nick.',
        '"Okay, Nick," his mom said.',
        "She turned it on."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/5.jpg"
    },
    6: {
      lines: [
        '"Good night, Nick," his mom said. "Now it’s time to go to sleep."',
        '"I can’t go to sleep," said Nick.',
        '"I will give you a good night kiss," said Nick\'s mom'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/6.jpg"
    },

    7: {
      lines: [
        '"I can’t go to sleep," said Nick.',
        '"Will you open the door?" he asked.',
        "Nick’s mom opened the door. Light came into the room."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/7.jpg"
    },

    8: {
      lines: [
        '"Good night, Nick," his mom said. "Go to sleep now."',
        '"I can\'t go to sleep," said Nick. "Something is missing."'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/8.jpg"
    },

    9: {
      lines: [
        "He looked around the room. Something came in the door.",
        '"Wags! You’re late," said Nick.',
        ' "Now we can go to sleep.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/9.jpg"
    },
    10: {
      lines: [
        '"Good night, Nick," said Mom. "Good night, Wags."',
        '"Good night, Mom," said Nick.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/10.jpg"
    }
  },
  numSections: 2,
  sections: {
    1: "Within the Text",
    2: "Beyond and About the Text"
  },

  numQuestions: 4,
  numOralReadingQuestions: 4,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Bedtime For Nick. Includes all major events of plot in sequence, and shows insight into Nick's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Bedtime For Nick. Includes major events of plot in sequence. Describes Nick's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Bedtime For Nick. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Bedtime For Nick. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      standard: "CCRA.R.1 and CCRA.R.3",
      section: 1
    },
    2: {
      title: "What is the real reason Nick can’t sleep?",
      audioSrc: "/audio/VB/nick/nick-real-reason.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Nick can’t sleep . Misses key point that Nick can’t sleep because he misses Wags. Doesn’t use concrete details to support the answer, such as noting that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates proficiency in understanding why Nick can’t sleep. Correctly identifies that Nick can’t sleep because he misses Wags. Offers concrete details to support this answer, noting that Nick is only able to sleep when Wags returns."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 2
    },
    3: {
      title: "How do you think Nick feels about Wags?",
      audioSrc: "/audio/VB/nick/nick-how-feels.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Nick’s feelings about Wags. Misses key point that Nick loves Wags and misses him, and lacks strong supporting details (like the fact that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates an excellent understanding of Nick’s feelings about Wags. Correctly identifies that Nick loves Wags and misses him. Offers strong supporting details for this answer and notes Nick is only able to sleep when Wags comes back."
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    4: {
      title: "Tell about a time when you had trouble with something.",
      subtitle: "Was your problem like Nick’s? Why or why not?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.9",
      section: 2
    }
  },
  spellingObj: group1SpellingObj,

  numSpellingQuestions: 15
};

//////////// YELLOW END ////////////

export const sampleReportBookFP = {
  title: "No More Magic",
  author: "Avi",
  bookKey: "sample",
  stepLevel: 12,
  fpLevel: "R",
  numPages: null, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: null,
  introAudioSrc: null,
  markup: sampleWithMSV,
  pages: null,
  numSections: 3,
  sections: {
    1: "Retell",
    2: "Within the Text",
    3: "Beyond and About the Text"
  },

  numQuestions: 5,
  numOralReadingQuestions: 5,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Bedtime For Nick. Includes all major events of plot in sequence, and shows insight into Nick's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Bedtime For Nick. Includes major events of plot in sequence. Describes Nick's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Bedtime For Nick. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Bedtime For Nick. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      standard: "CCRA.R.1 and CCRA.R.3",
      section: 1
    },
    2: {
      title: "How is the narrator's mom trying to make him feel better?",
      audioSrc: "/audio/VB/nick/nick-real-reason.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Nick can’t sleep . Misses key point that Nick can’t sleep because he misses Wags. Doesn’t use concrete details to support the answer, such as noting that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates proficiency in understanding why Nick can’t sleep. Correctly identifies that Nick can’t sleep because he misses Wags. Offers concrete details to support this answer, noting that Nick is only able to sleep when Wags returns."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 2
    },
    3: {
      title:
        "Will Chris stop looking for his old bike when he gets a new one? How do you know?",
      audioSrc: "/audio/VB/nick/nick-how-feels.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Nick’s feelings about Wags. Misses key point that Nick loves Wags and misses him, and lacks strong supporting details (like the fact that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates an excellent understanding of Nick’s feelings about Wags. Correctly identifies that Nick loves Wags and misses him. Offers strong supporting details for this answer and notes Nick is only able to sleep when Wags comes back."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title:
        "Chris's dad says, \"We all know about Mr. Podler…Someday I'll tell you about the ghosts he saw in City Hall.\" What do you think he means?.",
      subtitle: "Was your problem like Nick’s? Why or why not?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 3
    },
    5: {
      title:
        "How do you think Chris feels about getting a new bike? What makes you think this?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,

  numSpellingQuestions: 15
};

export const sampleReportBookSTEP = {
  title: "No More Magic",
  author: "Avi",
  bookKey: "sample",
  brand: "STEP",
  stepLevel: 12,
  fpLevel: "R",

  numPages: null, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: null,
  introAudioSrc: null,
  markup: sampleWithMSV,
  pages: null,
  numSections: 3,
  sections: {
    1: "Retell",
    2: "Factual",
    3: "Inferential",
    4: "Critical Thinking"
  },

  numQuestions: 5,
  numOralReadingQuestions: 5,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Bedtime For Nick. Includes all major events of plot in sequence, and shows insight into Nick's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Bedtime For Nick. Includes major events of plot in sequence. Describes Nick's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Bedtime For Nick. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Bedtime For Nick. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      standard: "CCRA.R.1 and CCRA.R.3",
      section: 1
    },
    2: {
      title: "How is the narrator's mom trying to make him feel better?",
      audioSrc: "/audio/VB/nick/nick-real-reason.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Nick can’t sleep . Misses key point that Nick can’t sleep because he misses Wags. Doesn’t use concrete details to support the answer, such as noting that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates proficiency in understanding why Nick can’t sleep. Correctly identifies that Nick can’t sleep because he misses Wags. Offers concrete details to support this answer, noting that Nick is only able to sleep when Wags returns."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 2
    },
    3: {
      title:
        "Will Chris stop looking for his old bike when he gets a new one? How do you know?",
      audioSrc: "/audio/VB/nick/nick-how-feels.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Nick’s feelings about Wags. Misses key point that Nick loves Wags and misses him, and lacks strong supporting details (like the fact that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates an excellent understanding of Nick’s feelings about Wags. Correctly identifies that Nick loves Wags and misses him. Offers strong supporting details for this answer and notes Nick is only able to sleep when Wags comes back."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 3
    },
    4: {
      title:
        "Chris's dad says, \"We all know about Mr. Podler…Someday I'll tell you about the ghosts he saw in City Hall.\" What do you think he means?.",
      subtitle: "Was your problem like Nick’s? Why or why not?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 3
    },
    5: {
      title:
        "How do you think Chris feels about getting a new bike? What makes you think this?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 4
    }
  },
  spellingObj: group1SpellingObj,

  numSpellingQuestions: 15
};

//////// PURPLE START /////////

export const step4p = {
  title: "Elizabeth's Song",
  author: "Stefan Olson",
  bookKey: "step4p",
  brand: "STEP",
  stepLevel: 4,
  stepSeries: "PURPLE",
  fpLevel: "E",
  markup: step4MarkupPurple,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step4.jpg",
  introAudioSrc: "/audio/purple/intros/step4.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numQuestions: 6,
  numOralReadingQuestions: 6,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "Who is Fred?",
      audioSrc: "/audio/purple/questions/step4/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "When do Elizabeth and Fred dance together?",
      audioSrc: "/audio/purple/questions/step4/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What makes dancing with Fred fun?",
      audioSrc: "/audio/purple/questions/step4/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "What does Elizabeth's mom do when she puts Elizabeth to bed?",
      audioSrc: "/audio/purple/questions/step4/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: 'How does Elizabeth feel about Fred?"',
      audioSrc: "/audio/purple/questions/step4/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title:
        'Why does Elizabeth say, "We\'re ready for bed," at the end of the story?',
      audioSrc: "/audio/purple/questions/step4/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: purpleGroup1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step5p = {
  title: "Mike, By Himself",
  author: "Stefan Olson",
  bookKey: "step5p",
  brand: "STEP",
  stepLevel: 5,
  stepSeries: "PURPLE",
  fpLevel: "G",
  markup: step5MarkupPurple,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step5.jpg",
  introAudioSrc: "/audio/purple/intros/step5.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numQuestions: 6,
  numOralReadingQuestions: 6,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "First, Why does Mike stop by the stair?",
      audioSrc: "/audio/purple/questions/step5/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        "Mike tells Keesha that he likes to be by himself. Why does she race with him anyway?",
      audioSrc: "/audio/purple/questions/step5/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What does Mike think about how Keesha rides her bike?",
      audioSrc: "/audio/purple/questions/step5/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "What does Keesha want Mike to do after they race?",
      audioSrc: "/audio/purple/questions/step5/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "Why do Mike and Keesha become friends?",
      audioSrc: "/audio/purple/questions/step5/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title: "How does Mike change in the story?",
      audioSrc: "/audio/purple/questions/step5/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: purpleGroup1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step6p = {
  title: "Margo Finds a Friend ",
  author: "Jane Richards",
  bookKey: "step6p",
  brand: "STEP",
  stepSeries: "PURPLE",
  stepLevel: 6,
  fpLevel: "I",
  markup: step6MarkupPurple,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step6.jpg",
  introAudioSrc: "/audio/purple/intros/step6.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "What does Margo order the other children to do?",
      audioSrc: "/audio/purple/questions/step6/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What does Margo do while she's leading the children?",
      audioSrc: "/audio/purple/questions/step6/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        'Why doesn\'t Ashley know what to answer when Margo says, "I always know best"?',
      audioSrc: "/audio/purple/questions/step6/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title:
        "Why don't the children tell Margo that no one is following her anymore?",
      audioSrc: "/audio/purple/questions/step6/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "Why do you think Jerome lets Margo take his money?",
      audioSrc: "/audio/purple/questions/step6/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title: "Why does Jerome cover his ears when Margo sings?",
      audioSrc: "/audio/purple/questions/step6/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    7: {
      title:
        "Do the children think Margo is a good friend? What makes you think that?",
      audioSrc: "/audio/purple/questions/step6/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    8: {
      title: "Who is Margo's new friend?",
      audioSrc: "/audio/purple/questions/step6/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: purpleGroup2SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step7p = {
  title: "Pig on 35th Street",
  author: "Stefan Olson",
  bookKey: "step7p",
  brand: "STEP",
  stepSeries: "PURPLE",
  stepLevel: 7,
  fpLevel: "I",
  markup: step7MarkupPurple,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step7.jpg",
  introAudioSrc: "/audio/purple/intros/step7.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "Why does the pig follow Riley?",
      audioSrc: "/audio/purple/questions/step7/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "How does Riley's dad feel when he first sees her with the pig?",
      audioSrc: "/audio/purple/questions/step7/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "Why do Riley's parents say she can't keep Fatima?",
      audioSrc: "/audio/purple/questions/step7/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title:
        "Why does Riley say it's not \"fair\" that pigs don't live in the city?",
      audioSrc: "/audio/purple/questions/step7/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "What is a 4-H Club?",
      audioSrc: "/audio/purple/questions/step7/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title:
        "Why does Riley's mother think they can find someone to take care of Fatima at the 4-H Club show?",
      audioSrc: "/audio/purple/questions/step7/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    7: {
      title: 'Why does Vickie say it\'s a "miracle" that she found Pinkie?',
      audioSrc: "/audio/purple/questions/step7/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    8: {
      title:
        "Why does the newspaper print a picture of Fatima and Riley on 35th Street?",
      audioSrc: "/audio/purple/questions/step7/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: purpleGroup2SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step8p = {
  title: "Squirrel and Mole",
  author: "Stefan Olson",
  bookKey: "step8p",
  brand: "STEP",
  stepLevel: 8,
  stepSeries: "PURPLE",
  fpLevel: "I",
  markup: step8MarkupPurple,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step8.jpg",
  introAudioSrc: "/audio/purple/intros/step8.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "How are Squirrel and Mole different?",
      audioSrc: "/audio/purple/questions/step8/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title:
        "What does Squirrel think about Mole at the beginning of the story?",
      audioSrc: "/audio/purple/questions/step8/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title: "What do Squirrel and Mole do when the dog comes?",
      audioSrc: "/audio/purple/questions/step8/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title:
        'Why does Squirrel tell Mole "this is no time to dig" when the fire starts?',
      audioSrc: "/audio/purple/questions/step8/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title: "Why does Mole save Squirrel's life?",
      audioSrc: "/audio/purple/questions/step8/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    7: {
      title: "How does Squirrel feel about bragging at the end of the story?",
      audioSrc: "/audio/purple/questions/step8/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    8: {
      title: "Why is Mole happy at the end of the story?",
      audioSrc: "/audio/purple/questions/step8/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    9: {
      title: "What is the author trying to teach us in the story?",
      audioSrc: "/audio/purple/questions/step8/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: purpleGroup3SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step9p = {
  title: "Halloween at the Zoo",
  author: "Jane Richards",
  bookKey: "step9p",
  brand: "STEP",
  stepLevel: 9,
  stepSeries: "PURPLE",
  fpLevel: "I",
  markup: step9MarkupPurple,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step9.jpg",
  introAudioSrc: "/audio/purple/intros/step9.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title: "Why does Dr. Drake have to go to the airport?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        "How do the animals feel about having a new animal at the zoo? What in the story makes you think this?",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        "At the end of the story, why does the Two-footed Hump-back Snake-biter have a shy smile on its face?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why do the animals leave their cages?",
      audioSrc: "/audio/purple/questions/step9/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "What does Tyrone's sister think about his costume?",
      audioSrc: "/audio/purple/questions/step9/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why does the judge for the costume contest lead the animals onto the stage?",
      audioSrc: "/audio/purple/questions/step9/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "Why does Tyrone win the costume contest?",
      audioSrc: "/audio/purple/questions/step9/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        'Why does everyone think that Tyrone and the Two-footed Hump-back Snake-biter look "ridiculous"?',
      audioSrc: "/audio/purple/questions/step9/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: purpleGroup3SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step10p = {
  title: "Buttercup Bates, Private Eye",
  author: "Jane Richards",
  bookKey: "step10p",
  brand: "STEP",
  stepLevel: 10,
  stepSeries: "PURPLE",
  fpLevel: "I",
  markup: step10MarkupPurple,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step10.jpg",
  introAudioSrc: "/audio/purple/intros/step10.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title: "How does the old Flower Delivery Trick work?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        'What does Buttercup mean when she thinks that Angela might look "too nice" to be a dog-napper?',
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What makes Buttercup a good detective?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why does Mookie look up to Buttercup, even though she's younger?",
      audioSrc: "/audio/purple/questions/step10/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title:
        'Why does Buttercup think that "clever" should be her middle name?',
      audioSrc: "/audio/purple/questions/step10/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why does Buttercup use tricks to discover where Ralph is instead of just asking people?",
      audioSrc: "/audio/purple/questions/step10/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title:
        "Why does Mookie want to call in adult reinforcements when they find out where Ralph is?",
      audioSrc: "/audio/purple/questions/step10/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        "At the end of the story, why does Mr. Webb offer to pay Mookie double what he had promised?",
      audioSrc: "/audio/purple/questions/step10/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: purpleGroup3SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step11p = {
  title: "Thumbelina",
  author: "Jane Richards",
  bookKey: "step11p",
  brand: "STEP",
  stepSeries: "PURPLE",
  stepLevel: 11,
  fpLevel: "I",
  markup: step11MarkupPurple,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step11.jpg",
  introAudioSrc: "/audio/purple/intros/step11.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title:
        "Why do you think Thumbelina is such a cheerful person at the beginning of the story?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why does Mrs. Frog carry off Thumbelina?",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        "What kind of person is Mr. Mole? What is he like? Give an example from the story.",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why do the moths think that Thumbelina is ugly?",
      audioSrc: "/audio/purple/questions/step11/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "Why does Thumbelina like taking care of the robin?",
      audioSrc: "/audio/purple/questions/step11/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why does Thumbelina decide not to go with the robin the first time he asks her?",
      audioSrc: "/audio/purple/questions/step11/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title:
        "Why does Thumbelina change her mind and decide not to marry Mr. Mole?",
      audioSrc: "/audio/purple/questions/step11/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        'Why does the author say at the end of the story that Thumbelina is a "lucky girl"?',
      audioSrc: "/audio/purple/questions/step11/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: purpleGroup4SpellingObj,
  numSpellingQuestions: 20
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step12p = {
  title: "Ella's Magic",
  author: "Jane Richards",
  bookKey: "step12p",
  brand: "STEP",
  stepSeries: "PURPLE",
  stepLevel: 12,
  fpLevel: "I",
  markup: step12MarkupPurple,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/covers/purple/step12.jpg",
  introAudioSrc: "/audio/purple/intros/step12.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title:
        "Why isn't Ella interested in the magic beans or the magic glass that can tell the future?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: 'What happens to a person who says the magic word "mutabee"?',
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        "Why isn't Ella worried that she doesn't know what the warning says?",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title:
        'What are the "monsters on wheels" that terrify Ella the Earthworm?',
      audioSrc: "/audio/purple/questions/step12/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "Why does Ella become bored with being a squirrel?",
      audioSrc: "/audio/purple/questions/step12/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title: "Why does Ella enjoy being a pigeon?",
      audioSrc: "/audio/purple/questions/step12/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "Why doesn't Ella want chicken with her fried potatoes and gravy?",
      audioSrc: "/audio/purple/questions/step12/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        "Did Ella really turn into a squirrel and a pigeon? How do you know from the story?",
      audioSrc: "/audio/purple/questions/step12/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: purpleGroup4SpellingObj,
  numSpellingQuestions: 20
};

//////////  PURPLE END ///////////

////////// FP START /////////////

export const FICTION_A = {
  title: "BOOK LEVEL A",
  author: "AUTHOR LEVEL A",
  bookKey: "fiction_a",
  brand: "FP",
  fpLevel: "A",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_B = {
  title: "BOOK LEVEL B",
  author: "AUTHOR LEVEL B",
  bookKey: "fiction_b",
  brand: "FP",
  fpLevel: "B",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_C = {
  title: "BOOK LEVEL C",
  author: "AUTHOR LEVEL C",
  bookKey: "fiction_c",
  brand: "FP",
  fpLevel: "C",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_D = {
  title: "BOOK LEVEL D",
  author: "AUTHOR LEVEL D",
  bookKey: "fiction_d",
  brand: "FP",
  fpLevel: "D",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_E = {
  title: "BOOK LEVEL E",
  author: "AUTHOR LEVEL E",
  bookKey: "fiction_e",
  brand: "FP",
  fpLevel: "E",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_F = {
  title: "BOOK LEVEL F",
  author: "AUTHOR LEVEL F",
  bookKey: "fiction_f",
  brand: "FP",
  fpLevel: "F",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_G = {
  title: "BOOK LEVEL G",
  author: "AUTHOR LEVEL G",
  bookKey: "fiction_g",
  brand: "FP",
  fpLevel: "G",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_H = {
  title: "BOOK LEVEL H",
  author: "AUTHOR LEVEL H",
  bookKey: "fiction_h",
  brand: "FP",
  fpLevel: "H",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_I = {
  title: "BOOK LEVEL I",
  author: "AUTHOR LEVEL I",
  bookKey: "fiction_i",
  brand: "FP",
  fpLevel: "I",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_J = {
  title: "BOOK LEVEL J",
  author: "AUTHOR LEVEL J",
  bookKey: "fiction_j",
  brand: "FP",
  fpLevel: "J",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_K = {
  title: "BOOK LEVEL K",
  author: "AUTHOR LEVEL K",
  bookKey: "fiction_k",
  brand: "FP",
  fpLevel: "K",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_L = {
  title: "BOOK LEVEL L",
  author: "AUTHOR LEVEL L",
  bookKey: "fiction_l",
  brand: "FP",
  fpLevel: "L",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_M = {
  title: "BOOK LEVEL M",
  author: "AUTHOR LEVEL M",
  bookKey: "fiction_m",
  brand: "FP",
  fpLevel: "M",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_N = {
  title: "BOOK LEVEL N",
  author: "AUTHOR LEVEL N",
  bookKey: "fiction_n",
  brand: "FP",
  fpLevel: "N",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_O = {
  title: "BOOK LEVEL O",
  author: "AUTHOR LEVEL O",
  bookKey: "fiction_o",
  brand: "FP",
  fpLevel: "O",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_P = {
  title: "BOOK LEVEL P",
  author: "AUTHOR LEVEL P",
  bookKey: "fiction_p",
  brand: "FP",
  fpLevel: "P",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_Q = {
  title: "BOOK LEVEL Q",
  author: "AUTHOR LEVEL Q",
  bookKey: "fiction_q",
  brand: "FP",
  fpLevel: "Q",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_R = {
  title: "BOOK LEVEL R",
  author: "AUTHOR LEVEL R",
  bookKey: "fiction_r",
  brand: "FP",
  fpLevel: "R",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_S = {
  title: "BOOK LEVEL S",
  author: "AUTHOR LEVEL S",
  bookKey: "fiction_s",
  brand: "FP",
  fpLevel: "S",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_T = {
  title: "BOOK LEVEL T",
  author: "AUTHOR LEVEL T",
  bookKey: "fiction_t",
  brand: "FP",
  fpLevel: "T",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_U = {
  title: "BOOK LEVEL U",
  author: "AUTHOR LEVEL U",
  bookKey: "fiction_u",
  brand: "FP",
  fpLevel: "U",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_V = {
  title: "BOOK LEVEL V",
  author: "AUTHOR LEVEL V",
  bookKey: "fiction_v",
  brand: "FP",
  fpLevel: "V",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_W = {
  title: "BOOK LEVEL W",
  author: "AUTHOR LEVEL W",
  bookKey: "fiction_w",
  brand: "FP",
  fpLevel: "W",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_X = {
  title: "BOOK LEVEL X",
  author: "AUTHOR LEVEL X",
  bookKey: "fiction_x",
  brand: "FP",
  fpLevel: "X",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_Y = {
  title: "BOOK LEVEL Y",
  author: "AUTHOR LEVEL Y",
  bookKey: "fiction_y",
  brand: "FP",
  fpLevel: "Y",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const FICTION_Z = {
  title: "BOOK LEVEL Z",
  author: "AUTHOR LEVEL Z",
  bookKey: "fiction_z",
  brand: "FP",
  fpLevel: "Z",
  genre: "FICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

/////////// FP END ///////////////////////

/////////////// FP NONFICTION END ///////////////

export const NONFICTION_A = {
  title: "BOOK LEVEL A",
  author: "AUTHOR LEVEL A",
  bookKey: "nonfiction_a",
  brand: "FP",
  fpLevel: "A",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_B = {
  title: "BOOK LEVEL B",
  author: "AUTHOR LEVEL B",
  bookKey: "nonfiction_b",
  brand: "FP",
  fpLevel: "B",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_C = {
  title: "BOOK LEVEL C",
  author: "AUTHOR LEVEL C",
  bookKey: "nonfiction_c",
  brand: "FP",
  fpLevel: "C",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_D = {
  title: "BOOK LEVEL D",
  author: "AUTHOR LEVEL D",
  bookKey: "nonfiction_d",
  brand: "FP",
  fpLevel: "D",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_E = {
  title: "BOOK LEVEL E",
  author: "AUTHOR LEVEL E",
  bookKey: "nonfiction_e",
  brand: "FP",
  fpLevel: "E",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_F = {
  title: "BOOK LEVEL F",
  author: "AUTHOR LEVEL F",
  bookKey: "nonfiction_f",
  brand: "FP",
  fpLevel: "F",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_G = {
  title: "BOOK LEVEL G",
  author: "AUTHOR LEVEL G",
  bookKey: "nonfiction_g",
  brand: "FP",
  fpLevel: "G",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_H = {
  title: "BOOK LEVEL H",
  author: "AUTHOR LEVEL H",
  bookKey: "nonfiction_h",
  brand: "FP",
  fpLevel: "H",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_I = {
  title: "BOOK LEVEL I",
  author: "AUTHOR LEVEL I",
  bookKey: "nonfiction_i",
  brand: "FP",
  fpLevel: "I",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_J = {
  title: "BOOK LEVEL J",
  author: "AUTHOR LEVEL J",
  bookKey: "nonfiction_j",
  brand: "FP",
  fpLevel: "J",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_K = {
  title: "BOOK LEVEL K",
  author: "AUTHOR LEVEL K",
  bookKey: "nonfiction_k",
  brand: "FP",
  fpLevel: "K",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_L = {
  title: "BOOK LEVEL L",
  author: "AUTHOR LEVEL L",
  bookKey: "nonfiction_l",
  brand: "FP",
  fpLevel: "L",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_M = {
  title: "BOOK LEVEL M",
  author: "AUTHOR LEVEL M",
  bookKey: "nonfiction_m",
  brand: "FP",
  fpLevel: "M",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_N = {
  title: "BOOK LEVEL N",
  author: "AUTHOR LEVEL N",
  bookKey: "nonfiction_n",
  brand: "FP",
  fpLevel: "N",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_O = {
  title: "BOOK LEVEL O",
  author: "AUTHOR LEVEL O",
  bookKey: "nonfiction_o",
  brand: "FP",
  fpLevel: "O",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_P = {
  title: "BOOK LEVEL P",
  author: "AUTHOR LEVEL P",
  bookKey: "nonfiction_p",
  brand: "FP",
  fpLevel: "P",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_Q = {
  title: "BOOK LEVEL Q",
  author: "AUTHOR LEVEL Q",
  bookKey: "nonfiction_q",
  brand: "FP",
  fpLevel: "Q",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_R = {
  title: "BOOK LEVEL R",
  author: "AUTHOR LEVEL R",
  bookKey: "nonfiction_r",
  brand: "FP",
  fpLevel: "R",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_S = {
  title: "BOOK LEVEL S",
  author: "AUTHOR LEVEL S",
  bookKey: "nonfiction_s",
  brand: "FP",
  fpLevel: "S",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_T = {
  title: "BOOK LEVEL T",
  author: "AUTHOR LEVEL T",
  bookKey: "nonfiction_t",
  brand: "FP",
  fpLevel: "T",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_U = {
  title: "BOOK LEVEL U",
  author: "AUTHOR LEVEL U",
  bookKey: "nonfiction_u",
  brand: "FP",
  fpLevel: "U",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_V = {
  title: "BOOK LEVEL V",
  author: "AUTHOR LEVEL V",
  bookKey: "nonfiction_v",
  brand: "FP",
  fpLevel: "V",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_W = {
  title: "BOOK LEVEL W",
  author: "AUTHOR LEVEL W",
  bookKey: "nonfiction_w",
  brand: "FP",
  fpLevel: "W",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_X = {
  title: "BOOK LEVEL X",
  author: "AUTHOR LEVEL X",
  bookKey: "nonfiction_x",
  brand: "FP",
  fpLevel: "X",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_Y = {
  title: "BOOK LEVEL Y",
  author: "AUTHOR LEVEL Y",
  bookKey: "nonfiction_y",
  brand: "FP",
  fpLevel: "Y",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

export const NONFICTION_Z = {
  title: "BOOK LEVEL Z",
  author: "AUTHOR LEVEL Z",
  bookKey: "nonfiction_z",
  brand: "FP",
  fpLevel: "Z",
  genre: "NONFICTION",
  markup: null,
  isWideBook: false,
  coverImage: "/images/fp-generic.jpg",
  numSections: 3,
  numPages: 1,
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    }
  },
  sections: {
    1: "Within the Text",
    2: "Beyond the Text",
    3: "About the Text"
  },
  questions: {
    1: {}
  }
};

/////////// FP NONFICTION END /////////////////////

export const library = {
  nonfiction_a: NONFICTION_A,
  nonfiction_b: NONFICTION_B,
  nonfiction_c: NONFICTION_C,
  nonfiction_d: NONFICTION_D,
  nonfiction_e: NONFICTION_E,
  nonfiction_f: NONFICTION_F,
  nonfiction_g: NONFICTION_G,
  nonfiction_h: NONFICTION_H,
  nonfiction_i: NONFICTION_I,
  nonfiction_j: NONFICTION_J,
  nonfiction_k: NONFICTION_K,
  nonfiction_l: NONFICTION_L,
  nonfiction_m: NONFICTION_M,
  nonfiction_n: NONFICTION_N,
  nonfiction_o: NONFICTION_O,
  nonfiction_p: NONFICTION_P,
  nonfiction_q: NONFICTION_Q,
  nonfiction_r: NONFICTION_R,
  nonfiction_s: NONFICTION_S,
  nonfiction_t: NONFICTION_T,
  nonfiction_u: NONFICTION_U,
  nonfiction_v: NONFICTION_V,
  nonfiction_w: NONFICTION_W,
  nonfiction_x: NONFICTION_X,
  nonfiction_y: NONFICTION_Y,
  nonfiction_z: NONFICTION_Z,

  fiction_a: FICTION_A,
  fiction_b: FICTION_B,
  fiction_c: FICTION_C,
  fiction_d: FICTION_D,
  fiction_e: FICTION_E,
  fiction_f: FICTION_F,
  fiction_g: FICTION_G,
  fiction_h: FICTION_H,
  fiction_i: FICTION_I,
  fiction_j: FICTION_J,
  fiction_k: FICTION_K,
  fiction_l: FICTION_L,
  fiction_m: FICTION_M,
  fiction_n: FICTION_N,
  fiction_o: FICTION_O,
  fiction_p: FICTION_P,
  fiction_q: FICTION_Q,
  fiction_r: FICTION_R,
  fiction_s: FICTION_S,
  fiction_t: FICTION_T,
  fiction_u: FICTION_U,
  fiction_v: FICTION_V,
  fiction_w: FICTION_W,
  fiction_x: FICTION_X,
  fiction_y: FICTION_Y,
  fiction_z: FICTION_Z,

  demo: fireflyBook,
  nick: fpBook,
  firefly: fireflyBook,

  step1: step1,
  step2: step2,
  step3: step3,

  step4: step4,
  step5: step5,
  step6: step6,
  step7: step7,
  step8: step8,
  step9: step9,
  step10: step10,
  step11: step11,
  step12: step12,

  step4p: step4p,
  step5p: step5p,
  step6p: step6p,
  step7p: step7p,
  step8p: step8p,
  step9p: step9p,
  step10p: step10p,
  step11p: step11p,
  step12p: step12p
};

export const spellingLibrary = {
  1: group1SpellingObj,
  2: group2SpellingObj,
  3: group3SpellingObj,
  4: group4SpellingObj,
  5: purpleGroup1SpellingObj,
  6: purpleGroup2SpellingObj,
  7: purpleGroup3SpellingObj,
  8: purpleGroup4SpellingObj
};
