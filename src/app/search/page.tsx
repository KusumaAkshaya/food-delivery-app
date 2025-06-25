'use client'

import { Suspense } from 'react';
import SearchData from './searchData';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchData />
    </Suspense>
  );
}
