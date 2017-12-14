export const words = [
  "shaking",
  "bagged",
  "batter",
  "running",
  "bitter",
  "hiking",
  "tennis",
  "gripped",
  "warning",
  "dinner",
  "retain",
  "happen",
  "explode",
  "disturb",
  "review",
  "survive",
  "explain",
  "return",
  "complain",
  "boring"
];
export const responses = [
  "shaking",
  "bagged",
  "bater",
  "running",
  "bitter",
  "hiking",
  "tennis",
  "gripped",
  "warning",
  "dinner",
  "retane",
  "happen",
  "explode",
  "disturb",
  "review",
  "survive",
  "explane",
  "return",
  "complain",
  "boring"
];

export const titles = [
  "Words",
  "Student Responses",
  "-ed/ing Endings",
  "Doubling at Syllable Juncture",
  "Long-Vowel Two-syllable Words",
  "R-Controlled Two-Syllable Words"
];

export const isSpelledCorrectlyArr = [
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true
];

export const endings = [
  true,
  true,
  null,
  true,
  null,
  true,
  null,
  true,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

export const doubling = [
  null,
  null,
  false,
  null,
  true,
  null,
  true,
  null,
  null,
  true,
  null,
  true,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

export const long = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  false,
  null,
  true,
  null,
  true,
  null,
  false,
  null,
  true,
  null
];

export const rControlled = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  true,
  null,
  null,
  null,
  null,
  true,
  null,
  true,
  null,
  true,
  null,
  true
];

export var sampleSpellingObj = {
  numWords: 20,
  words: words,
  responses: responses,
  numSections: 4,
  sections: {
    1: {
      title: "-ed/ing Endings",
      statusArr: endings
    },
    2: {
      title: "Doubling at Syllable Juncture",
      statusArr: doubling
    },
    3: {
      title: "Long-Vowel Two-syllable Words",
      statusArr: long
    },
    4: {
      title: "R-Controlled Two-Syllable Words",
      statusArr: rControlled
    }
  }
};
