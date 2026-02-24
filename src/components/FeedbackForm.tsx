import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Send, Globe, Check, Lock, Sparkles, ChevronRight, ArrowLeft,Clock,Users,CreditCard,Utensils,ShoppingBag ,Sparkles as CleanIcon} from "lucide-react";
import { submitLike, submitReview } from "@/lib/firebase";
import { toast } from "sonner";
import madrasmania from "@/assets/madras-mania.png";

type Language = "en" | "de";
type FeedbackType = "like" | "dislike" | null;

const improvementIcons: Record<string, any> = {
  "Difficulties in placing an order": ShoppingBag,
  "Long waiting time": Clock,
  "Staff friendliness or service": Users,
  "Food quality or taste": Utensils,
  "Billing or payment issues": CreditCard,
  "Cleanliness or ambiance": CleanIcon,

  // German mapping
  "Schwierigkeiten bei der Bestellung": ShoppingBag,
  "Lange Wartezeit": Clock,
  "Freundlichkeit und Service des Personals": Users,
  "Qualität und Geschmack der Speisen": Utensils,
  "Probleme mit der Abrechnung oder Bezahlung": CreditCard,
  "Sauberkeit und Ambiente": CleanIcon
};
const translations = {
  en: {
    title: "How was your experience today?",
    subtitle: "Your opinion matters — helps us serve you better",
    quickNote: "Takes less than 20 seconds!",
    great: "Great",
    couldImprove: "Could Improve",
    anonymous: "Your feedback is",
    anonymousBold: "anonymous",
    anonymousEnd: "unless you enter contact info",
    dislikeTitle: "It seems we could have done better.",
    dislikeSubtitle: "We're sorry you weren't fully satisfied with your visit.",
    improve: "Could you please take a moment to tell us what we could do to improve?",
    comment: "Any specific feedback or details you'd like to share?",
    commentPlaceholder: "Share any thoughts here...",
    submit: "Submit Feedback",
    submitting: "Submitting...",
    success: "Thank you for your feedback!",
    error: "Please select at least one improvement area",
    thankYouTitle: "Thank you for",
    thankYouHighlight: "your feedback!",
    thankYouMessage: "We truly appreciate you taking the time to share your experience.",
    thankYouSubMessage: "Your feedback helps us improve and serve you better.",
    closeMessage: "You may now safely close this page.",
    checkboxes: [
      "Difficulties in placing an order",
      "Long waiting time",
      "Staff friendliness or service",
      "Food quality or taste",
      "Billing or payment issues",
      "Cleanliness or ambiance"
    ]
  },
  de: {
    title: "Wie war Ihre Erfahrung heute?",
    subtitle: "Ihre Meinung zählt — hilft uns, Sie besser zu bedienen",
    quickNote: "Dauert weniger als 20 Sekunden!",
    great: "Super",
    couldImprove: "Verbesserbar",
    anonymous: "Ihr Feedback ist",
    anonymousBold: "anonym",
    anonymousEnd: "sofern Sie keine Kontaktdaten angeben",
    dislikeTitle: "Es scheint, wir hätten es besser machen können.",
    dislikeSubtitle: "Es tut uns leid, dass Sie mit Ihrem Besuch nicht vollständig zufrieden waren.",
    improve: "Könnten Sie sich einen Moment Zeit nehmen, um uns zu sagen, was wir verbessern können?",
    comment: "Haben Sie spezifisches Feedback oder Details, die Sie teilen möchten?",
    commentPlaceholder: "Teilen Sie hier Ihre Gedanken...",
    submit: "Feedback absenden",
    submitting: "Wird gesendet...",
    success: "Vielen Dank für Ihr Feedback!",
    error: "Bitte wählen Sie mindestens einen Verbesserungsbereich",
    thankYouTitle: "Vielen Dank für",
    thankYouHighlight: "Ihr Feedback!",
    thankYouMessage: "Wir schätzen es sehr, dass Sie sich die Zeit genommen haben, Ihre Erfahrungen zu teilen.",
    thankYouSubMessage: "Ihr Feedback hilft uns, uns zu verbessern und Sie besser zu bedienen.",
    closeMessage: "Sie können diese Seite jetzt schließen.",
    checkboxes: [
      "Schwierigkeiten bei der Bestellung",
      "Lange Wartezeit",
      "Freundlichkeit und Service des Personals",
      "Qualität und Geschmack der Speisen",
      "Probleme mit der Abrechnung oder Bezahlung",
      "Sauberkeit und Ambiente"
    ]
  }
};

const GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/Madras+Mania+Restaurant/@49.3797369,8.6903109,567m/data=!3m1!1e3!4m8!3m7!1s0x4797c151de123ba5:0x3a2fd758c90eaaf0!8m2!3d49.3797369!4d8.6903109!9m1!1b1!16s%2Fg%2F11w2b2w0ln?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D";

