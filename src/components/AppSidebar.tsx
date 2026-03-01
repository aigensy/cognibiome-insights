import {
  LayoutDashboard, BarChart3, Cpu, FileOutput, ShieldCheck, GitCompare, HelpCircle,
  Presentation, RotateCcw
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Pilot Results', url: '/pilot', icon: BarChart3 },
  { title: 'Simulator', url: '/simulator', icon: Cpu },
  { title: 'Export Report', url: '/export', icon: FileOutput },
  { title: 'Methods & Rigor', url: '/methods', icon: ShieldCheck },
  { title: 'Compare Scenarios', url: '/compare', icon: GitCompare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="space-y-1">
            <h1 className="text-lg font-bold tracking-tight text-foreground">CogniBiome</h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              v0.1.0 — Demo
            </Badge>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold text-primary">CB</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
