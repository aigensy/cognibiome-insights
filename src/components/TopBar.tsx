import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Presentation, RotateCcw, WifiOff } from 'lucide-react';
import { useAppState } from '@/contexts/AppContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function TopBar() {
  const { presenterMode, setPresenterMode, resetDemoState, adminMode } = useAppState();
  const isOnline = useOnlineStatus();

  return (
    <header className="h-12 flex items-center justify-between border-b border-border px-3 shrink-0 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-7 w-7" />
        {isOnline ? (
          <Badge variant="secondary" className="text-[10px] font-mono hidden sm:inline-flex">
            OFFLINE-FIRST
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-[10px] font-mono hidden sm:inline-flex gap-1">
            <WifiOff className="h-3 w-3" /> OFFLINE
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant={presenterMode ? 'default' : 'ghost'}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setPresenterMode(!presenterMode)}
          title={presenterMode ? 'Exit presenter mode' : 'Enter presenter mode'}
        >
          <Presentation className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{presenterMode ? 'Presenter ON' : 'Presenter'}</span>
        </Button>

        {/* Reset — hidden in presenter mode to keep judge path clean */}
        {!presenterMode && (
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
                  This will clear all saved simulation runs, reset Simulator inputs to defaults,
                  and reload the pilot dataset. Cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetDemoState}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Admin-only label (not shown in presenter mode) */}
        {adminMode && !presenterMode && (
          <Badge variant="outline" className="text-[10px] text-yellow-500 border-yellow-500/30 hidden sm:inline-flex">
            ADMIN
          </Badge>
        )}

      </div>
    </header>
  );
}
