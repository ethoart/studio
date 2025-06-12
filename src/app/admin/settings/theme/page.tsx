
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { ThemeSettings, HSLColor, ColorSetting, FontOption } from "@/types";
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle } from 'lucide-react';

const THEME_COLLECTION_PATH = "site_settings"; // Changed from THEME_DOC_PATH
const THEME_DOC_ID = "theme"; // Changed to be simpler and act as the document ID

const initialColors: ThemeSettings['colors'] = {
  background: { h: 0, s: 0, l: 96.1 },
  foreground: { h: 0, s: 0, l: 20 },
  primary: { h: 0, s: 0, l: 20 },
  primaryForeground: { h: 0, s: 0, l: 98 },
  secondary: { h: 0, s: 0, l: 90 },
  secondaryForeground: { h: 0, s: 0, l: 20 },
  muted: { h: 0, s: 0, l: 92 },
  mutedForeground: { h: 0, s: 0, l: 40 },
  accent: { h: 0, s: 0, l: 80 },
  accentForeground: { h: 0, s: 0, l: 20 },
  border: { h: 0, s: 0, l: 85 },
  ring: { h: 0, s: 0, l: 20 },
};

const initialFonts: ThemeSettings['fonts'] = {
  bodyFamily: 'Inter',
  headlineFamily: 'Playfair Display',
};

const defaultThemeSettings: ThemeSettings = {
  id: THEME_DOC_ID,
  colors: initialColors,
  fonts: initialFonts,
};

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


export default function ThemeSettingsPage() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchThemeSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const themeDocRef = doc(db, THEME_COLLECTION_PATH, THEME_DOC_ID); // Use updated path
      const docSnap = await getDoc(themeDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ThemeSettings;
        // Merge with defaults to ensure all fields are present
        setThemeSettings({
            ...defaultThemeSettings,
            ...data,
            colors: {
                ...defaultThemeSettings.colors,
                ...(data.colors || {}),
            },
            fonts: {
                ...defaultThemeSettings.fonts,
                ...(data.fonts || {}),
            }
        });
      } else {
        // No settings found, use defaults. They will be saved on first "Save Changes".
        setThemeSettings(defaultThemeSettings);
        toast({ title: "No Theme Found", description: "Default theme settings loaded. Save to create custom settings.", variant: "default" });
      }
    } catch (err: any) {
      console.error("Error fetching theme settings:", err);
      setError(`Failed to load theme settings: ${err.message}`);
      toast({ title: "Loading Error", description: `Could not load theme: ${err.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchThemeSettings();
  }, [fetchThemeSettings]);

  const handleColorChange = (colorName: keyof ThemeSettings['colors'], component: keyof HSLColor, value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    setThemeSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: {
          ...prev.colors[colorName],
          [component]: numericValue,
        }
      }
    }));
  };

  const handleFontChange = (fontType: keyof ThemeSettings['fonts'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value,
      }
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const themeDocRef = doc(db, THEME_COLLECTION_PATH, THEME_DOC_ID); // Use updated path
      const settingsToSave = {
        ...themeSettings,
        updatedAt: serverTimestamp(),
      };
      delete settingsToSave.id; // Don't save the id field within the document

      await setDoc(themeDocRef, settingsToSave, { merge: true });
      toast({ title: "Theme Settings Saved", description: "Your theme changes have been successfully saved." });
    } catch (err: any) {
      console.error("Error saving theme settings:", err);
      setError(`Failed to save theme settings: ${err.message}`);
      toast({ title: "Saving Error", description: `Could not save theme: ${err.message}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const colorFields: Array<{ label: string; name: keyof ThemeSettings['colors'] }> = [
    { label: "Background", name: "background" },
    { label: "Foreground", name: "foreground" },
    { label: "Primary", name: "primary" },
    { label: "Primary Foreground", name: "primaryForeground" },
    { label: "Secondary", name: "secondary" },
    { label: "Secondary Foreground", name: "secondaryForeground" },
    { label: "Muted", name: "muted" },
    { label: "Muted Foreground", name: "mutedForeground" },
    { label: "Accent", name: "accent" },
    { label: "Accent Foreground", name: "accentForeground" },
    { label: "Border", name: "border" },
    { label: "Ring", name: "ring" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading theme settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Theme Customization</h1>
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2 h-5 w-5" />Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Adjust the HSL (Hue, Saturation, Lightness) values for your site's color scheme. H (0-360), S (0-100), L (0-100).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {colorFields.map(({ label, name }) => (
            <div key={name} className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2 capitalize">{label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label htmlFor={`${name}-h`}>Hue (H)</Label>
                  <Input
                    id={`${name}-h`}
                    type="number"
                    min="0" max="360"
                    value={themeSettings.colors[name]?.h ?? ''}
                    onChange={(e) => handleColorChange(name, 'h', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor={`${name}-s`}>Saturation (S)</Label>
                  <Input
                    id={`${name}-s`}
                    type="number"
                    min="0" max="100"
                    value={themeSettings.colors[name]?.s ?? ''}
                    onChange={(e) => handleColorChange(name, 's', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor={`${name}-l`}>Lightness (L)</Label>
                  <Input
                    id={`${name}-l`}
                    type="number"
                    min="0" max="100"
                    value={themeSettings.colors[name]?.l ?? ''}
                    onChange={(e) => handleColorChange(name, 'l', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div
                  className="h-10 w-full rounded-md border"
                  style={{ backgroundColor: `hsl(${themeSettings.colors[name]?.h ?? 0} ${themeSettings.colors[name]?.s ?? 0}% ${themeSettings.colors[name]?.l ?? 0}%)` }}
                  title={`Current: H:${themeSettings.colors[name]?.h} S:${themeSettings.colors[name]?.s}% L:${themeSettings.colors[name]?.l}%`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Select the primary fonts for body text and headlines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bodyFont">Body Font</Label>
              <Select
                value={themeSettings.fonts.bodyFamily}
                onValueChange={(value) => handleFontChange('bodyFamily', value)}
                disabled={isSaving}
              >
                <SelectTrigger id="bodyFont"><SelectValue placeholder="Select body font" /></SelectTrigger>
                <SelectContent>
                  {bodyFontOptions.map(font => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="headlineFont">Headline Font</Label>
              <Select
                value={themeSettings.fonts.headlineFamily}
                onValueChange={(value) => handleFontChange('headlineFamily', value)}
                disabled={isSaving}
              >
                <SelectTrigger id="headlineFont"><SelectValue placeholder="Select headline font" /></SelectTrigger>
                <SelectContent>
                  {headlineFontOptions.map(font => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CardFooter className="border-t pt-6">
        <Button onClick={handleSaveChanges} disabled={isSaving || isLoading}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </CardFooter>
    </div>
  );
}
