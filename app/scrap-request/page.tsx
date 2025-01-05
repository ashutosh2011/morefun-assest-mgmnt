import React, { Suspense } from 'react';
import { ScrapRequestClient } from './components/ScrapRequestClient';

export default function CreateScrapRequest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrapRequestClient />
    </Suspense>
  );
}