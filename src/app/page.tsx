'use client';

import BarChart, { Category } from '@/components/Charts/BarChart';
import CandidateSelector from '@/components/Selectors/CandidateSelector';
import CategorySelector from '@/components/Selectors/CategorySelector';
import { Candidate, Context } from '@/context/context';
import { fetchData } from '@/utils/api';
import { parseStrNumber } from '@/utils/parseNumber';
import { useContext, useEffect, useState } from 'react';

export const twoCandidatesOptions: Category[] = [
  { name: '總收入', labelFormat: 'currency' },
  { name: '捐贈企業數', labelFormat: 'number' },
  { name: '得票數', labelFormat: 'number' },
  { name: '總支出', labelFormat: 'number' },
];

export default function Home() {
  const { candidates, setPage, setCandidates, initialCandidates } =
    useContext(Context);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    twoCandidatesOptions[0]
  );
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([
    { 姓名: '', 總收入: 0 },
    { 姓名: '', 總收入: 0 },
  ]);

  useEffect(() => {
    setPage({ text: '資訊對比分析', path: '/' });

    async function getCandidates() {
      const candidatesRawData = await fetchData('/api/legislators');
      const finalCandidatesData = candidatesRawData.data.map((obj) =>
        parseStrNumber(obj)
      );
      setCandidates(finalCandidatesData);
      initialCandidates.current = finalCandidatesData;
    }

    getCandidates();
  }, []);

  return (
    <>
      <CandidateSelector
        selectedCandidates={selectedCandidates}
        setSelectedCandidates={setSelectedCandidates}
      />
      <CategorySelector
        options={twoCandidatesOptions}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <BarChart
        candidates={selectedCandidates}
        category={selectedCategory}
        labelFormat={selectedCategory.labelFormat}
      />
    </>
  );
}
