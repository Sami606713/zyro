"use client";

import { fetchSizeGuide } from "@/lib/storefront-api";
import { useEffect, useState } from "react";

type SizeGuideData = {
  sizes: Array<{ size: string; chest: string; waist: string; hips: string }>;
};

export default function SizeGuidePage() {
  const [data, setData] = useState<SizeGuideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSizeGuide()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-10 md:px-12">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Size Guide</h1>
      <p className="mt-3 max-w-[40ch] text-muted">
        Find your perfect fit. Measurements are in inches.
      </p>

      {loading ? (
        <p className="mt-8 text-muted">Loading size guide...</p>
      ) : data ? (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Size</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Chest</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Waist</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Hips</th>
              </tr>
            </thead>
            <tbody>
              {data.sizes.map((row) => (
                <tr key={row.size} className="border-b border-line">
                  <td className="px-4 py-3 font-medium">{row.size}</td>
                  <td className="px-4 py-3 text-muted">{row.chest}"</td>
                  <td className="px-4 py-3 text-muted">{row.waist}"</td>
                  <td className="px-4 py-3 text-muted">{row.hips}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 text-muted">Failed to load size guide.</p>
      )}
    </div>
  );
}
