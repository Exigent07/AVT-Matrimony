"use client";

import Link from "next/link";
import { CircleHelp, Home, RefreshCcw, Search } from "lucide-react";
import { SystemStatusScreen } from "@/components/shared/SystemStatusScreen";
import { useLanguage } from "@/providers/LanguageProvider";

export function NotFoundStatusView() {
  const { language } = useLanguage();
  const siteName = language === "ta" ? "AV தமிழ் மேட்ரிமோனி" : "AV Tamil Matrimony";

  return (
    <SystemStatusScreen
      code="404"
      label={language === "ta" ? "கிடைக்கவில்லை" : "Not found"}
      title={
        language === "ta"
          ? "நீங்கள் வந்த பாதையில் இந்தப் பக்கம் இனி இல்லை."
          : "This page is no longer on the route you followed."
      }
      description={
        language === "ta"
          ? `முகவரி பழையதாக இருக்கலாம், சுயவிவரம் அகற்றப்பட்டிருக்கலாம், அல்லது இந்தப் பக்கம் ${siteName}-யின் வேறு பிரிவுக்குச் சென்றிருக்கலாம்.`
          : `The address may be outdated, the profile may have been removed, or the page may have moved to a different section of ${siteName}.`
      }
      actions={
        <>
          <Link href="/" className="btn-primary px-6 py-3.5 text-sm">
            <Home className="h-4 w-4" />
            <span>{language === "ta" ? "முகப்புக்கு திரும்பு" : "Back to home"}</span>
          </Link>
          <Link href="/help" className="btn-secondary px-6 py-3.5 text-sm">
            <CircleHelp className="h-4 w-4" />
            <span>{language === "ta" ? "உதவி மையத்திற்குச் செல்லவும்" : "Visit help center"}</span>
          </Link>
        </>
      }
      tips={[
        {
          title: language === "ta" ? "இணைப்பைச் சரிபார்க்கவும்" : "Check the link",
          description:
            language === "ta"
              ? "முகவரியை கைமுறையாக உள்ளிட்டிருந்தால், ஒரு சிறிய எழுத்துப் பிழை கூட கிடைக்காத பக்கத்துக்குக் கொண்டு செல்லலாம்."
              : "If you typed the address manually, a small typo can land on a missing page.",
        },
        {
          title: language === "ta" ? "நிலையான பகுதியிலிருந்து தொடங்குங்கள்" : "Start from a stable area",
          description:
            language === "ta"
              ? "செயலில் உள்ள பாதைக்கு திரும்ப முகப்பு, உதவி மையம், அல்லது உறுப்பினர் தேடலைப் பயன்படுத்துங்கள்."
              : "Use the homepage, help center, or member search to return to an active path.",
        },
        {
          title: language === "ta" ? "உறுப்பினர் சுயவிவரம் மாற்றப்பட்டது" : "Member profile moved",
          description:
            language === "ta"
              ? "சில சுயவிவரங்கள் அவற்றின் காட்சியளிப்பு அல்லது அங்கீகார நிலை மாறியிருந்தால் இனி கிடைக்காமல் இருக்கலாம்."
              : "Some profiles may no longer be available if their visibility or approval status changed.",
        },
      ]}
      detail={
        <span className="inline-flex items-center gap-2">
          <Search className="h-4 w-4 text-[#B91C1C]" />
          {language === "ta"
            ? "தொடர்வதற்கான வேகமான வழி அடிக்குறிப்பிலுள்ள தேடல் அல்லது வழிசெலுத்தல் இணைப்புகள்."
            : "Search or navigation links in the footer are the fastest way to continue."}
        </span>
      }
    />
  );
}

interface ErrorStatusViewProps {
  error: Error & { digest?: string };
  onRetry: () => void;
  scope?: "segment" | "global";
}