const FeedbackForm = () => {
  const [lang, setLang] = useState<Language>(
    navigator.language.startsWith("de") ? "de" : "en"
  );
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = translations[lang];

  const handleLike = async () => {
    setFeedbackType("like");
    
    try {
      await submitLike(lang);
    } catch (error) {
      console.error("Error storing like:", error);
    }
    
    setIsSubmitted(true);
    window.open(GOOGLE_REVIEW_URL, "_blank");
  };

  const handleDislike = () => {
    setFeedbackType("dislike");
  };

  const toggleImprovement = (item: string) => {
    setImprovements((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    if (improvements.length === 0) {
      toast.error(t.error);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview({
        improvements,
        comment: comment || undefined,
        language: lang
      });

      setIsSubmitted(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "de" : "en"));
  };

  // Thank you screen after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen clean-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="clean-card rounded-2xl p-10 max-w-md w-full text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {t.thankYouTitle}
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              {t.thankYouHighlight}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground mb-2">
              {t.thankYouMessage}
            </p>
            <p className="text-muted-foreground mb-8">
              {t.thankYouSubMessage}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-6 border-t border-border"
          >
            <p className="text-sm text-muted-foreground">
              {t.closeMessage}
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen clean-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="clean-card rounded-2xl p-5 sm:p-8 md:p-10 max-w-lg w-full relative z-10 mx-2"
      >
        {/* Logo & Language Toggle */}
        {/* <div className="flex items-center justify-between mb-4">
          <div className="w-8" /> {/* spacer */}
          {/* <img src={madrasmania} alt="Madras Mania" className="h-14 md:h-16 rounded-lg object-contain" />
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "DE" : "EN"}
          </button>
        </div> */} 
        {/* Top Header Row */}
<div className="flex items-center justify-between mb-6">
  {/* Left Side (Back or Spacer) */}
  {feedbackType === "dislike" ? (
    <button
      onClick={() => setFeedbackType(null)}
      className="flex items-center text-primary hover:text-primary/80 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  ) : (
    <div className="w-5" /> // keeps logo centered when no back button
  )}

  {/* Center Logo */}
  <img
    src={madrasmania}
    alt="Madras Mania"
    className="h-14 md:h-16 rounded-lg object-contain"
  />

  {/* Language Toggle */}
  <button
    onClick={toggleLang}
    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
  >
    <Globe className="w-4 h-4" />
    {lang === "en" ? "DE" : "EN"}
  </button>
</div>


        <AnimatePresence mode="wait">
          {feedbackType !== "dislike" ? (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h1
                  key={lang + "-title"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl md:text-3xl font-bold text-foreground mb-3"
                >
                  {t.title}
                </motion.h1>
                <motion.p
                  key={lang + "-subtitle"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground"
                >
                  {t.subtitle}
                </motion.p>
              </div>

              {/* Quick Note */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="h-px bg-border flex-1" />
                <div className="flex items-center gap-2 text-sm text-primary font-medium px-4">
                  <Sparkles className="w-4 h-4" />
                  {t.quickNote}
                </div>
                <div className="h-px bg-border flex-1" />
              </div>

              {/* Feedback Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLike}
                  className={`feedback-btn rounded-2xl p-6 flex flex-col items-center gap-3 ${
                    feedbackType === "like" ? "feedback-btn-active" : ""
                  }`}
                >
                  <ThumbsUp
                    className={`w-12 h-12 transition-colors ${
                      feedbackType === "like"
                        ? "text-primary-foreground"
                        : "text-primary"
                    }`}
                  />
                  <span className={`font-semibold text-lg ${
                    feedbackType === "like"
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}>
                    {t.great}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDislike}
                  className="feedback-btn rounded-2xl p-6 flex flex-col items-center gap-3"
                >
                  <ThumbsDown className="w-12 h-12 text-muted-foreground" />
                  <span className="font-semibold text-lg text-foreground">
                    {t.couldImprove}
                  </span>
                </motion.button>
              </div>

              {/* Anonymous Note */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>
                  {t.anonymous} <strong>{t.anonymousBold}</strong> {t.anonymousEnd}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dislike-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              
              {/* Back Button */}
              <button
                onClick={() => setFeedbackType(null)}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium mb-4"
              >
              
                {lang === "en" ? "" : ""}
              </button>

              {/* Dislike Header */}
              <div className="text-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  {t.dislikeTitle}
                </h1>
                <p className="text-muted-foreground text-sm mb-4">
                  {t.dislikeSubtitle}
                </p>
              </div>

              {/* Improvement Areas - Grid */}
              <p className="text-sm font-medium text-foreground text-left mb-2">
                  {t.improve}
                </p>
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 mb-6">
                {t.checkboxes.map((item, index) => (
                  <motion.label
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`checkbox-item rounded-xl p-3 cursor-pointer flex items-center gap-3 ${
                      improvements.includes(item) ? "checkbox-item-active" : ""
                    }`}
                  >
                    {/* <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        improvements.includes(item)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {improvements.includes(item) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div> */}
                    <div
  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
    improvements.includes(item)
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-primary"
  }`}
>
  {(() => {
    const Icon = improvementIcons[item];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  })()}
</div>
                    <input
                      type="checkbox"
                      checked={improvements.includes(item)}
                      onChange={() => toggleImprovement(item)}
                      className="sr-only"
                    />
                    <span className="text-sm text-foreground leading-tight">{item}</span>
                  </motion.label>
                ))}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.comment}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 rounded-xl border border-input bg-muted/30 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                  rows={3}
                  placeholder={t.commentPlaceholder}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl submit-btn text-primary-foreground font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t.submit}
                  </>
                )}
              </motion.button>

              {/* Anonymous Note */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                <Lock className="w-4 h-4" />
                <span>
                  {t.anonymous} <strong>{t.anonymousBold}</strong> {t.anonymousEnd}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FeedbackForm;
