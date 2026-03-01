import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocItem {
  id: string; title: string; path: string; category: string; media_type: string; description: string;
}

export default function HelpDocs() {
  const [items, setItems] = useState<DocItem[]>([]);
  const [selected, setSelected] = useState<DocItem | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/foundation_pack/docs_index.json')
      .then(r => r.json())
      .then(data => setItems(data.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const loadDoc = async (item: DocItem) => {
    setSelected(item);
    setLoading(true);
    try {
      const r = await fetch(item.path);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setContent(await r.text());
    } catch (e) {
      setContent(`Error loading document: ${e}`);
    } finally { setLoading(false); }
  };

  const categories = [...new Set(items.map(i => i.category))];

  const renderContent = () => {
    if (!selected || loading) return <p className="text-muted-foreground text-sm">Select a document to view.</p>;
    const mt = selected.media_type;
    if (mt.includes('json')) {
      try {
        const parsed = JSON.parse(content);
        return <pre className="text-xs font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap">{JSON.stringify(parsed, null, 2)}</pre>;
      } catch { return <pre className="text-xs font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap">{content}</pre>; }
    }
    if (mt.includes('csv')) {
      const lines = content.trim().split('\n');
      const headers = lines[0]?.split(',') ?? [];
      const rows = lines.slice(1, 101);
      return (
        <div className="overflow-auto max-h-[60vh]">
          <p className="text-[10px] text-muted-foreground mb-2">{lines.length - 1} rows total (showing first {Math.min(rows.length, 100)})</p>
          <table className="text-xs border-collapse w-full">
            <thead><tr>{headers.map((h, i) => <th key={i} className="border border-border px-2 py-1 text-left bg-muted/50">{h.trim()}</th>)}</tr></thead>
            <tbody>{rows.map((row, ri) => <tr key={ri}>{row.split(',').map((c, ci) => <td key={ci} className="border border-border px-2 py-1 font-mono">{c.trim()}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }
    if (mt.includes('markdown')) {
      // Simple markdown rendering (no external lib, just preformatted)
      return <div className="prose prose-invert prose-sm max-w-none max-h-[60vh] overflow-auto"><pre className="whitespace-pre-wrap text-xs">{content}</pre></div>;
    }
    return <pre className="text-xs font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap">{content}</pre>;
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content).then(() => toast({ title: 'Copied to clipboard' }));
  };

  const downloadContent = () => {
    if (!selected) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = selected.path.split('/').pop() ?? 'document';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Help / Docs</h1>
      <p className="text-xs text-muted-foreground">Foundation pack and reference snapshots — fully offline, read-only.</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-2">
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="w-full flex-wrap h-auto">
              {categories.map(c => <TabsTrigger key={c} value={c} className="text-xs">{c}</TabsTrigger>)}
            </TabsList>
            {categories.map(c => (
              <TabsContent key={c} value={c} className="space-y-1 mt-2">
                {items.filter(i => i.category === c).map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadDoc(item)}
                    className={`w-full text-left px-3 py-2 rounded text-xs hover:bg-muted/50 transition-colors ${selected?.id === item.id ? 'bg-primary/10 text-primary border border-primary/30' : 'border border-transparent'}`}
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.description}</p>
                  </button>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{selected?.title ?? 'Document Viewer'}</CardTitle>
              {selected && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={copyContent}><Copy className="h-3 w-3" /> Copy</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={downloadContent}><Download className="h-3 w-3" /> Download</Button>
                </div>
              )}
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
