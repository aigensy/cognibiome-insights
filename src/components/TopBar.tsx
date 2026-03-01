import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Presentation, RotateCcw, HelpCircle } from 'lucide-react';
import { useAppState } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function TopBar() {
  const { presenterMode, setPresenterMode, resetDemoState } = useAppState();
  const navigate = useNavigate();

  return (
    <header className="h-12 flex items-center justify-between border-b border-border px-3 shrink-0 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-7 w-7" />
        <Badge variant="secondary" className="text-[10px] font-mono hidden sm:inline-flex">
          OFFLINE-FIRST
        </Badge>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant={presenterMode ? 'default' : 'ghost'}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setPresenterMode(!presenterMode)}
        >
          <Presentation className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{presenterMode ? 'Presenter ON' : 'Presenter'}</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Demo State</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all saved simulation runs and restore default scenario values. The pilot dataset will remain loaded.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetDemoState}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => navigate('/help')}>
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Docs</span>
        </Button>
      </div>
    </header>
  );
}
