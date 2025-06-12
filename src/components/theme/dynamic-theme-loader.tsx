
import { db } from '@/lib/firebase';
import type { ThemeSettings, FontOption, HSLColor } from '@/types';
import { doc, getDoc } from 'firebase/firestore';

const THEME_COLLECTION_PATH = "site_settings"; // Changed from THEME_DOC_PATH
const THEME_DOC_ID = "theme"; // Changed to be simpler and act as the document ID

const bodyFontOptions: FontOption[] = [
  { name: "Inter", value: "Inter", googleFontName: "Inter", weights: "400;500;600;700" },
  { name: "Roboto", value: "Roboto", googleFontName: "Roboto", weights: "400;500;700" },
  { name: "Open Sans", value: "Open Sans", googleFontName: "Open+Sans", weights: "400;600;700" },
  { name: "Lato", value: "Lato", googleFontName: "Lato", weights: "400;700" },
  { name: "Noto Sans", value: "Noto Sans", googleFontName: "Noto+Sans", weights: "400;500;700" },
];

const headlineFontOptions: FontOption[] = [
  { name: "Playfair Display", value: "Playfair Display", googleFontName: "Playfair+Display", weights: "400;700;900" },
  { name: "Lora", value: "Lora", googleFontName: "Lora", weights: "400;500;700" },
  { name: "Merriweather", value: "Merriweather", googleFontName: "Merriweather", weights: "400;700;900" },
  { name: "Montserrat", value: "Montserrat", googleFontName: "Montserrat", weights: "400;500;700;900" },
  { name: "Raleway", value: "Raleway", googleFontName: "Raleway", weights: "400;500;700;900" },
];

function getFontDetails(fontFamilyName: string, type: 'body' | 'headline'): FontOption | undefined {
  const options = type === 'body' ? bodyFontOptions : headlineFontOptions;
  return options.find(f => f.value === fontFamilyName);
}

export async function DynamicThemeLoader() {
  let themeSettings: ThemeSettings | null = null;
  try {
    const themeDocRef = doc(db, THEME_COLLECTION_PATH, THEME_DOC_ID); // Use updated path
    const docSnap = await getDoc(themeDocRef);
    if (docSnap.exists()) {
      themeSettings = docSnap.data() as ThemeSettings;
    }
  } catch (error) {
    console.error("Error fetching theme settings for DynamicThemeLoader:", error);
    // Continue with defaults if fetching fails
  }

  if (!themeSettings) {
    // If no theme settings are found in Firestore, we rely on the defaults in globals.css
    // We still need to load default fonts if they are not the absolute fallback sans-serif/serif
    const defaultBodyFont = getFontDetails('Inter', 'body');
    const defaultHeadlineFont = getFontDetails('Playfair Display', 'headline');
    let defaultFontFamilies = [];
    if (defaultBodyFont?.googleFontName) {
        defaultFontFamilies.push(`family=${defaultBodyFont.googleFontName}${defaultBodyFont.weights ? `:wght@${defaultBodyFont.weights}` : ''}`);
    }
    if (defaultHeadlineFont?.googleFontName && defaultHeadlineFont.googleFontName !== defaultBodyFont?.googleFontName) {
        defaultFontFamilies.push(`family=${defaultHeadlineFont.googleFontName}${defaultHeadlineFont.weights ? `:wght@${defaultHeadlineFont.weights}` : ''}`);
    }

    if (defaultFontFamilies.length > 0) {
        const defaultFontUrl = `https://fonts.googleapis.com/css2?${defaultFontFamilies.join('&')}&display=swap`;
        return (
            <>
              <link href={defaultFontUrl} rel="stylesheet" />
            </>
        );
    }
    return null;
  }

  const { colors, fonts } = themeSettings;
  let cssVariables = ':root {\n';

  // Color HSL component variables
  for (const [key, value] of Object.entries(colors)) {
    const color = value as HSLColor; // Type assertion
    cssVariables += `  --${key}-h: ${color.h};\n`;
    cssVariables += `  --${key}-s: ${color.s}%;\n`;
    cssVariables += `  --${key}-l: ${color.l}%;\n`;
  }
  
  // Font family variables
  cssVariables += `  --font-body-family: '${fonts.bodyFamily}';\n`;
  cssVariables += `  --font-headline-family: '${fonts.headlineFamily}';\n`;
  cssVariables += '}';

  // Construct Google Fonts URL
  const bodyFontDetails = getFontDetails(fonts.bodyFamily, 'body');
  const headlineFontDetails = getFontDetails(fonts.headlineFamily, 'headline');
  
  const fontFamilies = [];
  if (bodyFontDetails?.googleFontName) {
    fontFamilies.push(`family=${bodyFontDetails.googleFontName}${bodyFontDetails.weights ? `:wght@${bodyFontDetails.weights}` : ''}`);
  }
  if (headlineFontDetails?.googleFontName && headlineFontDetails.googleFontName !== bodyFontDetails?.googleFontName) {
    // Avoid duplicate font loading if body and headline use the same base font but different explicit names (e.g. Roboto vs Roboto Condensed)
    fontFamilies.push(`family=${headlineFontDetails.googleFontName}${headlineFontDetails.weights ? `:wght@${headlineFontDetails.weights}` : ''}`);
  }
  
  const googleFontsUrl = fontFamilies.length > 0 
    ? `https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap`
    : null;

  return (
    <>
      {googleFontsUrl && <link href={googleFontsUrl} rel="stylesheet" />}
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
    </>
  );
}
