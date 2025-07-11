// Run this function from Google Spreadsheet with quiz questions: Extension -> App Scripts
// Ensure that quiz mode is enable in Google Form: Setting -> Make this a quiz
function importQuizFromSheetToForm() {
  const form = FormApp.openById("1TrjUrpLFuRZOh3b25NSukcbXoYIRNTI2D8oGFogykAM");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // Delete all existing form questions
  const allItems = form.getItems();
  for (let i = 0; i < allItems.length; i++) {
    form.deleteItem(allItems[i]);
  }

  for (let i = 1; i < data.length; i++) {
    const [question, optA, optB, optC, optD, correct, explanation] = data[i];
    const item = form.addMultipleChoiceItem();

    const choices = [optA, optB, optC, optD].map((opt) =>
      item.createChoice(opt, opt === correct)
    );

    const feedback = FormApp.createFeedback().setText(explanation || ""); // fallback to empty if no explanation

    item
      .setTitle(`Q${i}: ${question}`)
      .setChoices(choices)
      .showOtherOption(false)
      .setPoints(1)
      .setRequired(true)
      .setFeedbackForCorrect(feedback.build())
      .setFeedbackForIncorrect(feedback.build());
  }

  Logger.log("Quiz with explanations imported successfully.");
}
