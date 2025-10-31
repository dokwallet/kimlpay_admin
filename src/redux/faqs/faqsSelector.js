export const selectFaqs = state => state.faq?.faqs || [];
export const selectLoading = state => state.faq?.loading || false;
export const selectError = state => state.faq?.error || null;
export const selectOpenFaqIndexes = state => state.faq?.activeIndexes || [];
