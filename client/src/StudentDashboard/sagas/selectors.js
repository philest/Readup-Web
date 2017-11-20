// selectors
export const getRecorder = state => state.reader.recorder;
export const getIsDemo = state => state.reader.isDemo;
export const getIsWarmup = state => state.reader.isWarmup;

export const getReaderState = state => state.reader.readerState;

export const getNumQuestions = state => state.reader.book.numQuestions;

export const getQuestionNumber = state => state.reader.questionNumber;
export const getBook = state => state.reader.book;
export const getInComp = state => state.reader.inComp;
export const getPrompt = state => state.reader.prompt;
export const getInOralReading = state => state.reader.inOralReading;
export const getInSpelling = state => state.reader.inSpelling;
export const getHasLoggedIn = state => state.reader.getHasLoggedIn;

export const getSpellingQuestionNumber = state =>
	state.reader.spellingQuestionNumber;

export const getStudentName = state => state.reader.studentName;
