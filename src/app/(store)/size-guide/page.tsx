
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ruler, Info } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Ruler className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Size Guide</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Find your perfect fit with our comprehensive sizing charts.
        </p>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-2xl">How to Measure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>To ensure the best fit, we recommend measuring yourself carefully using a soft measuring tape. Compare your measurements to the charts below.</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Bust:</strong> Measure around the fullest part of your chest, keeping the tape parallel to the floor.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, typically the narrowest part of your torso.</li>
            <li><strong>Hips:</strong> Measure around the fullest part of your hips and seat.</li>
            <li><strong>Inseam (for Trousers):</strong> Measure from the top of your inner thigh down to your ankle.</li>
          </ul>
          <div className="flex items-start p-4 bg-secondary/30 rounded-md border border-secondary">
            <Info className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
            <p className="text-sm">
              Sizing can vary slightly between different styles and fabrics. If you&apos;re between sizes or need further assistance, please don&apos;t hesitate to <a href="/contact" className="text-primary hover:underline">contact us</a>.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-10">
        {/* Women's Clothing Sizes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Women&apos;s Clothing (General)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Bust (cm)</TableHead>
                  <TableHead>Waist (cm)</TableHead>
                  <TableHead>Hips (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>XS (UK 6 / US 2)</TableCell>
                  <TableCell>78-82</TableCell>
                  <TableCell>60-64</TableCell>
                  <TableCell>86-90</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>S (UK 8 / US 4)</TableCell>
                  <TableCell>83-87</TableCell>
                  <TableCell>65-69</TableCell>
                  <TableCell>91-95</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>M (UK 10 / US 6)</TableCell>
                  <TableCell>88-92</TableCell>
                  <TableCell>70-74</TableCell>
                  <TableCell>96-100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>L (UK 12 / US 8)</TableCell>
                  <TableCell>93-97</TableCell>
                  <TableCell>75-79</TableCell>
                  <TableCell>101-105</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>XL (UK 14 / US 10)</TableCell>
                  <TableCell>98-102</TableCell>
                  <TableCell>80-84</TableCell>
                  <TableCell>106-110</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Men's Clothing Sizes - Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Men&apos;s Tops (General)</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Chest (cm)</TableHead>
                  <TableHead>Waist (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>S</TableCell>
                  <TableCell>91-96</TableCell>
                  <TableCell>76-81</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>M</TableCell>
                  <TableCell>97-102</TableCell>
                  <TableCell>82-87</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>L</TableCell>
                  <TableCell>103-108</TableCell>
                  <TableCell>88-93</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>XL</TableCell>
                  <TableCell>109-114</TableCell>
                  <TableCell>94-99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
             <p className="text-xs text-muted-foreground mt-3">*This is a general guide. Specific product measurements may vary.</p>
          </CardContent>
        </Card>
        
        {/* Placeholder for more specific guides (e.g., shoes) */}
        <div className="text-center text-muted-foreground">
          <p>More detailed guides for specific item types (e.g., footwear, trousers) will be added soon.</p>
        </div>
      </div>
    </div>
  );
}