export function ErrorStatusView({
  error,
  onRetry,
  scope = "segment",
}: ErrorStatusViewProps) {
  const { language } = useLanguage();
  const isGlobal = scope === "global";

  return (
    <SystemStatusScreen
      code="500"
      label={
        language === "ta"
          ? isGlobal
            ? "பயன்பாட்டு பிழை"
            : "ஏதோ தவறு ஏற்பட்டது"
          : isGlobal
            ? "Application error"
            : "Something went wrong"
      }
      tone="error"
      title={
        language === "ta"
          ? isGlobal
            ? "பயன்பாட்டின் இந்த பகுதி புதிய தொடக்கத்தைத் தேவைப்படுகிறது."
            : "இந்தப் பக்கத்தை ஏற்றும்போது எதிர்பாராத சிக்கல் ஏற்பட்டது."
          : isGlobal
            ? "This part of the application needs a fresh start."
            : "We hit an unexpected issue while loading this page."
      }
      description={
        language === "ta"
          ? isGlobal
            ? "நீங்கள் கேட்ட அனுபவத்தை இப்போது காட்ட முடியவில்லை. மீண்டும் முயற்சிக்கலாம், முதன்மை தளத்திற்குத் திரும்பலாம், அல்லது சிக்கல் தொடர்ந்தால் உதவி மையத்தைப் பயன்படுத்தலாம்."
            : "தயாரிப்பு இன்னும் செயலிலுள்ளது, ஆனால் இந்தக் குறிப்பிட்ட கோரிக்கை சீராக நிறைவடையவில்லை. நீங்கள் பாதுகாப்பாக மீண்டும் முயற்சிக்கலாம் அல்லது நிலையான பக்கத்திற்குத் திரும்பலாம்."
          : isGlobal
            ? "We could not render the requested experience right now. You can retry, return to the main site, or use the help center if the issue continues."
            : "The product is still here, but this specific request did not complete cleanly. You can retry safely or move back to a stable page."
      }
      actions={
        <>
          <button onClick={onRetry} className="btn-primary px-6 py-3.5 text-sm">
            <RefreshCcw className="h-4 w-4" />
            <span>{language === "ta" ? "மீண்டும் முயற்சி செய்" : "Try again"}</span>
          </button>
          <Link href="/" className="btn-secondary px-6 py-3.5 text-sm">
            <Home className="h-4 w-4" />
            <span>{language === "ta" ? "முகப்புக்கு திரும்பு" : "Back to home"}</span>
          </Link>
        </>
      }
      tips={[
        {
          title: language === "ta" ? "இந்த கோரிக்கையை மீண்டும் முயற்சி செய்க" : "Retry this request",
          description:
            language === "ta"
              ? "தற்காலிக காட்சியமைப்பு அல்லது தரவு ஏற்றுச் சிக்கல்கள் அடுத்த முயற்சியில் பெரும்பாலும் சரியாகிவிடும்."
              : "Temporary rendering or data-loading issues often resolve on the next attempt.",
        },
        {
          title: language === "ta" ? "நிலையான பக்கத்திற்குத் திரும்பு" : "Return to a stable page",
          description:
            language === "ta"
              ? "முகப்பு, முகப்புப் பலகை, மற்றும் உதவி பக்கங்கள் உடனே தொடர விரும்பினால் நல்ல மாற்றுப் பாதைகள்."
              : "Home, dashboard, and help pages are good fallback routes if you want to continue immediately.",
        },
        {
          title: language === "ta" ? "தேவையானால் ஆதரவைத் தொடர்புகொள்ளுங்கள்" : "Contact support if needed",
          description:
            language === "ta"
              ? "அதே பிழை மீண்டும் மீண்டும் ஏற்பட்டால், கீழே உள்ள குறிப்பு எண்ணை ஆதரவுடன் பகிருங்கள்."
              : "If the same error repeats, share the reference code below with support for faster help.",
        },
      ]}
      detail={
        error.digest ? (
          <span className="inline-flex items-center gap-2">
            <CircleHelp className="h-4 w-4 text-[#B91C1C]" />
            {language === "ta" ? "குறிப்பு" : "Reference"}: {error.digest}
          </span>
        ) : language === "ta" ? (
          "சிக்கல் தொடர்ந்தால், உதவி மையம் சரியான ஆதரவு பாதையைத் தேர்ந்தெடுக்க உதவும்."
        ) : (
          "If the issue persists, the help center can guide you to the right support path."
        )
      }
    />
  );
}
