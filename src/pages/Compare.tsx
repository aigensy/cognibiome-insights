import { Card, CardContent } from '@/components/ui/card';

export default function Compare() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Compare Scenarios</h1>
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground text-sm">
          Side-by-side scenario comparison — coming soon. Run two simulations and compare outputs here.
        </CardContent>
      </Card>
    </div>
  );
}
