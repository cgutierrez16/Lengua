function FormatTitle(title) {
    if (!title) return "";
    const temp = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    temp1 = temp.toLowerCase()
    temp2 = temp1.replace(/\s+/g, '');

    return temp2
}

function gradeTranslation(userTranslation, correctTranslation) {
    
}

const TranslateWithDeepl = async (lyricsArray) => {
  const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
  const translations = [];
  for (const line of lyricsArray) {
    const result = await translator.translateText(line, "es", "en-US");
    translations.push(result.text);
  }
  return translations;
};

module.exports = FormatTitle