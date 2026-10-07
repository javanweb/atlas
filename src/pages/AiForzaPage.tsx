import React from 'react';
import { ForzaWorkspaceMain } from '../components/forza/workspace/ForzaWorkspaceMain';

export const AiForzaPage: React.FC = () => {
  return (
    <div className="w-screen h-screen min-h-[100svh] max-h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 p-0 m-0">
      <ForzaWorkspaceMain />
    </div>
  );
};
