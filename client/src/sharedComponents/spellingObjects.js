const group1Sections = {
    1: {
        title: "Short-Vowel Sound",
        statusArr: [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
        ]
    },
    2: {
        title: "Initial Blend/Digraph",
        statusArr: [
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            true,
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            true
        ]
    },
    3: {
        title: "Final Blend/Digraph",
        statusArr: [
            true,
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            "NO_VALUE"
        ]
    }
};

const group2Sections = {
    1: {
        title: "-V-C-e",
        statusArr: [
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE"
        ]
    },
    2: {
        title: "Long-Vowel Pattern",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true
        ]
    },
    3: {
        title: "R-controlled Vowel",
        statusArr: [
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE"
        ]
    }
};

const group3Sections = {
    1: {
        title: "R-Controlled Vowel",
        statusArr: [
            true,
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE"
        ]
    },
    2: {
        title: "Long-Vowel Pattern",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE"
        ]
    },
    3: {
        title: "Vowel Digraph/Diphthong",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE"
        ]
    },
    4: {
        title: "Complex Blend",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            true
        ]
    }
};

const group4Sections = {
    1: {
        title: "-ed/ing Endings",
        statusArr: [
            true,
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE"
        ]
    },
    2: {
        title: "Doubling at Syllable Juncture",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE"
        ]
    },
    3: {
        title: "Long-Vowel Two-syllable Words",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE"
        ]
    },
    4: {
        title: "R-Controlled Two-Syllable Words",
        statusArr: [
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true,
            "NO_VALUE",
            true
        ]
    }
};

export const group1SpellingObj = {
    numWords: 15,
    words: [
        "pest",
        "chip",
        "sand",
        "lump",
        "shop",
        "plum",
        "club",
        "wish",
        "ramp",
        "drip",
        "smog",
        "bath",
        "rent",
        "trot",
        "shed"
    ],
    responses: [],
    numSections: 3,
    sections: group1Sections
};

export const group2SpellingObj = {
    numWords: 15,
    words: [
        "blame",
        "bark",
        "prune",
        "born",
        "train",
        "smoke",
        "slime",
        "firm",
        "boast",
        "chase",
        "road",
        "hurt",
        "feed",
        "short",
        "bean"
    ],
    responses: [],
    numSections: 3,
    sections: group2Sections
};

export const group3SpellingObj = {
    numWords: 15,
    words: [
        "skirt",
        "charm",
        "coach",
        "barn",
        "juice",
        "first",
        "saint",
        "curl",
        "sweet",
        "steam",
        "shout",
        "roof",
        "string",
        "howl",
        "badge",
        "coin",
        "catch",
        "yawn",
        "scratch",
        "block"
    ],
    responses: [],
    numSections: 4,
    sections: group3Sections
};

export var group4SpellingObj = {
    numWords: 20,
    words: [
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
    ],
    numSections: 4,
    responses: [],
    sections: group4Sections
};

export const purpleGroup1SpellingObj = {
    numWords: 15,
    words: [
        "nest",
        "slim",
        "band",
        "much",
        "spot",
        "drum",
        "plan",
        "dish",
        "bump",
        "ship",
        "chop",
        "path",
        "dent",
        "frog",
        "step"
    ],
    responses: [],
    numSections: 3,
    sections: group1Sections
};

export const purpleGroup2SpellingObj = {
    numWords: 15,
    words: [
        "place",
        "dark",
        "flute",
        "nerd",
        "nail",
        "broke",
        "slide",
        "dirt",
        "roast",
        "mile",
        "rain",
        "burn",
        "sheet",
        "storm",
        "peach"
    ],
    responses: [],
    numSections: 3,
    sections: group2Sections
};

export const purpleGroup3SpellingObj = {
    numWords: 20,
    words: [
        "shark",
        "dart",
        "toast",
        "shirt",
        "suit",
        "farm",
        "brain",
        "corn",
        "teeth",
        "reach",
        "round",
        "stood",
        "stream",
        "frown",
        "bridge",
        "point",
        "patch",
        "crawl",
        "scrap",
        "flock"
    ],
    responses: [],
    numSections: 4,
    sections: group3Sections
};

export const purpleGroup4SpellingObj = {
    numWords: 20,
    words: [
        "baking",
        "bragged",
        "matter",
        "grabbed",
        "sitter",
        "riding",
        "robber",
        "hopped",
        "garden",
        "bunny",
        "compose",
        "bottom",
        "exclaim",
        "morning",
        "contain",
        "burden",
        "assume",
        "circus",
        "ashamed",
        "termite"
    ],
    responses: [],
    numSections: 4,
    sections: group4Sections
};
