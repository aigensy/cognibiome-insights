import { useEffect, useState } from 'react';
import {
  LayoutDashboard, BarChart3, Cpu, FileOutput, ShieldCheck, GitCompare, Database,
  BookOpen, ChevronRight, FileJson, FileText, FileSpreadsheet,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAppState } from '@/contexts/AppContext';

interface DocItem {
  id: string;
  title: string;
  path: string;
  category: string;
  media_type: string;
  description: string;
}

// Items visible in presenter mode (full judge flow: Pilot → Simulator → Methods → Export)
const PRESENTER_VISIBLE = new Set(['/', '/pilot', '/simulator', '/compare', '/methods', '/export']);

// Items that are on the primary "judge path" shown prominently in presenter mode
const JUDGE_PATH = new Set(['/', '/pilot', '/simulator', '/compare']);

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Pilot Results', url: '/pilot', icon: BarChart3 },
  { title: 'Simulator', url: '/simulator', icon: Cpu },
  { title: 'Compare Scenarios', url: '/compare', icon: GitCompare },
  { title: 'Export Report', url: '/export', icon: FileOutput },
  { title: 'Methods & Rigor', url: '/methods', icon: ShieldCheck },
  { title: 'Public Datasets', url: '/datasets', icon: Database },
];

function docIcon(mediaType: string) {
  if (mediaType.includes('json')) return FileJson;
  if (mediaType.includes('csv')) return FileSpreadsheet;
  return FileText;
}

const CATEGORY_ORDER = ['User Docs', 'Trifold Board', 'Foundation', 'Data'];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { presenterMode } = useAppState();

  const [docs, setDocs] = useState<DocItem[]>([]);
  const [docsOpen, setDocsOpen] = useState(location.pathname === '/help');

  // Load docs index once
  useEffect(() => {
    fetch('/foundation_pack/docs_index.json')
      .then(r => r.json())
      .then(data => setDocs(data.items ?? []))
      .catch(() => setDocs([]));
  }, []);

  // Open docs section when navigating to /help
  useEffect(() => {
    if (location.pathname === '/help') setDocsOpen(true);
  }, [location.pathname]);

  const visibleItems = presenterMode
    ? navItems.filter(item => PRESENTER_VISIBLE.has(item.url))
    : navItems;

  // Current selected doc id from URL
  const searchParams = new URLSearchParams(location.search);
  const selectedDocId = searchParams.get('doc');

  const visibleDocs = presenterMode
    ? docs.filter(d => d.category === 'User Docs')
    : docs;

  const docsByCategory = CATEGORY_ORDER.reduce<Record<string, DocItem[]>>((acc, cat) => {
    acc[cat] = visibleDocs.filter(d => d.category === cat);
    return acc;
  }, {});

  const handleDocClick = (item: DocItem) => {
    navigate(`/help?doc=${item.id}`);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="space-y-1">
            <h1 className="text-lg font-bold tracking-tight text-foreground">CogniBiome</h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              v0.1.0 — Demo
            </Badge>
            {presenterMode && (
              <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30">
                PRESENTER MODE
              </Badge>
            )}
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold text-primary">CB</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {presenterMode ? 'Judge Path' : 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isJudgePath = JUDGE_PATH.has(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-muted/50"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${presenterMode && isJudgePath ? 'text-primary' : ''}`}
                        />
                        {!collapsed && (
                          <span className={presenterMode && isJudgePath ? 'font-semibold' : ''}>
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}


              {/* Docs — collapsible with category sub-groups */}
              <Collapsible open={docsOpen} onOpenChange={setDocsOpen} asChild>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={location.pathname === '/help'}
                        className="hover:bg-muted/50 w-full"
                        onClick={() => {
                          if (location.pathname !== '/help') navigate('/help');
                        }}
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">Docs</span>
                            <ChevronRight
                              className={`h-3 w-3 shrink-0 transition-transform ${docsOpen ? 'rotate-90' : ''}`}
                            />
                          </>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {!collapsed && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-0 pl-2 border-l border-border/50 mt-1">
                          {CATEGORY_ORDER.map(cat => {
                            const catDocs = docsByCategory[cat] ?? [];
                            if (catDocs.length === 0) return null;
                            return (
                              <div key={cat} className={presenterMode ? '' : 'space-y-0.5 mb-2'}>
                                {!presenterMode && (
                                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 py-1">
                                    {cat}
                                  </p>
                                )}
                                {catDocs.map(doc => {
                                  const Icon = docIcon(doc.media_type);
                                  const isSelected = selectedDocId === doc.id && location.pathname === '/help';
                                  return (
                                    <SidebarMenuSubItem key={doc.id}>
                                      <SidebarMenuSubButton
                                        isActive={isSelected}
                                        className={`text-xs cursor-pointer w-full text-left truncate ${
                                          isSelected ? 'bg-primary/10 text-primary' : ''
                                        }`}
                                        onClick={() => handleDocClick(doc)}
                                      >
                                        <Icon className="h-3 w-3 shrink-0 mr-1 opacity-60" />
                                        <span className="truncate">{doc.title}</span>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground leading-tight">
            Educational research prototype.
            <br />Not medical advice.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
